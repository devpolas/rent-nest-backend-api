import type { Request, Response } from "express";
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
  PropertySchema,
  AdminPropertySchema,
  PropertyUpdateSchema,
  AdminPropertyUpdateSchema,
  type AdminPropertyInputType,
  type AdminPropertyUpdateInputType,
  type PropertyInputType,
  type PropertyUpdateInputType,
} from "./property.schema";
import { sendResponse } from "../../utils/sendResponse";
import type { Prisma } from "../../../generated/prisma/client";

// Create Property
export const createProperty = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;

    if (!user) {
      throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
    }

    let property: PropertyInputType | AdminPropertyInputType;

    if (user.role === "LANDLORD") {
      property = {
        ...PropertySchema.parse(req.body),
        landlordId: user.id,
      };
    } else if (user.role === "ADMIN") {
      property = AdminPropertySchema.parse(req.body);
    } else {
      throw new AppError("Forbidden", httpStatus.FORBIDDEN);
    }

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

// Get All Properties
export const getAllProperties = catchAsync(
  async (req: Request, res: Response) => {
    const extraWhere: Prisma.PropertyWhereInput = {};
    const user = req.user;

    // Landlord can see only his properties
    if (user?.role === "LANDLORD") {
      extraWhere.landlordId = user.id;
    }

    const result = await getAllPropertiesFromDB(req.query, extraWhere);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Properties retrieved successfully",
      data: result,
    });
  },
);

// Get Property By Id
export const getPropertyById = catchAsync(
  async (req: Request, res: Response) => {
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

// Update Property
export const updatePropertyById = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const user = req.user;

    if (!user) {
      throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
    }

    let property: PropertyUpdateInputType | AdminPropertyUpdateInputType;

    const filter: {
      currentLandlord?: string;
    } = {};

    if (user.role === "LANDLORD") {
      filter.currentLandlord = user.id;

      property = PropertyUpdateSchema.parse(req.body);
    } else if (user.role === "ADMIN") {
      property = AdminPropertyUpdateSchema.parse(req.body);
    } else {
      throw new AppError("Forbidden", httpStatus.FORBIDDEN);
    }

    const updatedProperty = await updatePropertyIntoDB({
      id,
      property,
      ...filter,
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Property updated successfully",
      data: {
        property: updatedProperty,
      },
    });
  },
);

// Delete Property
export const deletePropertyById = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const user = req.user;

    if (!user) {
      throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
    }

    const filter: {
      landlordId?: string;
    } = {};

    if (user.role === "LANDLORD") {
      filter.landlordId = user.id;
    }

    await deletePropertyFromDB({
      id,
      ...filter,
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.NO_CONTENT,
      message: "Property deleted successfully",
    });
  },
);
