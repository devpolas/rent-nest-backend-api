import httpStatus from "http-status";
import bcrypt from "bcrypt";
import { AppError } from "../../utils/appError";
import type { SigninPayload, SignupPayload } from "./auth.schema";
import prisma from "../../lib/prisma";
import { createJWT, verifyToken } from "../../utils/jwt";
import type { JwtPayload } from "jsonwebtoken";

//signup
export const createUser = async (payload: SignupPayload) => {
  const { name, email, password, role } = payload;

  const isExits = await prisma.user.findUnique({
    where: { email },
  });

  if (isExits) {
    throw new AppError("user already exits", httpStatus.BAD_REQUEST);
  }

  const hashPassword = await bcrypt.hash(password, 12);

  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashPassword,
      role,
      profile: {
        create: {},
      },
    },
  });

  const user = await prisma.user.findUnique({
    where: {
      id: createdUser.id,
      email: createdUser.email,
    },
    omit: {
      password: true,
    },
  });

  return user;
};

// login
export const checkUserCredentials = async (payload: SigninPayload) => {
  const { email, password } = payload;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new AppError("invalid credentials", httpStatus.UNAUTHORIZED);
  }

  if (user.status === "BLOCKED") {
    throw new AppError(
      "Your account has been blocked. Please contact support.",
      httpStatus.FORBIDDEN,
    );
  }

  if (user.status === "BANNED") {
    throw new AppError(
      "Your account has been banned. Please contact support.",
      httpStatus.FORBIDDEN,
    );
  }

  const isCorrectPassword = await bcrypt.compare(password, user.password);

  if (!isCorrectPassword) {
    throw new AppError("invalid credentials", httpStatus.UNAUTHORIZED);
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  } as JwtPayload;

  const accessToken = createJWT(jwtPayload, "accessToken");
  const refreshToken = createJWT(jwtPayload, "refreshToken");

  return { accessToken, refreshToken };
};

export const createAccessToken = async (token: string) => {
  if (!token) {
    throw new AppError("login first", httpStatus.UNAUTHORIZED);
  }
  const decode = verifyToken(token, "refreshToken");
  const { id, name, email, role } = decode as JwtPayload;

  const user = await prisma.user.findUnique({
    where: {
      id,
      name,
      email,
      role,
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

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  } as JwtPayload;

  const accessToken = createJWT(jwtPayload, "accessToken");

  return accessToken;
};
