import type { Request, Response } from "express";

import httpStatus from "http-status";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

import {
  createLocationIntoDB,
  deleteLocationFromDB,
  getAllLocationsFromDB,
  getLocationByIdFromDB,
  getLocationsByProfileIdFromDB,
  updateLocationIntoDB,
} from "./location.service";

import { LocationCreateSchema, LocationUpdateSchema } from "./location.schema";

// Create

export const createLocation = catchAsync(
  async (req: Request, res: Response) => {
    const payload = LocationCreateSchema.parse(req.body);

    const location = await createLocationIntoDB(payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Location created successfully",
      data: {
        location,
      },
    });
  },
);

// Get All

export const getAllLocations = catchAsync(
  async (req: Request, res: Response) => {
    const locations = await getAllLocationsFromDB();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Locations retrieved successfully",
      data: {
        locations,
      },
    });
  },
);

// Get Single

export const getLocationById = catchAsync(
  async (req: Request, res: Response) => {
    const location = await getLocationByIdFromDB(req.params.id as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Location retrieved successfully",
      data: {
        location,
      },
    });
  },
);

// Get By Profile

export const getLocationsByProfileId = catchAsync(
  async (req: Request, res: Response) => {
    const locations = await getLocationsByProfileIdFromDB(
      req.params.profileId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Profile locations retrieved successfully",
      data: {
        locations,
      },
    });
  },
);

// Update

export const updateLocation = catchAsync(
  async (req: Request, res: Response) => {
    const payload = LocationUpdateSchema.parse(req.body);

    const location = await updateLocationIntoDB(
      req.params.id as string,
      payload,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Location updated successfully",
      data: {
        location,
      },
    });
  },
);

// Delete

export const deleteLocation = catchAsync(
  async (req: Request, res: Response) => {
    await deleteLocationFromDB(req.params.id as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.NO_CONTENT,
      message: "Location deleted successfully",
    });
  },
);
