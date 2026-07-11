import slugify from "slugify";
import prisma from "../../lib/prisma";
import { AppError } from "../../utils/appError";
import httpStatus from "http-status";
import type {
  FeatureTypeInput,
  FeatureUpdateTypeInput,
} from "./feature.schema";

export const createFeatureIntoDB = async (payload: FeatureTypeInput) => {
  const slug = slugify(payload.name, {
    lower: true,
    strict: true,
  });

  const isExists = await prisma.feature.findFirst({
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
    throw new AppError("feature already exists", httpStatus.BAD_REQUEST);
  }

  const feature = await prisma.feature.create({
    data: {
      name: payload.name,
      slug,
      ...(payload.icon !== undefined && {
        icon: payload.icon,
      }),
    },
  });

  return feature;
};

export const getAllFeaturesFromDB = async () => {
  const features = await prisma.feature.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return features;
};

export const getFeatureByIdFromDB = async (id: string) => {
  const feature = await prisma.feature.findUnique({
    where: {
      id,
    },
  });

  if (!feature) {
    throw new AppError("feature not found", httpStatus.NOT_FOUND);
  }

  return feature;
};

export const updateFeatureIntoDB = async (
  id: string,
  payload: FeatureUpdateTypeInput,
) => {
  const existingFeature = await prisma.feature.findUnique({
    where: {
      id,
    },
  });

  if (!existingFeature) {
    throw new AppError("feature not found", httpStatus.NOT_FOUND);
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

  const isDuplicate = await prisma.feature.findFirst({
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
    throw new AppError("feature already exists", httpStatus.BAD_REQUEST);
  }

  const updatedFeature = await prisma.feature.update({
    where: {
      id,
    },
    data: updatePayload,
  });

  return updatedFeature;
};

export const deleteFeatureFromDB = async (id: string) => {
  const existingFeature = await prisma.feature.findUnique({
    where: {
      id,
    },

    include: {
      _count: {
        select: {
          propertyFeatures: true,
        },
      },
    },
  });

  if (!existingFeature) {
    throw new AppError("feature not found", httpStatus.NOT_FOUND);
  }

  if (existingFeature._count.propertyFeatures > 0) {
    throw new AppError(
      "Cannot delete feature because property exist under this feature",
      httpStatus.BAD_REQUEST,
    );
  }

  await prisma.feature.delete({
    where: {
      id,
    },
  });

  return null;
};
