import type { JwtPayload } from "jsonwebtoken";
import type {
  AuthProvider,
  UserRole,
  UserStatus,
} from "../../../generated/prisma/enums";

import prisma from "../../lib/prisma";

import { createJWT } from "../../utils/jwt";
import { generateToken, hashToken } from "../../utils/token";
import { Time } from "../../utils/timeHelper";

import type { ExtractedSessionInfo } from "../../utils/sessionHelper";

import { AppError } from "../../utils/appError";
import httpStatus from "http-status";
import bcrypt from "bcrypt";

type LoginUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
};

export const validateUserStatus = (user: LoginUser) => {
  switch (user.status) {
    case "ACTIVE":
      return;

    case "BLOCKED":
      throw new AppError(
        "Your account has been blocked. Please contact support.",
        httpStatus.FORBIDDEN,
      );

    case "BANNED":
      throw new AppError(
        "Your account has been banned. Please contact support.",
        httpStatus.FORBIDDEN,
      );

    default:
      throw new AppError("Your account is not active.", httpStatus.FORBIDDEN);
  }
};

export const createLoginSession = async (
  user: LoginUser,
  session: ExtractedSessionInfo,
) => {
  const jwtPayload: JwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = createJWT(jwtPayload, "accessToken");
  const refreshToken = createJWT(jwtPayload, "refreshToken");

  await prisma.$transaction([
    prisma.accountSession.deleteMany({
      where: {
        userId: user.id,
        expiresAt: {
          lt: new Date(),
        },
      },
    }),

    prisma.accountSession.create({
      data: {
        userId: user.id,

        refreshTokenHash: hashToken(refreshToken),

        browser: session.browser,
        operatingSystem: session.operatingSystem,
        deviceType: session.deviceType,

        ipAddress: session.ipAddress,
        userAgent: session.userAgent,

        expiresAt: new Date(Date.now() + Time.day(30)),
      },
    }),
  ]);

  return {
    accessToken,
    refreshToken,
  };
};

export const createPasswordHash = (password: string) => {
  return bcrypt.hash(password, 12);
};

export const findUserByEmail = async (email: string) => {
  return prisma.users.findUnique({
    where: {
      email,
    },
  });
};

export const ensureUserExists = <T>(user: T | null): T => {
  if (!user) {
    throw new AppError("User not found", httpStatus.NOT_FOUND);
  }

  return user;
};

export const ensureManualAccount = (password: string | null) => {
  if (!password) {
    throw new AppError(
      "This account uses social login.",
      httpStatus.BAD_REQUEST,
    );
  }
};

export const createVerificationToken = () => {
  const token = generateToken();

  return {
    token,
    hashedToken: hashToken(token),
    expiresAt: new Date(Date.now() + Time.minute(15)),
  };
};

export const revokeAllUserSessions = async (userId: string) => {
  await prisma.accountSession.updateMany({
    where: {
      userId,
      isRevoked: false,
    },
    data: {
      isRevoked: true,
      revokedAt: new Date(),
    },
  });
};
