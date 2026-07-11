import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import {
  createAmenityIntoDB,
  deleteAmenityFromDB,
  getAllAmenitiesFromDB,
  getAmenityByIdFromDB,
  updateAmenityIntoDB,
} from "./amenity.service";
import { AmenityTypeSchema, AmenityUpdateTypeSchema } from "./amenity.schema";

// Create Amenity
export const createAmenity = catchAsync(async (req: Request, res: Response) => {
  const payload = AmenityTypeSchema.parse(req.body);

  const amenity = await createAmenityIntoDB(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Amenity created successfully",
    data: {
      amenity,
    },
  });
});

// Get All Amenities
export const getAllAmenities = catchAsync(
  async (req: Request, res: Response) => {
    const amenities = await getAllAmenitiesFromDB();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Amenities retrieved successfully",
      data: {
        amenities,
      },
    });
  },
);

// Get Amenity By Id
export const getAmenityById = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const amenity = await getAmenityByIdFromDB(id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Amenity retrieved successfully",
      data: {
        amenity,
      },
    });
  },
);

// Update Amenity
export const updateAmenity = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  const payload = AmenityUpdateTypeSchema.parse(req.body);

  const amenity = await updateAmenityIntoDB(id, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Amenity updated successfully",
    data: {
      amenity,
    },
  });
});

// Delete Amenity
export const deleteAmenity = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  await deleteAmenityFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.NO_CONTENT,
    message: "Amenity deleted successfully",
  });
});
