import config from "../../config";
import prisma from "../../lib/prisma";
import { AppError } from "../../utils/appError";
import { sendEmail } from "../../utils/sendEmail";
import { formatDate, Time } from "../../utils/timeHelper";
import { generateToken, hashToken } from "../../utils/token";
import {
  createPasswordHash,
  createVerificationToken,
  ensureUserExists,
  findUserByEmail,
} from "./auth.helper";
import httpStatus from "http-status";

export const sendVerification = async (email: string) => {
  const user = ensureUserExists(await findUserByEmail(email));

  if (user.emailVerified) {
    throw new AppError("Email already verified", httpStatus.BAD_REQUEST);
  }

  const { token, hashedToken, expiresAt } = createVerificationToken();

  await prisma.authAccounts.update({
    where: {
      userId_provider: {
        userId: user.id,
        provider: "LOCAL",
      },
    },
    data: {
      emailVerificationToken: hashedToken,
      emailVerificationExpires: expiresAt,
    },
  });

  await sendEmail({
    to: user.email,
    subject: "Verify Email Address",
    title: "Verify your account",
    description: `Please verify your account. This link expires at ${formatDate(expiresAt)}.`,
    link: `${config.website_url}/verify-account?email=${user.email}&token=${token}`,
    actionText: "Verify Email",
  });
};

export const verifyEmail = async (email: string, token: string) => {
  const user = ensureUserExists(await findUserByEmail(email));

  const account = await prisma.authAccounts.findUnique({
    where: {
      userId_provider: {
        userId: user.id,
        provider: "LOCAL",
      },
    },
  });

  if (!account) {
    throw new AppError(
      "Local authentication account not found.",
      httpStatus.BAD_REQUEST,
    );
  }

  if (user.emailVerified) {
    return {
      message: "Email already verified",
    };
  }

  if (!account.emailVerificationToken || !account.emailVerificationExpires) {
    throw new AppError("Invalid verification request", httpStatus.BAD_REQUEST);
  }

  if (account.emailVerificationExpires < new Date()) {
    throw new AppError("Verification link expired", httpStatus.BAD_REQUEST);
  }

  if (account.emailVerificationToken !== hashToken(token)) {
    throw new AppError("Invalid verification token", httpStatus.BAD_REQUEST);
  }

  await prisma.$transaction([
    prisma.users.update({
      where: {
        id: user.id,
      },
      data: {
        emailVerified: true,
      },
    }),

    prisma.authAccounts.update({
      where: {
        userId_provider: {
          userId: user.id,
          provider: "LOCAL",
        },
      },
      data: {
        emailVerificationToken: null,
        emailVerificationExpires: null,
      },
    }),
  ]);

  return {
    message: "Email verified successfully",
  };
};

export const forgotPassword = async (email: string) => {
  const user = await prisma.users.findUnique({
    where: {
      email,
    },
    include: {
      accounts: true,
    },
  });

  if (!user) {
    return {
      message: "If this email exists, a password reset link has been sent.",
    };
  }

  const token = generateToken();
  const expireAt = new Date(Date.now() + Time.minute(15));

  await prisma.authAccounts.update({
    where: {
      userId_provider: {
        userId: user.id,
        provider: "LOCAL",
      },
    },
    data: {
      passwordResetToken: hashToken(token),
      passwordResetExpires: expireAt,
    },
  });

  await sendEmail({
    to: user.email,
    subject: "Password Reset Request",
    title: "Reset your password",
    description: `We received a request to reset your Rent Nest password. This verification link will expire at ${formatDate(expireAt)}. If you did not request this action, ignore this email.`,
    link: `${config.website_url}/reset-password?token=${token}`,
    actionText: "Reset Password",
  });

  return {
    message: "Password reset link has been sent in your email. Please check your email.",
  };
};

export const resetPassword = async (token: string, password: string) => {
  const hashedToken = hashToken(token);

  const account = await prisma.authAccounts.findFirst({
    where: {
      passwordResetToken: hashedToken,
      passwordResetExpires: {
        gt: new Date(),
      },
    },
    include: {
      user: true,
    },
  });

  if (!account) {
    throw new AppError(
      "Invalid or expired password reset token",
      httpStatus.BAD_REQUEST,
    );
  }

  const hashedPassword = await createPasswordHash(password);

  const revokedAt = new Date();

  await prisma.$transaction([
    prisma.users.update({
      where: {
        id: account.userId,
      },
      data: {
        password: hashedPassword,
      },
    }),

    prisma.authAccounts.update({
      where: {
        userId_provider: {
          userId: account.id,
          provider: "LOCAL",
        },
      },
      data: {
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    }),

    prisma.accountSession.updateMany({
      where: {
        userId: account.userId,
        isRevoked: false,
      },
      data: {
        isRevoked: true,
        revokedAt,
      },
    }),
  ]);

  await sendEmail({
    to: account.user.email,
    subject: "Password Changed",
    title: "Your password was changed",
    description: `Your Rent Nest password was changed successfully at ${formatDate(new Date())}. If you did not perform this action, please contact support immediately.`,
  });

  return {
    message: "Password reset successfully",
  };
};
