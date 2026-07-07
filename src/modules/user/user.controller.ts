import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { getProfileFromDB, updateUserIntoDB } from "./user.service";
import { AppError } from "../../utils/appError";
import httpStatus from "http-status";
import { sendResponse } from "../../utils/sendResponse";
import { CompleteUserSchema } from "./user.schema";

export const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
    }

    const user = await getProfileFromDB(req.user.id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "successfully load your profile",
      data: {
        user,
      },
    });
  },
);

export const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    const body = CompleteUserSchema.parse(req.body);

    const updatedUser = await updateUserIntoDB(id, body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "successfully update your profile",
      data: {
        updatedUser,
      },
    });
  },
);
