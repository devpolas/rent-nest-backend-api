import prisma from "../../lib/prisma";
import { retrieveKnowledge } from "./knowledge/retrieval.service";

const propertyIntent =
  /\b(property|properties|rent|rental|apartment|flat|house|bedroom|bedrooms|landlord|available listings|place to live|accommodation|studio)\b/i;

function parseBudget(query: string): number | undefined {
  const normalized = query.replace(/,/g, "");

  const match = normalized.match(
    /\b(?:under|below|less than|maximum|max(?:imum)? of)\s*(?:৳\s*|bdt\s*)?(\d+)\b/i,
  );

  return match ? Number(match[1]) : undefined;
}

function parseBedrooms(query: string): number | undefined {
  const match = query.match(/\b(\d+)\s*(?:bedrooms?|beds?|bhk)\b/i);
  return match ? Number(match[1]) : undefined;
}

function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2);
}

export async function searchAvailableProperties(query: string) {
  if (!propertyIntent.test(query)) return [];

  const [maxRent, minBedrooms] = [parseBudget(query), parseBedrooms(query)];

  const properties = await prisma.property.findMany({
    where: {
      status: "APPROVED",
      availability: "AVAILABLE",
    },
    include: {
      category: {
        select: { name: true, slug: true },
      },
      location: {
        select: {
          country: true,
          division: true,
          district: true,
          city: true,
          village: true,
          postalCode: true,
          addressLine: true,
        },
      },
      images: {
        select: { url: true, isThumbnail: true },
        orderBy: { isThumbnail: "desc" },
        take: 3,
      },
      amenities: {
        include: {
          amenity: { select: { name: true } },
        },
      },
      features: {
        include: {
          feature: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const terms = tokenize(query);

  const ranked = properties
    .filter((property) => {
      if (maxRent !== undefined && Number(property.rent) > maxRent) {
        return false;
      }

      if (minBedrooms !== undefined && property.bedrooms < minBedrooms) {
        return false;
      }

      return true;
    })
    .map((property) => {
      const searchableText = [
        property.title,
        property.description,
        property.category.name,
        property.location?.country,
        property.location?.division,
        property.location?.district,
        property.location?.city,
        property.location?.village,
        ...property.amenities.map((item) => item.amenity.name),
        ...property.features.map((item) => item.feature.name),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const score = terms.reduce(
        (total, term) => total + (searchableText.includes(term) ? 1 : 0),
        0,
      );

      return { property, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map(({ property }) => ({
      id: property.id,
      title: property.title,
      slug: property.slug,
      description: property.description.slice(0, 600),
      rent: property.rent.toString(),
      securityDeposit: property.securityDeposit.toString(),
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area.toString(),
      availableFrom: property.availableFrom,
      availability: property.availability,
      category: property.category.name,
      location: property.location,
      images: property.images.map((image) => image.url),
      amenities: property.amenities.map((item) => item.amenity.name),
      features: property.features.map((item) => item.feature.name),
    }));

  return ranked;
}

export async function prepareChatContext(query: string) {
  const [knowledge, properties] = await Promise.all([
    Promise.resolve(retrieveKnowledge(query)),
    searchAvailableProperties(query),
  ]);

  return { knowledge, properties };
}
