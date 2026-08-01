import {
  AvailabilityStatus,
  Prisma,
  PropertyStatus,
} from "../../../generated/prisma/client";
import type { PropertyQuery } from "./property.schema";

export const buildPropertyQuery = (
  query: Record<string, unknown>,
  extraWhere?: Prisma.PropertyWhereInput,
) => {
  const {
    search,
    category,
    categoryId,
    country,
    division,
    district,
    city,
    village,
    minRent,
    maxRent,
    minArea,
    maxArea,
    bedrooms,
    bathrooms,
    availability,
    status,
    amenityIds,
    featureIds,
    ruleIds,
    minRating,
    minReviews,
    sortBy = "createdAt",
    sortOrder = "desc",
    page = "1",
    limit = "10",
  } = query as PropertyQuery;

  const andConditions: Prisma.PropertyWhereInput[] = [];

  // Search

  if (search) {
    const keyword = String(search);

    andConditions.push({
      OR: [
        {
          title: {
            contains: keyword,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: keyword,
            mode: "insensitive",
          },
        },
        {
          category: {
            name: {
              contains: keyword,
              mode: "insensitive",
            },
          },
        },
        {
          location: {
            OR: [
              {
                country: {
                  contains: keyword,
                  mode: "insensitive",
                },
              },
              {
                division: {
                  contains: keyword,
                  mode: "insensitive",
                },
              },
              {
                district: {
                  contains: keyword,
                  mode: "insensitive",
                },
              },
              {
                city: {
                  contains: keyword,
                  mode: "insensitive",
                },
              },
              {
                village: {
                  contains: keyword,
                  mode: "insensitive",
                },
              },
              {
                postalCode: {
                  contains: keyword,
                  mode: "insensitive",
                },
              },
            ],
          },
        },
      ],
    });
  }

  // Category

  if (categoryId) {
    andConditions.push({
      categoryId: String(categoryId),
    });
  }

  if (category) {
    andConditions.push({
      category: {
        slug: String(category),
      },
    });
  }

  // Location

  const locationFilter: Prisma.LocationWhereInput = {};

  if (country) {
    locationFilter.country = {
      equals: String(country),
      mode: "insensitive",
    };
  }

  if (division) {
    locationFilter.division = {
      equals: String(division),
      mode: "insensitive",
    };
  }

  if (district) {
    locationFilter.district = {
      equals: String(district),
      mode: "insensitive",
    };
  }

  if (city) {
    locationFilter.city = {
      equals: String(city),
      mode: "insensitive",
    };
  }

  if (village) {
    locationFilter.village = {
      equals: String(village),
      mode: "insensitive",
    };
  }

  if (Object.keys(locationFilter).length > 0) {
    andConditions.push({
      location: locationFilter,
    });
  }

  // Rent

  if (minRent || maxRent) {
    const rentFilter: Prisma.DecimalFilter = {};

    if (minRent) {
      rentFilter.gte = new Prisma.Decimal(String(minRent));
    }

    if (maxRent) {
      rentFilter.lte = new Prisma.Decimal(String(maxRent));
    }

    andConditions.push({
      rent: rentFilter,
    });
  }

  // Area

  if (minArea || maxArea) {
    const areaFilter: Prisma.DecimalFilter = {};

    if (minArea) {
      areaFilter.gte = new Prisma.Decimal(String(minArea));
    }

    if (maxArea) {
      areaFilter.lte = new Prisma.Decimal(String(maxArea));
    }

    andConditions.push({
      area: areaFilter,
    });
  }

  // Bedrooms

  if (bedrooms) {
    andConditions.push({
      bedrooms: {
        gte: Number(bedrooms),
      },
    });
  }

  // Bathrooms

  if (bathrooms) {
    andConditions.push({
      bathrooms: {
        gte: Number(bathrooms),
      },
    });
  }

  // Availability

  if (availability) {
    andConditions.push({
      availability: availability as AvailabilityStatus,
    });
  }

  // Status

  if (status) {
    andConditions.push({
      status: status as PropertyStatus,
    });
  }

  // Rating

  if (minRating) {
    andConditions.push({
      averageRating: {
        gte: new Prisma.Decimal(String(minRating)),
      },
    });
  }

  if (minReviews) {
    andConditions.push({
      reviewCount: {
        gte: Number(minReviews),
      },
    });
  }

  // Amenities (must contain all)

  if (amenityIds) {
    const ids = String(amenityIds)
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    andConditions.push(
      ...ids.map((id) => ({
        amenities: {
          some: {
            amenityId: id,
          },
        },
      })),
    );
  }

  // Features (must contain all)

  if (featureIds) {
    const ids = String(featureIds)
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    andConditions.push(
      ...ids.map((id) => ({
        features: {
          some: {
            featureId: id,
          },
        },
      })),
    );
  }

  // Rules (must contain all)

  if (ruleIds) {
    const ids = String(ruleIds)
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    andConditions.push(
      ...ids.map((id) => ({
        rules: {
          some: {
            ruleId: id,
          },
        },
      })),
    );
  }

  // Final Where

  const where: Prisma.PropertyWhereInput = {
    ...(extraWhere ?? {}),
    ...(andConditions.length > 0 && {
      AND: andConditions,
    }),
  };

  // Pagination

  const pageNumber = Math.max(1, Number(page) || 1);
  const limitNumber = Math.min(100, Math.max(1, Number(limit) || 10));

  const skip = (pageNumber - 1) * limitNumber;

  // Sorting

  const allowedSortFields = [
    "createdAt",
    "updatedAt",
    "rent",
    "area",
    "bedrooms",
    "bathrooms",
    "averageRating",
    "reviewCount",
  ] as const;

  const sortField = allowedSortFields.includes(
    String(sortBy) as (typeof allowedSortFields)[number],
  )
    ? (String(sortBy) as (typeof allowedSortFields)[number])
    : "createdAt";

  const orderBy: Prisma.PropertyOrderByWithRelationInput = {
    [sortField]: sortOrder === "asc" ? "asc" : "desc",
  };

  return {
    where,
    orderBy,
    skip,
    take: limitNumber,
    meta: {
      page: pageNumber,
      limit: limitNumber,
    },
  };
};
