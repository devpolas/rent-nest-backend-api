import prisma from "../../lib/prisma";
import { AppError } from "../../utils/appError";
import type {
  AdminPropertyInputType,
  AdminPropertyUpdateInputType,
  PropertyInputType,
  PropertyUpdateInputType,
} from "./property.schema";
import slugify from "slugify";
import httpStatus from "http-status";
import type { Prisma } from "../../../generated/prisma/client";
import { buildPropertyQuery } from "./query.service";

export const createPropertyIntoDB = async ({
  property,
}: {
  property: PropertyInputType | AdminPropertyInputType;
}) => {
  const {
    title,
    description,
    rent,
    securityDeposit,
    bedrooms,
    bathrooms,
    area,
    availableFrom,
    availability,
    categoryId,
    locationId,
    amenities,
    features,
    rules,
  } = property;

  const landlordId = "landlordId" in property ? property.landlordId : undefined;

  if (!landlordId) {
    throw new AppError(
      "You can't create property without landlord",
      httpStatus.UNAUTHORIZED,
    );
  }

  if (locationId) {
    const location = await prisma.location.findUnique({
      where: {
        id: locationId,
      },
    });

    if (!location) {
      throw new AppError("Location not found", httpStatus.NOT_FOUND);
    }
  }

  const slug = slugify(title, {
    lower: true,
    strict: true,
  });

  const existsProperty = await prisma.property.findUnique({
    where: {
      slug,
    },
  });

  if (existsProperty) {
    throw new AppError("Property already exists", httpStatus.BAD_REQUEST);
  }

  const propertyPayload = {
    title,
    slug,
    description,
    rent,
    securityDeposit,
    bedrooms,
    bathrooms,
    area,

    ...(availableFrom !== undefined && {
      availableFrom,
    }),

    ...(availability !== undefined && {
      availability,
    }),

    ...("status" in property &&
      property.status !== undefined && {
        status: property.status,
      }),
  };

  await prisma.$transaction(async (tx) => {
    const createdProperty = await tx.property.create({
      data: {
        ...propertyPayload,

        landlord: {
          connect: {
            id: landlordId,
          },
        },

        category: {
          connect: {
            id: categoryId,
          },
        },

        ...(locationId && {
          location: {
            connect: {
              id: locationId,
            },
          },
        }),
      },
    });

    await tx.propertyFeatures.createMany({
      data: features.map((featureId) => ({
        propertyId: createdProperty.id,
        featureId,
      })),
    });

    await tx.propertyAmenities.createMany({
      data: amenities.map((amenityId) => ({
        propertyId: createdProperty.id,
        amenityId,
      })),
    });

    await tx.propertyRules.createMany({
      data: rules.map((ruleId) => ({
        propertyId: createdProperty.id,
        ruleId,
      })),
    });
  });

  return prisma.property.findUnique({
    where: {
      slug,
    },
    include: {
      images: true,
      amenities: true,
      category: true,
      rules: true,
    },
  });
};

