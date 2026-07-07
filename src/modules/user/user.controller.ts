import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { getProfileFromDB } from "./user.service";
import { AppError } from "../../utils/appError";
import httpStatus from "http-status";
import { sendResponse } from "../../utils/sendResponse";

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
