import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AppError } from "../../utils/appError";
import httpStatus from "http-status";
import { sendResponse } from "../../utils/sendResponse";
import {
  createSocialProfileIntoDB,
  deleteSocialProfileFromDB,
  getSocialProfileByIdFromDB,
  getSocialProfilesFromDB,
  updateSocialProfileIntoDB,
} from "./social-profile.service";
import {
  SocialProfileCreateSchema,
  SocialProfileUpdateSchema,
} from "./social-profile.schema";

import { getProfileId } from "../profile/profile.service";

// Get my social profiles
export const getMySocialProfiles = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
    }
    const profileId = await getProfileId(req.user.id);
    const socials = await getSocialProfilesFromDB(profileId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Social profiles retrieved successfully",
      data: {
        socials,
      },
    });
  },
);

// Create social profile
export const createSocialProfile = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
    }
    const profileId = await getProfileId(req.user.id);
    const payload = SocialProfileCreateSchema.parse(req.body);
    const social = await createSocialProfileIntoDB(profileId, payload);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Social profile created successfully",
      data: {
        social,
      },
    });
  },
);

// Update social profile
export const updateSocialProfile = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
    }
    const id = req.params.id as string;
    const profileId = await getProfileId(req.user.id);
    const payload = SocialProfileUpdateSchema.parse(req.body);
    const social = await updateSocialProfileIntoDB(id, profileId, payload);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Social profile updated successfully",
      data: {
        social,
      },
    });
  },
);

// Delete social profile
export const deleteSocialProfile = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
    }
    const id = req.params.id as string;
    const profileId = await getProfileId(req.user.id);
    await deleteSocialProfileFromDB(id, profileId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.NO_CONTENT,
      message: "Social profile deleted successfully",
    });
  },
);

// Get social profile by id
export const getSocialProfileById = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const social = await getSocialProfileByIdFromDB(id);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Social profile retrieved successfully",
      data: {
        social,
      },
    });
  },
);
