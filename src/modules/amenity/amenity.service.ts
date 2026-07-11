import slugify from "slugify";
import prisma from "../../lib/prisma";
import { AppError } from "../../utils/appError";
import httpStatus from "http-status";
import type {
  AmenityTypeInput,
  AmenityUpdateTypeInput,
} from "./amenity.schema";

export const createAmenityIntoDB = async (payload: AmenityTypeInput) => {
  const slug = slugify(payload.name, {
    lower: true,
    strict: true,
  });

  const isExists = await prisma.amenity.findFirst({
    where: {
      OR: [
        {
          name: payload.name,
        },
        {
          slug,
        },
      ],
    },
  });

  if (isExists) {
    throw new AppError("amenity already exists", httpStatus.BAD_REQUEST);
  }

  const amenity = await prisma.amenity.create({
    data: {
      name: payload.name,
      slug,
      ...(payload.icon !== undefined && {
        icon: payload.icon,
      }),
    },
  });

  return amenity;
};

export const getAllAmenitiesFromDB = async () => {
  const amenities = await prisma.amenity.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return amenities;
};

export const getAmenityByIdFromDB = async (id: string) => {
  const amenity = await prisma.amenity.findUnique({
    where: {
      id,
    },
  });

  if (!amenity) {
    throw new AppError("amenity not found", httpStatus.NOT_FOUND);
  }

  return amenity;
};

export const updateAmenityIntoDB = async (
  id: string,
  payload: AmenityUpdateTypeInput,
) => {
  const existingAmenity = await prisma.amenity.findUnique({
    where: {
      id,
    },
  });

  if (!existingAmenity) {
    throw new AppError("amenity not found", httpStatus.NOT_FOUND);
  }

  const updatePayload = {
    ...(payload.name !== undefined && {
      name: payload.name,
      slug: slugify(payload.name, {
        lower: true,
        strict: true,
      }),
    }),

    ...(payload.icon !== undefined && {
      icon: payload.icon,
    }),
  };

  const isDuplicate = await prisma.amenity.findFirst({
    where: {
      OR: [
        ...(updatePayload.name
          ? [
              {
                name: updatePayload.name,
              },
            ]
          : []),

        ...(updatePayload.slug
          ? [
              {
                slug: updatePayload.slug,
              },
            ]
          : []),
      ],

      NOT: {
        id,
      },
    },
  });

  if (isDuplicate) {
    throw new AppError("amenity already exists", httpStatus.BAD_REQUEST);
  }

  const updatedAmenity = await prisma.amenity.update({
    where: {
      id,
    },
    data: updatePayload,
  });

  return updatedAmenity;
};

export const deleteAmenityFromDB = async (id: string) => {
  const existingAmenity = await prisma.amenity.findUnique({
    where: {
      id,
    },

    include: {
      _count: {
        select: {
          propertyAmenities: true,
        },
      },
    },
  });

  if (!existingAmenity) {
    throw new AppError("amenity not found", httpStatus.NOT_FOUND);
  }

  if (existingAmenity._count.propertyAmenities > 0) {
    throw new AppError(
      "Cannot delete amenity because property exist under this amenity",
      httpStatus.BAD_REQUEST,
    );
  }

  await prisma.amenity.delete({
    where: {
      id,
    },
  });

  return null;
};
