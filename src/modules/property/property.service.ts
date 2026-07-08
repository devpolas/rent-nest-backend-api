import prisma from "../../lib/prisma";
import { AppError } from "../../utils/appError";
import type { PropertyInputType } from "./property.schema";
import slugify from "slugify";
import httpStatus from "http-status";

export const createPropertyIntoDB = async (
  landlordId: string,
  property: PropertyInputType,
) => {
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

export const deletePropertyFromDB = async (id: string) => {
  const property = await prisma.property.findUnique({
    where: {
      id,
    },
  });

  if (!property) {
    throw new AppError("This Property doesn't exits", httpStatus.NOT_FOUND);
  }

  await prisma.property.delete({
    where: {
      id,
    },
  });
};
