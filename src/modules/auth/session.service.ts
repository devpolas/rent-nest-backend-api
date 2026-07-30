import type { Prisma } from "../../../generated/prisma/client";
import prisma from "../../lib/prisma";
import { AppError } from "../../utils/appError";
import httpStatus from "http-status";
import { hashToken } from "../../utils/token";

const revokeSessions = (where: Prisma.AccountSessionWhereInput) => {
  return prisma.accountSession.updateMany({
    where: {
      ...where,
      isRevoked: false,
    },
    data: {
      isRevoked: true,
      revokedAt: new Date(),
    },
  });
};

export const logoutSessionById = async (userId: string, sessionId: string) => {
  const result = await revokeSessions({
    id: sessionId,
    userId,
  });

  if (result.count === 0) {
    throw new AppError("Session not found", httpStatus.NOT_FOUND);
  }

  return {
    message: "Device logged out successfully",
  };
};

export const logoutCurrentSession = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new AppError("Refresh token not found", httpStatus.UNAUTHORIZED);
  }

  await revokeSessions({
    refreshTokenHash: hashToken(refreshToken),
  });

  return {
    message: "Logged out successfully",
  };
};

export const logoutOtherSessions = async (
  userId: string,
  currentRefreshToken: string,
) => {
  await revokeSessions({
    userId,
    refreshTokenHash: {
      not: hashToken(currentRefreshToken),
    },
  });

  return {
    message: "Logged out from other devices",
  };
};

export const logoutAllSessions = async (userId: string) => {
  await revokeSessions({
    userId,
  });

  return {
    message: "Logged out from all devices",
  };
};
