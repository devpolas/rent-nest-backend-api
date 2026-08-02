import httpStatus from "http-status";
import prisma from "../../lib/prisma";
import type { CreatePropertyImageInput } from "./property-image.schema";
import { AppError } from "../../utils/appError";
import cloudinary from "../../config/cloudinary";

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

// Create property images

export const createPropertyImagesIntoDB = async (
  payload: CreatePropertyImageInput,
  userId: string,
  role: string,
) => {
  await checkPropertyPermission(payload.propertyId, userId, role);

  await prisma.propertyImage.createMany({
    data: payload.images.map((image, index) => ({
      propertyId: payload.propertyId,
      url: image.url,
      publicId: image.publicId,

      // First uploaded image becomes thumbnail
      isThumbnail: index === 0,
    })),
  });

  return prisma.propertyImage.findMany({
    where: {
      propertyId: payload.propertyId,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

// Get property images

export const getPropertyImagesFromDB = async (propertyId: string) => {
  return prisma.propertyImage.findMany({
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
    await tx.propertyImage.updateMany({
      where: {
        propertyId,
      },

      data: {
        isThumbnail: false,
      },
    });

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

// Delete property image

export const deletePropertyImageFromDB = async (
  imageId: string,
  userId: string,
  role: string,
) => {
  const image = await prisma.propertyImage.findUnique({
    where: {
      id: imageId,
    },
  });

  if (!image) {
    throw new AppError("Image not found", httpStatus.NOT_FOUND);
  }

  await checkPropertyPermission(image.propertyId, userId, role);

  const imageCount = await prisma.propertyImage.count({
    where: {
      propertyId: image.propertyId,
    },
  });

  if (image.isThumbnail && imageCount === 1) {
    throw new AppError("Cannot delete the only image.", httpStatus.BAD_REQUEST);
  }

  // Delete from Cloudinary
  const result = await cloudinary.uploader.destroy(image.publicId);

  if (result.result !== "ok" && result.result !== "not found") {
    throw new AppError(
      "Failed to delete image from Cloudinary.",
      httpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  await prisma.propertyImage.delete({
    where: {
      id: imageId,
    },
  });

  // If thumbnail was deleted and there are remaining images,
  // promote the newest image to thumbnail.
  if (image.isThumbnail) {
    const nextImage = await prisma.propertyImage.findFirst({
      where: {
        propertyId: image.propertyId,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    if (nextImage) {
      await prisma.propertyImage.update({
        where: {
          id: nextImage.id,
        },

        data: {
          isThumbnail: true,
        },
      });
    }
  }

  return null;
};
