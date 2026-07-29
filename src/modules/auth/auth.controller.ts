import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

import { catchAsync } from "../../utils/catchAsync";
import { AppError } from "../../utils/appError";
import { sendResponse, sendResponseToCookies } from "../../utils/sendResponse";
import { Time } from "../../utils/timeHelper";

import {
  SignupSchema,
  SigninSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  VerifyEmailSchema,
} from "./auth.schema";

import {
  createUser,
  checkUserCredentials,
  createAccessToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
  sendVerification,
} from "./auth.service";

// Signup
export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const body = SignupSchema.parse(req.body);

    const user = await createUser(body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message:
        "Account created successfully. Please verify your email address.",
      data: {
        user,
      },
    });
  },
);

// Signin
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
      message: "Login successful",
      data: {
        accessToken,
      },
    });
  },
);

// Refresh Token
export const refreshToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.refreshToken;

    if (!token) {
      throw new AppError("Refresh token not found", httpStatus.UNAUTHORIZED);
    }

    const accessToken = await createAccessToken(token);

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

// Verify Email
export const verifyUserEmail = catchAsync(
  async (req: Request, res: Response) => {
    const { email, token } = VerifyEmailSchema.parse(req.query);

    const result = await verifyEmail(email, token);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: result.message,
    });
  },
);

// Resend Verification Email
export const resendVerificationEmail = catchAsync(
  async (req: Request, res: Response) => {
    const { email } = req.body as { email: string };

    await sendVerification(email);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Verification email sent successfully",
    });
  },
);

// Forgot Password
export const forgotUserPassword = catchAsync(
  async (req: Request, res: Response) => {
    const { email } = ForgotPasswordSchema.parse(req.body);

    const result = await forgotPassword(email);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: result.message,
    });
  },
);

// Reset Password
export const resetUserPassword = catchAsync(
  async (req: Request, res: Response) => {
    const { token, password } = ResetPasswordSchema.parse(req.body);

    const result = await resetPassword(token, password);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: result.message,
    });
  },
);
