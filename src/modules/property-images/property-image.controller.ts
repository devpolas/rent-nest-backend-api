import type { Request, Response } from "express";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

import httpStatus from "http-status";

import {
  createPropertyImagesIntoDB,
  getPropertyImagesFromDB,
  setPropertyThumbnailIntoDB,
  deletePropertyImageFromDB,
} from "./property-image.service";

import { CreatePropertyImageSchema } from "./property-image.schema";

export const createImages = catchAsync(async (req: Request, res: Response) => {
  const propertyId = req.params.propertyId as string;
  const payload = CreatePropertyImageSchema.parse(req.body);

  const images = await createPropertyImagesIntoDB(
    propertyId,
    payload,
    req.user!.id,
    req.user!.role,
  );

  sendResponse(res, {
    success: true,

    statusCode: httpStatus.CREATED,

    message: "Images created successfully",

    data: {
      images,
    },
  });
});

export const getPropertyImages = catchAsync(
  async (req: Request, res: Response) => {
    const propertyId = req.params.propertyId as string;
    const images = await getPropertyImagesFromDB(propertyId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Images retrieved successfully",
      data: {
        images,
      },
    });
  },
);

export const setThumbnail = catchAsync(async (req: Request, res: Response) => {
  const propertyId = req.params.propertyId as string;
  const id = req.params.id as string;
  const image = await setPropertyThumbnailIntoDB(
    id,
    propertyId,
    req.user!.id,
    req.user!.role,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Thumbnail updated successfully",
    data: {
      image,
    },
  });
});

export const deleteImage = catchAsync(async (req: Request, res: Response) => {
  await deletePropertyImageFromDB(
    req.params.id as string,
    req.user!.id,
    req.user!.role,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.NO_CONTENT,
    message: "Image deleted successfully",
  });
});
