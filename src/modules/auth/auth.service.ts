import httpStatus from "http-status";
import bcrypt from "bcrypt";
import { AppError } from "../../utils/appError";
import type { SigninPayload, SignupPayload } from "./auth.schema";
import prisma from "../../lib/prisma";
import { createJWT, verifyToken } from "../../utils/jwt";
import type { JwtPayload } from "jsonwebtoken";
import { generateToken, hashToken } from "../../utils/token";
import config from "../../config";
import { sendEmail } from "../../utils/sendEmail";

export const sendVerification = async (email: string) => {
  const user = await prisma.users.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.emailVerified) {
    throw new AppError("Email already verified", 400);
  }

  const token = generateToken();

  await prisma.users.update({
    where: {
      id: user.id,
    },

    data: {
      emailVerificationToken: hashToken(token),

      emailVerificationExpires: new Date(Date.now() + 15 * 60 * 1000),
    },
  });

  const verifyEmailUrl = `${config.website_url}/verify-email?email=${email}&token=${token}`;

  await sendEmail({
    to: user.email,
    subject: "Verify Email Address",
    title: "Verify your account",
    description:
      "Thanks for joining Rent Nest. Please verify your email address to activate your account.",
    link: verifyEmailUrl,
    actionText: "Verify Email",
  });
};

//signup
export const createUser = async (payload: SignupPayload) => {
  const { name, email, password, role } = payload;

  const exists = await prisma.users.findUnique({
    where: {
      email,
    },
  });

  if (exists) {
    throw new AppError("User already exists", httpStatus.BAD_REQUEST);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.users.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
    },
  });

  await sendVerification(email);

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
export const checkUserCredentials = async (payload: SigninPayload) => {
  const { email, password } = payload;

  const user = await prisma.users.findUnique({ where: { email } });

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

  if (!user.emailVerified) {
    await sendVerification(user.email);

    throw new AppError(
      "Please verify your email before login.",
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

export const verifyEmail = async (email: string, token: string) => {
  const user = await prisma.users.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.emailVerified) {
    return {
      message: "Email already verified",
    };
  }

  if (!user.emailVerificationToken || !user.emailVerificationExpires) {
    throw new AppError("Invalid verification request", 400);
  }

  if (user.emailVerificationExpires < new Date()) {
    throw new AppError("Token expired", 400);
  }

  if (user.emailVerificationToken !== hashToken(token)) {
    throw new AppError("Invalid token", 400);
  }

  await prisma.users.update({
    where: {
      id: user.id,
    },

    data: {
      emailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: null,
    },
  });
  return {
    message: "Email verified successfully",
  };
};

export const forgotPassword = async (email: string) => {
  const user = await prisma.users.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return {
      message: "If this email exists, a password reset link has been sent.",
    };
  }

  const token = generateToken();

  await prisma.users.update({
    where: {
      id: user.id,
    },
    data: {
      passwordResetToken: hashToken(token),
      passwordResetExpires: new Date(Date.now() + 15 * 60 * 1000),
    },
  });

  await sendEmail({
    to: user.email,
    subject: "Password Reset Request",
    title: "Reset your password",
    description:
      "We received a request to reset your Rent Nest password. If you did not request this action, ignore this email.",
    link: `${config.website_url}/reset-password?token=${token}`,
    actionText: "Reset Password",
  });

  return {
    message: "If this email exists, a password reset link has been sent.",
  };
};

export const resetPassword = async (token: string, password: string) => {
  const hashedToken = hashToken(token);

  const user = await prisma.users.findFirst({
    where: {
      passwordResetToken: hashedToken,
      passwordResetExpires: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    throw new AppError("Invalid or expired token", httpStatus.BAD_REQUEST);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.$transaction([
    prisma.users.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    }),

    prisma.accountSession.updateMany({
      where: {
        userId: user.id,
      },
      data: {
        isRevoked: true,
        revokedAt: new Date(),
      },
    }),
  ]);

  await sendEmail({
    to: user.email,
    subject: "Password Changed",
    title: "Your password was changed",
    description:
      "Your Rent Nest password was changed successfully. If you did not perform this action, please contact support immediately.",
  });

  return {
    message: "Password reset successfully",
  };
};

export const createAccessToken = async (token: string) => {
  if (!token) {
    throw new AppError("login first", httpStatus.UNAUTHORIZED);
  }
  const decode = verifyToken(token, "refreshToken");
  const { id } = decode as JwtPayload;

  const user = await prisma.users.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    throw new AppError("create account first", httpStatus.UNAUTHORIZED);
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

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  } as JwtPayload;

  const accessToken = createJWT(jwtPayload, "accessToken");

  return accessToken;
};
