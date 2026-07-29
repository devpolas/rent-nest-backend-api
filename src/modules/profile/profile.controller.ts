import type { Request, Response } from "express";

import httpStatus from "http-status";

import { ProfileSchema, ProfileUpdateSchema } from "./profile.schema";

import {
  createProfileIntoDB,
  getProfileFromDB,
  updateProfileIntoDB,
} from "./profile.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AppError } from "../../utils/appError";

// Create Profile

export const createProfile = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
  }
  const payload = ProfileSchema.parse(req.body);
  const profile = await createProfileIntoDB({ payload, userId: req.user.id });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Profile created successfully",
    data: {
      profile,
    },
  });
});

// Get Profile

export const getProfile = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
  }

  const profile = await getProfileFromDB(req.user.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Profile retrieved successfully",
    data: {
      profile,
    },
  });
});

// Update Profile
export const updateProfile = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
  }
  const payload = ProfileUpdateSchema.parse(req.body);
  const profile = await updateProfileIntoDB({
    userId: req.user.id,
    payload,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Profile updated successfully",
    data: {
      profile,
    },
  });
});
