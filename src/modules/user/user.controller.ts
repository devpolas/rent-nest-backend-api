import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import {
  deleteUserFromDB,
  getAllUsersFromDB,
  getUserByIdFromDB,
  updateUserIntoDB,
} from "./user.service";
import { AppError } from "../../utils/appError";
import httpStatus from "http-status";
import { sendResponse } from "../../utils/sendResponse";
import { AdminUserSchema, UserUpdateSchema } from "./user.schema";

// Get current logged in user

export const getMe = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
  }

  const user = await getUserByIdFromDB(req.user.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User retrieved successfully",
    data: {
      user,
    },
  });
});

// Update current user

export const updateMe = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
  }

  const body = UserUpdateSchema.parse(req.body);

  const updatedUser = await updateUserIntoDB(req.user.id, body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User updated successfully",
    data: {
      user: updatedUser,
    },
  });
});

// Delete current user

export const deleteMe = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
  }

  await deleteUserFromDB(req.user.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.NO_CONTENT,
    message: "User deleted successfully",
  });
});

// Get user by id (Admin/Public)

export const getUserById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  const user = await getUserByIdFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User retrieved successfully",
    data: {
      user,
    },
  });
});

// Get all users

export const getAllUsers = catchAsync(async (_req: Request, res: Response) => {
  const users = await getAllUsersFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Users retrieved successfully",
    data: {
      users,
    },
  });
});

// Admin update user

export const updateUserById = catchAsync(
  async (req: Request, res: Response) => {
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

// Admin delete user

export const deleteUserById = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    await deleteUserFromDB(id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.NO_CONTENT,
      message: "User deleted successfully",
    });
  },
);
