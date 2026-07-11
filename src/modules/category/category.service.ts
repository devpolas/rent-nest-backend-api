import slugify from "slugify";
import prisma from "../../lib/prisma";
import { AppError } from "../../utils/appError";
import httpStatus from "http-status";
import type {
  PropertyTypeInput,
  PropertyUpdateTypeInput,
} from "./category.schema";

// Create Property Category
export const createPropertyCategoryIntoDB = async (
  payload: PropertyTypeInput,
) => {
  const slug = slugify(payload.name, {
    lower: true,
    strict: true,
  });

  const isExists = await prisma.propertyCategory.findFirst({
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
    throw new AppError(
      "Property category already exists",
      httpStatus.BAD_REQUEST,
    );
  }

  const category = await prisma.propertyCategory.create({
    data: {
      name: payload.name,
      slug,
      ...(payload.icon !== undefined && {
        icon: payload.icon,
      }),
    },
  });

  return category;
};

// Get All Property Categories
export const getAllPropertyCategoriesFromDB = async () => {
  const categories = await prisma.propertyCategory.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return categories;
};

// Get Single Property Category
export const getPropertyCategoryByIdFromDB = async (id: string) => {
  const category = await prisma.propertyCategory.findUnique({
    where: {
      id,
    },
  });

  if (!category) {
    throw new AppError("Property category not found", httpStatus.NOT_FOUND);
  }

  return category;
};

// Update Property Category
export const updatePropertyCategoryIntoDB = async (
  id: string,
  payload: PropertyUpdateTypeInput,
) => {
  const existingCategory = await prisma.propertyCategory.findUnique({
    where: {
      id,
    },
  });

  if (!existingCategory) {
    throw new AppError("Property category not found", httpStatus.NOT_FOUND);
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

  const isDuplicate = await prisma.propertyCategory.findFirst({
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
    throw new AppError(
      "Property category already exists",
      httpStatus.BAD_REQUEST,
    );
  }

  const updatedCategory = await prisma.propertyCategory.update({
    where: {
      id,
    },
    data: updatePayload,
  });

  return updatedCategory;
};

// Delete Property Category
export const deletePropertyCategoryFromDB = async (id: string) => {
  const existingCategory = await prisma.propertyCategory.findUnique({
    where: {
      id,
    },

    include: {
      _count: {
        select: {
          properties: true,
        },
      },
    },
  });

  if (!existingCategory) {
    throw new AppError("Property category not found", httpStatus.NOT_FOUND);
  }

  if (existingCategory._count.properties > 0) {
    throw new AppError(
      "Cannot delete category because properties exist under this category",
      httpStatus.BAD_REQUEST,
    );
  }

  await prisma.propertyCategory.delete({
    where: {
      id,
    },
  });

  return null;
};