export const updatePropertyIntoDB = async ({
  id,
  property,
  currentLandlord,
}: {
  id: string;
  property: PropertyUpdateInputType | AdminPropertyUpdateInputType;
  currentLandlord?: string;
}) => {
  const existingProperty = await prisma.property.findUnique({
    where: {
      id,
    },
  });

  if (!existingProperty) {
    throw new AppError("Property doesn't exist", httpStatus.NOT_FOUND);
  }

  if (currentLandlord && existingProperty.landlordId !== currentLandlord) {
    throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
  }

  const isRented = await prisma.rentalRequests.count({
    where: {
      propertyId: id,
      status: "ACTIVE",
    },
  });

  if (isRented > 0) {
    throw new AppError(
      "Cannot update a property with an active rental.",
      httpStatus.FORBIDDEN,
    );
  }

  const newLandlordId =
    "landlordId" in property && property.landlordId
      ? property.landlordId
      : undefined;

  if (property.locationId) {
    const location = await prisma.location.findUnique({
      where: {
        id: property.locationId,
      },
    });

    if (!location) {
      throw new AppError("Location not found", httpStatus.NOT_FOUND);
    }
  }

  const propertyPayload = {
    ...(property.title !== undefined && {
      title: property.title,
    }),

    ...(property.description !== undefined && {
      description: property.description,
    }),

    ...(property.rent !== undefined && {
      rent: property.rent,
    }),

    ...(property.securityDeposit !== undefined && {
      securityDeposit: property.securityDeposit,
    }),

    ...(property.bedrooms !== undefined && {
      bedrooms: property.bedrooms,
    }),

    ...(property.bathrooms !== undefined && {
      bathrooms: property.bathrooms,
    }),

    ...(property.area !== undefined && {
      area: property.area,
    }),

    ...(property.availableFrom !== undefined && {
      availableFrom: property.availableFrom,
    }),

    ...(property.availability !== undefined && {
      availability: property.availability,
    }),

    ...("status" in property &&
      property.status !== undefined && {
        status: property.status,
      }),
  };

  await prisma.$transaction(async (tx) => {
    await tx.property.update({
      where: {
        id,
      },

      data: {
        ...propertyPayload,

        ...(property.locationId && {
          location: {
            connect: {
              id: property.locationId,
            },
          },
        }),

        ...(newLandlordId && {
          landlord: {
            connect: {
              id: newLandlordId,
            },
          },
        }),

        ...(property.categoryId && {
          category: {
            connect: {
              id: property.categoryId,
            },
          },
        }),
      },
    });

    if (property.amenities) {
      await tx.propertyAmenities.deleteMany({
        where: {
          propertyId: id,
        },
      });

      await tx.propertyAmenities.createMany({
        data: property.amenities.map((amenityId) => ({
          propertyId: id,
          amenityId,
        })),
      });
    }

    if (property.features) {
      await tx.propertyFeatures.deleteMany({
        where: {
          propertyId: id,
        },
      });

      await tx.propertyFeatures.createMany({
        data: property.features.map((featureId) => ({
          propertyId: id,
          featureId,
        })),
      });
    }

    if (property.rules) {
      await tx.propertyRules.deleteMany({
        where: {
          propertyId: id,
        },
      });

      await tx.propertyRules.createMany({
        data: property.rules.map((ruleId) => ({
          propertyId: id,
          ruleId,
        })),
      });
    }
  });

  return prisma.property.findUnique({
    where: {
      id,
    },
    include: {
      images: true,
      amenities: true,
      category: true,
      rules: true,
    },
  });
};

export const getAllPropertiesFromDB = async (
  query: Record<string, unknown>,
  extraWhere?: Prisma.PropertyWhereInput,
) => {
  const { where, orderBy, skip, take, meta } = buildPropertyQuery(
    query,
    extraWhere,
  );

  const [properties, total] = await prisma.$transaction([
    prisma.property.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        // Basic relations
        images: true,
        category: true,
        location: true,

        // Landlord info
        landlord: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },

        // Rating cache
        _count: {
          select: {
            reviews: true,
          },
        },

        // Rating fields
        // already available from property

        amenities: {
          include: {
            amenity: true,
          },
        },

        features: {
          include: {
            feature: true,
          },
        },

        rules: {
          include: {
            rule: true,
          },
        },
      },
    }),

    prisma.property.count({
      where,
    }),
  ]);

  return {
    meta: {
      ...meta,
      total,
      totalPage: Math.ceil(total / meta.limit),
    },
    properties,
  };
};

export const getPropertyByIdFromDB = async (id: string) => {
  const property = await prisma.property.findUnique({
    where: {
      id,
    },
    include: {
      // Basic relations
      images: true,
      category: true,
      location: true,

      // Landlord info
      landlord: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
      },

      // Rating cache
      _count: {
        select: {
          reviews: true,
        },
      },

      // Rating fields
      // already available from property

      amenities: {
        include: {
          amenity: true,
        },
      },

      features: {
        include: {
          feature: true,
        },
      },

      rules: {
        include: {
          rule: true,
        },
      },
    },
  });

  if (!property) {
    throw new AppError("This Property doesn't exits", httpStatus.NOT_FOUND);
  }

  return property;
};

export const deletePropertyFromDB = async ({
  id,
  landlordId,
}: {
  id: string;
  landlordId?: string;
}) => {
  const existingProperty = await prisma.property.findUnique({
    where: {
      id,
    },
  });

  if (!existingProperty) {
    throw new AppError("Property not found", httpStatus.NOT_FOUND);
  }

  if (landlordId && existingProperty.landlordId !== landlordId) {
    throw new AppError("Forbidden", httpStatus.FORBIDDEN);
  }

  await prisma.property.delete({
    where: {
      id,
    },
    include: {
      images: true,
      amenities: true,
      category: true,
      rules: true,
    },
  });
};
