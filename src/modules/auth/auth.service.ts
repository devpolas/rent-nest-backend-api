import httpStatus from "http-status";
import bcrypt from "bcrypt";
import { AppError } from "../../utils/appError";
import type { SigninPayload, SignupPayload } from "./auth.schema";
import prisma from "../../lib/prisma";
import { createJWT } from "../../utils/jwt";
import type { JwtPayload } from "jsonwebtoken";
import { hashToken } from "../../utils/token";
import type { ExtractedSessionInfo } from "../../utils/sessionHelper";
import {
  createLoginSession,
  createPasswordHash,
  ensureManualAccount,
  ensureUserExists,
  findUserByEmail,
  validateUserStatus,
} from "./auth.helper";
import { sendVerification } from "./auth.email";

//signup
export const createUser = async (payload: SignupPayload) => {
  const { name, email, password, role } = payload;

  const exists = await findUserByEmail(email);

  if (exists) {
    throw new AppError("User already exists", httpStatus.BAD_REQUEST);
  }

  const hashedPassword = await createPasswordHash(password);

  const user = await prisma.$transaction(async (tx) => {
    const createdUser = await tx.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    await tx.authAccounts.create({
      data: {
        userId: createdUser.id,
        provider: "LOCAL",
      },
    });

    return createdUser;
  });

  await sendVerification(user.email);

  return prisma.users.findUnique({
    where: {
      id: user.id,
    },
    omit: {
      password: true,
    },
  });
};

// login
export const checkUserCredentials = async (
  payload: SigninPayload,
  session: ExtractedSessionInfo,
) => {
  const { email, password } = payload;

  const user = ensureUserExists(await findUserByEmail(email));

  validateUserStatus(user);

  ensureManualAccount(user.password);

  if (!user.emailVerified) {
    await sendVerification(user.email);

    throw new AppError(
      "Please verify your email before login.",
      httpStatus.FORBIDDEN,
    );
  }

  const matched = await bcrypt.compare(password, user.password as string);

  if (!matched) {
    throw new AppError("Invalid credentials", httpStatus.UNAUTHORIZED);
  }

  return createLoginSession(user, session);
};

export const createAccessToken = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new AppError("Refresh token missing", httpStatus.UNAUTHORIZED);
  }

  const hashedRefreshToken = hashToken(refreshToken);

  const session = await prisma.accountSession.findUnique({
    where: {
      refreshTokenHash: hashedRefreshToken,
    },

    include: {
      user: true,
    },
  });

  if (!session) {
    throw new AppError(
      "Session expired. Please login again.",
      httpStatus.UNAUTHORIZED,
    );
  }

  if (session.isRevoked) {
    throw new AppError(
      "Session revoked. Please login again.",
      httpStatus.UNAUTHORIZED,
    );
  }

  if (session.expiresAt < new Date()) {
    throw new AppError(
      "Session expired. Please login again.",
      httpStatus.UNAUTHORIZED,
    );
  }

  const user = session.user;

  if (user.status !== "ACTIVE") {
    throw new AppError("Account is not active.", httpStatus.FORBIDDEN);
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  } as JwtPayload;

  const accessToken = createJWT(jwtPayload, "accessToken");

  await prisma.accountSession.update({
    where: {
      id: session.id,
    },

    data: {
      lastUsedAt: new Date(),
    },
  });

  return accessToken;
};
