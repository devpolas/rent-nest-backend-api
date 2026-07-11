import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import {
  createFeatureIntoDB,
  deleteFeatureFromDB,
  getAllFeaturesFromDB,
  getFeatureByIdFromDB,
  updateFeatureIntoDB,
} from "./feature.service";
import { FeatureTypeSchema, FeatureUpdateTypeSchema } from "./feature.schema";

// Create Feature
export const createFeature = catchAsync(async (req: Request, res: Response) => {
  const payload = FeatureTypeSchema.parse(req.body);

  const feature = await createFeatureIntoDB(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Feature created successfully",
    data: {
      feature,
    },
  });
});

// Get All Features
export const getAllFeatures = catchAsync(
  async (req: Request, res: Response) => {
    const features = await getAllFeaturesFromDB();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Features retrieved successfully",
      data: {
        features,
      },
    });
  },
);

// Get Feature By Id
export const getFeatureById = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const feature = await getFeatureByIdFromDB(id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Feature retrieved successfully",
      data: {
        feature,
      },
    });
  },
);

// Update Feature
export const updateFeature = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  const payload = FeatureUpdateTypeSchema.parse(req.body);

  const feature = await updateFeatureIntoDB(id, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Feature updated successfully",
    data: {
      feature,
    },
  });
});

// Delete Feature
export const deleteFeature = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  await deleteFeatureFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.NO_CONTENT,
    message: "Feature deleted successfully",
  });
});
