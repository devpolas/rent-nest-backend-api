import type { Request, Response } from "express";

import httpStatus from "http-status";

import { ProfileSchema } from "./profile.schema";

import {
  createOrUpdateProfileIntoDB,
  getProfileFromDB,
} from "./profile.service";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AppError } from "../../utils/appError";

// Create & update Profile
export const createOrUpdateProfile = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
    }
    const payload = ProfileSchema.parse(req.body);
    const profile = await createOrUpdateProfileIntoDB({
      payload,
      userId: req.user.id,
    });
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Profile created or updated successfully",
      data: {
        profile,
      },
    });
  },
);

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
