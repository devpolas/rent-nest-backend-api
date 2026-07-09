import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import type { UserRole } from "../../generated/prisma/enums";
import { AppError } from "../utils/appError";
import httpStatus from "http-status";
import { verifyToken } from "../utils/jwt";
import type { JwtPayload } from "jsonwebtoken";
import prisma from "../lib/prisma";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: UserRole;
      };
    }
  }
}

export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken
      ? req.cookies.accessToken
      : req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization?.split(" ")[1]
        : req.headers.authorization;

    if (!token) {
      throw new AppError("Please login first", httpStatus.UNAUTHORIZED);
    }

    const decode = verifyToken(token, "accessToken");

    const { id } = decode as JwtPayload;

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      omit: {
        password: true,
      },
    });

    if (!user) {
      throw new AppError("create account first", httpStatus.UNAUTHORIZED);
    }

    if (user.status === "BLOCKED") {
      throw new Error("Your account has been blocked. Please contact support.");
    }

    if (user.status === "BANNED") {
      throw new Error("Your account has been banned. Please contact support.");
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    next();
  },
);

export const restrictTo = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
    }

    if (roles.length && !roles.includes(req.user.role)) {
      throw new AppError(
        "You don't have permission to perform this action.",
        httpStatus.FORBIDDEN,
      );
    }

    next();
  };
};
