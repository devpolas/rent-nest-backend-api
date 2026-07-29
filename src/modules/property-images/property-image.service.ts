import prisma from "../../lib/prisma";
import { AppError } from "../../utils/appError";
import httpStatus from "http-status";

import type { CreatePropertyImageInput } from "./property-image.schema";

// Check property permission

const checkPropertyPermission = async (
  propertyId: string,
  userId: string,
  role: string,
) => {
  const property = await prisma.property.findUnique({
    where: {
      id: propertyId,
    },
  });

  if (!property) {
    throw new AppError("Property not found", httpStatus.NOT_FOUND);
  }

  if (role !== "ADMIN" && property.landlordId !== userId) {
    throw new AppError("You don't have permission", httpStatus.FORBIDDEN);
  }

  return property;
};

// Create images

export const createPropertyImagesIntoDB = async (
  payload: CreatePropertyImageInput,
  userId: string,
  role: string,
) => {
  await checkPropertyPermission(payload.propertyId, userId, role);

  const images = await prisma.propertyImage.createMany({
    data: payload.images.map((url) => ({
      propertyId: payload.propertyId,

      url,
    })),
  });

  return images;
};

// Get images

export const getPropertyImagesFromDB = async (propertyId: string) => {
  const images = await prisma.propertyImage.findMany({
    where: {
      propertyId,
    },

    orderBy: [
      {
        isThumbnail: "desc",
      },

      {
        createdAt: "desc",
      },
    ],
  });

  return images;
};

// Set thumbnail

export const setPropertyThumbnailIntoDB = async (
  imageId: string,
  propertyId: string,
  userId: string,
  role: string,
) => {
  await checkPropertyPermission(propertyId, userId, role);

  const image = await prisma.propertyImage.findUnique({
    where: {
      id: imageId,
    },
  });

  if (!image) {
    throw new AppError("Image not found", httpStatus.NOT_FOUND);
  }

  if (image.propertyId !== propertyId) {
    throw new AppError("Invalid image", httpStatus.BAD_REQUEST);
  }

  await prisma.$transaction(async (tx) => {
    // remove old thumbnail

    await tx.propertyImage.updateMany({
      where: {
        propertyId,
        isThumbnail: true,
      },

      data: {
        isThumbnail: false,
      },
    });

    // set new thumbnail

    await tx.propertyImage.update({
      where: {
        id: imageId,
      },

      data: {
        isThumbnail: true,
      },
    });
  });

  return prisma.propertyImage.findUnique({
    where: {
      id: imageId,
    },
  });
};

// Delete image

export const deletePropertyImageFromDB = async (
  imageId: string,
  userId: string,
  role: string,
) => {
  const image = await prisma.propertyImage.findUnique({
    where: {
      id: imageId,
    },

    include: {
      property: true,
    },
  });

  if (!image) {
    throw new AppError("Image not found", httpStatus.NOT_FOUND);
  }

  await checkPropertyPermission(image.propertyId, userId, role);

  // protect only thumbnail

  if (image.isThumbnail) {
    const imageCount = await prisma.propertyImage.count({
      where: {
        propertyId: image.propertyId,
      },
    });

    if (imageCount === 1) {
      throw new AppError(
        "Cannot delete the only thumbnail image",
        httpStatus.BAD_REQUEST,
      );
    }
  }

  await prisma.propertyImage.delete({
    where: {
      id: imageId,
    },
  });
};
