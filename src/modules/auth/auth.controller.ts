import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { AppError } from "../../utils/appError";
import {
  clearAuthCookies,
  sendResponse,
  sendResponseToCookies,
} from "../../utils/sendResponse";
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
} from "./auth.service";
import {
  extractSessionInfo,
  type ExtractedSessionInfo,
} from "../../utils/sessionHelper";
import { googleLogin, handleGoogleCallback } from "./oauth.service";
import {
  forgotPassword,
  resetPassword,
  sendVerification,
  verifyEmail,
} from "./auth.email";
import {
  logoutCurrentSession,
  logoutOtherSessions,
  logoutSessionById,
} from "./session.service";
import config from "../../config";

function isValidCallbackUrl(url: string) {
  return url.startsWith("/") && !url.startsWith("//");
}

// social login
export const continueWithGoogle = catchAsync(async (req, res) => {
  // Get query parameter safely
  const rawCallbackUrl = req.query.callbackUrl;

  // Ensure it's a string, starts with a single slash, and is not a protocol-relative URL
  const cleanCallbackUrl =
    typeof rawCallbackUrl === "string" && isValidCallbackUrl(rawCallbackUrl)
      ? rawCallbackUrl
      : "/";

  req.session.callbackUrl = cleanCallbackUrl;

  const authorizationUrl = await googleLogin(req);

  res.redirect(authorizationUrl);
});

export const googleCallbackController = catchAsync(async (req, res) => {
  const { code, state } = req.query;

  if (!code || !state) {
    throw new AppError("Invalid Google callback", httpStatus.BAD_REQUEST);
  }

  const sessionInfo = extractSessionInfo(req);

  const { accessToken, refreshToken } = await handleGoogleCallback(
    req.session,
    code as string,
    state as string,
    sessionInfo,
  );

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

  const callbackUrl = req.session.callbackUrl;

  delete req.session.callbackUrl;

  const redirectUrl =
    callbackUrl && isValidCallbackUrl(callbackUrl) ? callbackUrl : "/";

  res.redirect(`${config.website_url}${redirectUrl}`);
});

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

    const systemInfo: ExtractedSessionInfo = extractSessionInfo(req);

    const { accessToken, refreshToken } = await checkUserCredentials(
      body,
      systemInfo,
    );

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
    const { email, token } = VerifyEmailSchema.parse(req.body);

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

export const logout = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  await logoutCurrentSession(refreshToken);

  clearAuthCookies(res);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Logout successful",
  });
});

export const logoutDeviceBySessionId = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
    }

    const sessionId = req.params.sessionId as string;

    const result = await logoutSessionById(req.user.id, sessionId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: result.message,
    });
  },
);

export const logoutFromOtherDevices = catchAsync(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!req.user) {
    throw new AppError("UNAUTHORIZED", httpStatus.UNAUTHORIZED);
  }

  await logoutOtherSessions(req.user.id, refreshToken);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Other devices logged out",
  });
});
