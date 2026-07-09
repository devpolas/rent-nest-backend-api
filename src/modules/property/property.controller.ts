import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AppError } from "../../utils/appError";
import httpStatus from "http-status";
import {
  createPropertyIntoDB,
  deletePropertyFromDB,
  getPropertyByIdFromDB,
  getAllPropertiesFromDB,
  updatePropertyIntoDB,
  getAllMyPropertiesFromDB,
} from "./property.service";
import {
  CompletePropertySchema,
  CompleteUpdateAdminPropertySchema,
  CompleteUpdatePropertySchema,
  PropertyAdminSchema,
} from "./property.schema";
import { sendResponse } from "../../utils/sendResponse";

export const createProperty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError("Unauthorize", httpStatus.UNAUTHORIZED);
    }

    const body = CompletePropertySchema.parse(req.body);

    const property = await createPropertyIntoDB({
      ...body,
      landlordId: req.user.id,
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Property created successfully",
      data: {
        property,
      },
    });
  },
);

export const createPropertyByAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError("Unauthorize", httpStatus.UNAUTHORIZED);
    }

    const body = PropertyAdminSchema.parse(req.body);

    const property = await createPropertyIntoDB(body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Property created successfully",
      data: {
        property,
      },
    });
  },
);

export const getAllProperties = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const properties = await getAllPropertiesFromDB();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Properties retrieved successfully",
      data: {
        properties,
      },
    });
  },
);

export const getAllMyProperties = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError("Unauthorize", httpStatus.UNAUTHORIZED);
    }

    const properties = await getAllMyPropertiesFromDB(req.user.id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Properties retrieved successfully",
      data: {
        properties,
      },
    });
  },
);

export const getPropertyById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;

    const property = await getPropertyByIdFromDB(id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Property retrieved successfully",
      data: {
        property,
      },
    });
  },
);

export const updatePropertyByIdByAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;

    const body = CompleteUpdateAdminPropertySchema.parse(req.body);

    const updatedProperty = await updatePropertyIntoDB(id, body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Property updated successfully",
      data: {
        user: updatedProperty,
      },
    });
  },
);

export const updateMyPropertyById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;

    if (!req.user) {
      throw new AppError("Unauthorize", httpStatus.UNAUTHORIZED);
    }

    const body = CompleteUpdatePropertySchema.parse(req.body);

    const updatedProperty = await updatePropertyIntoDB(id, body, req.user.id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Property updated successfully",
      data: {
        user: updatedProperty,
      },
    });
  },
);

export const deleteMyPropertyById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;

    if (!req.user) {
      throw new AppError("Unauthorize", httpStatus.UNAUTHORIZED);
    }

    await deletePropertyFromDB(id, req.user.id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.NO_CONTENT,
      message: "Property deleted successfully",
    });
  },
);

export const deletePropertyById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;

    await deletePropertyFromDB(id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.NO_CONTENT,
      message: "Property deleted successfully",
    });
  },
);
