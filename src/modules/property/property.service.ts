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
    status,
    images,
    categoryId,
    amenities,
    features,
    rules,
    location,
  } = property;

  const landlordId = "landlordId" in property ? property.landlordId : undefined;

  if (!landlordId) {
    throw new AppError(
      "You can't create property without landlord",
      httpStatus.UNAUTHORIZED,
    );
  }

  const {
    latitude,
    longitude,
    type = "PROPERTY",
    country,
    division,
    district,
    city,
    village,
    postalCode,
    addressLine,
  } = location;

  const slug = slugify(title);

  const exitsProperty = await prisma.property.findUnique({
    where: {
      slug,
    },
  });

  if (exitsProperty) {
    throw new AppError("Property already exits", httpStatus.BAD_REQUEST);
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

    ...(availableFrom !== undefined && { availableFrom }),
    ...(availability !== undefined && { availability }),
    ...(status !== undefined && { status }),
  };

  const locationPayload = {
    type,
    country,
    division,
    district,
    city,
    village,
    postalCode,
    ...(latitude !== undefined && {
      latitude,
    }),
    ...(longitude !== undefined && {
      longitude,
    }),
    ...(addressLine !== undefined && {
      addressLine,
    }),
  };

  await prisma.$transaction(async (tx) => {
    const profile = await tx.profile.findUnique({
      where: {
        userId: landlordId,
      },
      select: {
        id: true,
      },
    });

    if (!profile) {
      throw new AppError("Profile not found", httpStatus.NOT_FOUND);
    }

    const propertyLocation = await tx.location.create({
      data: {
        ...locationPayload,
        profile: {
          connect: {
            id: profile.id,
          },
        },
      },
    });

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

        images: {
          create: images.map((url) => ({
            url,
          })),
        },

        location: {
          connect: {
            id: propertyLocation.id,
          },
        },
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

  const createdProperty = await prisma.property.findUnique({
    where: {
      slug,
    },
    include: {
      images: true,
      location: true,
      landlord: {
        include: {
          profile: true,
        },
        omit: { password: true },
      },

      category: true,
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

  return createdProperty;
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
    include: {
      location: true,
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

  const propertyPayload = {
    ...(property.title !== undefined && { title: property.title }),

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

    ...(property.status !== undefined && {
      status: property.status,
    }),
  };

  const locationPayload = {
    ...(property.location?.country !== undefined && {
      country: property.location.country,
    }),

    ...(property.location?.division !== undefined && {
      division: property.location.division,
    }),

    ...(property.location?.district !== undefined && {
      district: property.location.district,
    }),

    ...(property.location?.city !== undefined && {
      city: property.location.city,
    }),

    ...(property.location?.village !== undefined && {
      village: property.location.village,
    }),

    ...(property.location?.postalCode !== undefined && {
      postalCode: property.location.postalCode,
    }),

    ...(property.location?.latitude !== undefined && {
      latitude: property.location.latitude,
    }),

    ...(property.location?.longitude !== undefined && {
      longitude: property.location.longitude,
    }),

    ...(property.location?.addressLine !== undefined && {
      addressLine: property.location.addressLine,
    }),
  };

  await prisma.$transaction(async (tx) => {
    // Update location
    if (
      Object.keys(locationPayload).length > 0 &&
      existingProperty.locationId
    ) {
      await tx.location.update({
        where: {
          id: existingProperty.locationId,
        },
        data: locationPayload,
      });
    }

    // Update property
    await tx.property.update({
      where: {
        id,
      },
      data: {
        ...propertyPayload,

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

    // Replace images
    if (property.images) {
      await tx.propertyImage.deleteMany({
        where: {
          propertyId: id,
        },
      });

      await tx.propertyImage.createMany({
        data: property.images.map((url) => ({
          propertyId: id,
          url,
        })),
      });
    }

    // Replace amenities
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

    // Replace features
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

    // Replace rules
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

  const updatedProperty = await prisma.property.findUnique({
    where: {
      id,
    },

    include: {
      images: true,

      location: true,

      landlord: {
        include: {
          profile: true,
        },
        omit: {
          password: true,
        },
      },

      category: true,

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

  return updatedProperty;
};

export const getAllPropertiesFromDB = async ({
  landlordId,
}: {
  landlordId?: string;
}) => {
  const properties = await prisma.property.findMany({
    where: { ...(landlordId && { landlordId }) },
    include: {
      images: true,
      location: true,
      landlord: {
        include: {
          profile: true,
        },
        omit: { password: true },
      },

      category: true,
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
    orderBy: { createdAt: "desc" },
  });

  return properties;
};

export const getPropertyByIdFromDB = async (id: string) => {
  const property = await prisma.property.findUnique({
    where: {
      id,
    },
    include: {
      images: true,
      location: true,
      landlord: {
        include: {
          profile: true,
        },
        omit: { password: true },
      },

      category: true,
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
  });
};
