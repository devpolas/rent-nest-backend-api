import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import {
  createPropertyCategoryIntoDB,
  deletePropertyCategoryFromDB,
  getAllPropertyCategoriesFromDB,
  getPropertyCategoryByIdFromDB,
  updatePropertyCategoryIntoDB,
} from "./category.service";
import {
  PropertyTypeSchema,
  PropertyUpdateTypeSchema,
} from "./category.schema";

// Create Category
export const createPropertyCategory = catchAsync(
  async (req: Request, res: Response) => {
    const payload = PropertyTypeSchema.parse(req.body);

    const category = await createPropertyCategoryIntoDB(payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Property category created successfully",
      data: {
        category,
      },
    });
  },
);

// Get All Categories
export const getAllPropertyCategories = catchAsync(
  async (req: Request, res: Response) => {
    const categories = await getAllPropertyCategoriesFromDB();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Property categories retrieved successfully",
      data: {
        categories,
      },
    });
  },
);

// Get Category By Id
export const getPropertyCategoryById = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const category = await getPropertyCategoryByIdFromDB(id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Property category retrieved successfully",
      data: {
        category,
      },
    });
  },
);

// Update Category
export const updatePropertyCategory = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const payload = PropertyUpdateTypeSchema.parse(req.body);

    const category = await updatePropertyCategoryIntoDB(id, payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Property category updated successfully",
      data: {
        category,
      },
    });
  },
);

// Delete Category
export const deletePropertyCategory = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    await deletePropertyCategoryFromDB(id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.NO_CONTENT,
      message: "Property category deleted successfully",
    });
  },
);
