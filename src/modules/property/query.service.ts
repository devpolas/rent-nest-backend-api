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

    // Rating filters
    minRating,
    minReviews,

    sortBy = "createdAt",
    sortOrder = "desc",

    page = "1",
    limit = "10",
  } = query as PropertyQuery;

  const andConditions: Prisma.PropertyWhereInput[] = [];

  // ... keep your existing search/category/location/rent/area code

  // ======================
  // Rating Filter
  // ======================

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

  // ======================
  // Amenities
  // ======================

  if (amenityIds) {
    const ids = String(amenityIds).split(",").filter(Boolean);

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

  // ======================
  // Features
  // ======================

  if (featureIds) {
    const ids = String(featureIds).split(",").filter(Boolean);

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

  // ======================
  // Rules
  // ======================

  if (ruleIds) {
    const ids = String(ruleIds).split(",").filter(Boolean);

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

  // ======================
  // Final Where
  // ======================

  const where: Prisma.PropertyWhereInput = {
    ...extraWhere,

    ...(andConditions.length && {
      AND: andConditions,
    }),
  };

  // ======================
  // Pagination
  // ======================

  const pageNumber = Math.max(Number(page), 1);

  const limitNumber = Math.min(Number(limit), 100);

  const skip = (pageNumber - 1) * limitNumber;

  // ======================
  // Sorting
  // ======================

  const allowedSortFields = [
    "createdAt",
    "updatedAt",
    "rent",
    "area",
    "bedrooms",
    "bathrooms",
    "averageRating",
    "reviewCount",
  ];

  const sortField = allowedSortFields.includes(String(sortBy))
    ? String(sortBy)
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
