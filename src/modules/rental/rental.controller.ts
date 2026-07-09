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

export const createRentRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
    }

    const body = RentalRequestSchema.parse(req.body);

    const rentRequest = await createRentRequestIntoDB(req.user.id, body);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Rent request created successfully",
      data: {
        rent: rentRequest,
      },
    });
  },
);

export const updateRentRequestByLandlordAndAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
    }
    const id = req.params.id as string;

    const body = RentalRequestAdminAndOwnerUpdateSchema.parse(req.body);

    const rentRequest = await updateRentRequestIntoDB(
      id,
      body,
      undefined,
      req.user.id,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Rent request created successfully",
      data: {
        rent: rentRequest,
      },
    });
  },
);

export const updateRentRequestByTenantById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
    }
    const id = req.params.id as string;

    const body = RentalRequestTenantUpdateSchema.parse(req.body);

    const rentRequest = await updateRentRequestIntoDB(id, body, req.user.id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Rent request created successfully",
      data: {
        rent: rentRequest,
      },
    });
  },
);

export const getAllRentRequestByTenant = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
    }

    const rents = await getAllRentRequestsFromDB(req.user.id, undefined);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Rent requests retrieved successfully",
      data: { rents },
    });
  },
);

export const getRentRequestByTenantById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
    }

    const id = req.params.id as string;
    const rent = await getRentRequestFromDB(id, req.user.id, undefined);

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

export const deleteRentRequestByTenantById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
    }

    const id = req.params.id as string;

    await deleteRentRequestFromDB(id, req.user.id, undefined);

    sendResponse(res, {
      statusCode: httpStatus.NO_CONTENT,
      success: true,
      message: "Rent request deleted successfully",
    });
  },
);

export const getAllRentRequestByOwner = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
    }

    const rents = await getAllRentRequestsFromDB(undefined, req.user.id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Rent requests retrieved successfully",
      data: { rents },
    });
  },
);

export const getRentRequestByOwnerById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
    }
    const id = req.params.id as string;
    const rent = await getRentRequestFromDB(id, undefined, req.user.id);

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

export const deleteRentRequestByOwnerById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
    }

    const id = req.params.id as string;

    await deleteRentRequestFromDB(id, undefined, req.user.id);

    sendResponse(res, {
      statusCode: httpStatus.NO_CONTENT,
      success: true,
      message: "Rent request deleted successfully",
    });
  },
);

export const getAllRentRequestByAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
    }

    const rents = await getAllRentRequestsFromDB();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Rent requests retrieved successfully",
      data: { rents },
    });
  },
);

export const getRentRequestByAdminById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    if (!req.user) {
      throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
    }

    const rent = await getRentRequestFromDB(id);

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

export const deleteRentRequestByAdminById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
    }
    const id = req.params.id as string;
    await deleteRentRequestFromDB(id);

    sendResponse(res, {
      statusCode: httpStatus.NO_CONTENT,
      success: true,
      message: "Rent request deleted successfully",
    });
  },
);
