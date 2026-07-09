import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { SigninSchema, SignupSchema } from "./auth.schema";
import {
  createUser,
  checkUserCredentials,
  createAccessToken,
} from "./auth.service";
import { sendResponse, sendResponseToCookies } from "../../utils/sendResponse";
import { Time } from "../../utils/timeHelper";
import httpStatus from "http-status";
import { AppError } from "../../utils/appError";

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const body = SignupSchema.parse(req.body);

    const user = await createUser(body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "user signup successfully",
      data: {
        user,
      },
    });
  },
);

export const signin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const body = SigninSchema.parse(req.body);

    const { accessToken, refreshToken } = await checkUserCredentials(body);

    sendResponseToCookies(res, {
      cookieKey: "accessToken",
      keyValue: accessToken,
      maxAge: Time.day(1),
    });

    sendResponseToCookies(res, {
      cookieKey: "refreshToken",
      keyValue: refreshToken,
      maxAge: Time.day(30),
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "user login successfully",
      data: {
        accessToken,
      },
    });
  },
);

export const refreshToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new AppError("Refresh token not found", httpStatus.UNAUTHORIZED);
    }

    const accessToken = await createAccessToken(refreshToken);

    sendResponseToCookies(res, {
      cookieKey: "accessToken",
      keyValue: accessToken,
      maxAge: Time.day(1),
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Access token generated successfully",
      data: {
        accessToken,
      },
    });
  },
);
