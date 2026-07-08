import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import {
  deleteUserFromDB,
  getAllUsersFromDB,
  getProfileFromDB,
  updateUserIntoDB,
} from "./user.service";
import { AppError } from "../../utils/appError";
import httpStatus from "http-status";
import { sendResponse } from "../../utils/sendResponse";
import { AdminUserSchema, CompleteUserSchema } from "./user.schema";

export const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
    }

    const user = await getProfileFromDB(req.user.id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Profile retrieved successfully",
      data: {
        user,
      },
    });
  },
);

export const deleteMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
    }

    await deleteUserFromDB(req.user.id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.NO_CONTENT,
      message: "Profile deleted successfully",
    });
  },
);

export const updateProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
    }

    const body = CompleteUserSchema.parse(req.body);

    const updatedUser = await updateUserIntoDB(req.user.id, body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Profile updated successfully",
      data: {
        user: updatedUser,
      },
    });
  },
);

export const getUserById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;

    const user = await getProfileFromDB(id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User retrieved successfully",
      data: {
        user,
      },
    });
  },
);

export const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await getAllUsersFromDB();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Users retrieved successfully",
      data: {
        users,
      },
    });
  },
);

export const updateUserById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;

    const body = AdminUserSchema.parse(req.body);

    const updatedUser = await updateUserIntoDB(id, body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User updated successfully",
      data: {
        user: updatedUser,
      },
    });
  },
);

export const deleteUserById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;

    await deleteUserFromDB(id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.NO_CONTENT,
      message: "User deleted successfully",
    });
  },
);
