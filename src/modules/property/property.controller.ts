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
} from "./property.service";
import {
  CompletePropertySchema,
  CompleteUpdateAdminPropertySchema,
  CompleteUpdatePropertySchema,
  PropertyAdminSchema,
  type AdminPropertyInputType,
  type AdminPropertyUpdateInputType,
  type PropertyInputType,
  type PropertyUpdateInputType,
} from "./property.schema";
import { sendResponse } from "../../utils/sendResponse";

export const createProperty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    let body: PropertyInputType | AdminPropertyInputType;

    const filter: {
      landlordId?: string;
    } = {};

    if (!user) {
      throw new AppError("Unauthorize", httpStatus.UNAUTHORIZED);
    }

    if (user.role === "LANDLORD") {
      filter.landlordId = user.id;
    }

    if (user.role === "LANDLORD") {
      body = CompletePropertySchema.parse(req.body);
    } else if (user.role === "ADMIN") {
      body = PropertyAdminSchema.parse(req.body);
    } else {
      throw new AppError("Forbidden", httpStatus.FORBIDDEN);
    }

    const property =
      user.role === "LANDLORD" ? { ...body, landlordId: user.id } : body;

    const newProperty = await createPropertyIntoDB({
      property,
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Property created successfully",
      data: {
        property: newProperty,
      },
    });
  },
);

export const getAllProperties = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    const filter: {
      landlordId?: string;
    } = {};

    if (user) {
      filter.landlordId = user.id;
    }

    const properties = await getAllPropertiesFromDB({ ...filter });

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

export const updatePropertyById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    const user = req.user;
    let body: PropertyUpdateInputType | AdminPropertyUpdateInputType;

    const filter: {
      currentLandlord?: string;
    } = {};

    if (!user) {
      throw new AppError("Unauthorize", httpStatus.UNAUTHORIZED);
    }

    if (user.role === "LANDLORD") {
      filter.currentLandlord = user.id;
      body = CompleteUpdatePropertySchema.parse(req.body);
    } else if (user.role === "ADMIN") {
      body = CompleteUpdateAdminPropertySchema.parse(req.body);
    } else {
      throw new AppError("Forbidden", httpStatus.FORBIDDEN);
    }

    const updatedProperty = await updatePropertyIntoDB({
      id,
      property: body,
      ...filter,
    });

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

export const deletePropertyById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;

    const filter: {
      landlordId?: string;
    } = {};

    if (!req.user) {
      throw new AppError("Unauthorize", httpStatus.UNAUTHORIZED);
    }

    if (req.user.role === "LANDLORD") {
      filter.landlordId = req.user.id;
    }

    await deletePropertyFromDB({ id, ...filter });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.NO_CONTENT,
      message: "Property deleted successfully",
    });
  },
);
