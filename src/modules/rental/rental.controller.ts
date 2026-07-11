import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import {
  RentalRequestAdminAndOwnerUpdateSchema,
  RentalRequestSchema,
  RentalRequestTenantUpdateSchema,
} from "./rental.schema";
import {
  createRentRequestIntoDB,
  deleteRentRequestFromDB,
  getAllRentRequestsFromDB,
  getRentRequestFromDB,
  updateRentRequestIntoDB,
} from "./rental.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { AppError } from "../../utils/appError";

// Tenant create request
export const createRentRequest = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
    }
    const payload = RentalRequestSchema.parse(req.body);

    const rent = await createRentRequestIntoDB(req.user.id, payload);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Rent request created successfully",
      data: { rent },
    });
  },
);

// Tenant update request
export const updateRentRequestByTenant = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    if (!req.user) {
      throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
    }

    const payload = RentalRequestTenantUpdateSchema.parse(req.body);

    const rent = await updateRentRequestIntoDB({
      rentId: id,
      payload,
      tenantId: req.user.id,
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Rent request updated successfully",
      data: { rent },
    });
  },
);

// Landlord/Admin update request
export const updateRentRequestByOwnerOrAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    if (!req.user) {
      throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
    }

    const payload = RentalRequestAdminAndOwnerUpdateSchema.parse(req.body);

    const rent = await updateRentRequestIntoDB({
      rentId: id,
      payload,
      ...(req.user.role === "LANDLORD" && {
        landlordId: req.user.id,
      }),
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Rent request updated successfully",
      data: { rent },
    });
  },
);

// Get all requests
export const getAllRentRequests = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req;

    if (!user) {
      throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
    }

    const filter: {
      tenantId?: string;
      landlordId?: string;
    } = {};

    if (user.role === "TENANT") {
      filter.tenantId = user.id;
    }

    if (user.role === "LANDLORD") {
      filter.landlordId = user.id;
    }

    const rents = await getAllRentRequestsFromDB(filter);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Rent requests retrieved successfully",
      data: {
        rents,
      },
    });
  },
);

// Get single request
export const getRentRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const rentId = req.params.id as string;
    const { user } = req;

    if (!user) {
      throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
    }

    const filter: {
      tenantId?: string;
      landlordId?: string;
    } = {};

    if (user.role === "TENANT") {
      filter.tenantId = user.id;
    }

    if (user.role === "LANDLORD") {
      filter.landlordId = user.id;
    }

    const rent = await getRentRequestFromDB({
      rentId,
      ...filter,
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Rent request retrieved successfully",
      data: {
        rent,
      },
    });
  },
);

// Delete request
export const deleteRentRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const rentId = req.params.id as string;

    const { user } = req;

    if (!user) {
      throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
    }

    const filter: {
      tenantId?: string;
      landlordId?: string;
    } = {};

    if (user.role === "TENANT") {
      filter.tenantId = user.id;
    }

    if (user.role === "LANDLORD") {
      filter.landlordId = user.id;
    }

    await deleteRentRequestFromDB({
      rentId,
      ...filter,
    });

    sendResponse(res, {
      statusCode: httpStatus.NO_CONTENT,
      success: true,
      message: "Rent request deleted successfully",
    });
  },
);
