import crypto from "crypto";
import type { Request } from "express";
import type { Session, SessionData } from "express-session";
import httpStatus from "http-status";
import prisma from "../../lib/prisma";
import { AppError } from "../../utils/appError";
import type { ExtractedSessionInfo } from "../../utils/sessionHelper";
import {
  GOOGLE_SCOPES,
  googleCallback,
  oauth2Client,
} from "../../config/google";
import {
  createLoginSession,
  findUserByEmail,
  hasAuthProvider,
  validateUserStatus,
} from "./auth.helper";
import type { AuthProvider } from "../../../generated/prisma/enums";

/**
 * Step 1: Generate Google authorization URL
 */
export const googleLogin = async (req: Request) => {
  const state = crypto.randomBytes(32).toString("hex");

  req.session.googleOAuthState = state;

  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: GOOGLE_SCOPES,
    include_granted_scopes: true,
    prompt: "consent",
    state,
  });
};

/**
 * Step 2: Handle Google callback
 */
export const handleGoogleCallback = async (
  oauthSession: Session & Partial<SessionData>,
  code: string,
  state: string,
  sessionInfo: ExtractedSessionInfo,
) => {
  const googleUser = await googleCallback(oauthSession, code, state);

  // Security: Google must verify the email
  if (!googleUser.email_verified) {
    throw new AppError("Google email is not verified", httpStatus.BAD_REQUEST);
  }

  const existsLocalAccount = await findUserByEmail(googleUser.email);

  if (existsLocalAccount) {
    if (await hasAuthProvider(existsLocalAccount.id, "LOCAL")) {
      throw new AppError(
        "This account was created using email and password. Please sign in with your email and password.",
        httpStatus.BAD_REQUEST,
      );
    }
  }

  const existingOAuthAccount = await prisma.$transaction(async (tx) => {
    const existingUser = await tx.users.findUnique({
      where: {
        email: googleUser.email,
        emailVerified: true,
      },
    });

    if (!existingUser) return null;

    const existingAccount = await tx.authAccounts.findUnique({
      where: {
        userId_provider: {
          userId: existingUser.id,
          provider: googleUser.provider as AuthProvider,
        },
      },
    });

    if (!existingAccount) return null;

    return existingUser;
  });

  if (existingOAuthAccount) {
    validateUserStatus(existingOAuthAccount);
    return createLoginSession(existingOAuthAccount, sessionInfo);
  }

  const result = await prisma.$transaction(async (tx) => {
    // 1. Find existing local user by email
    let user = await tx.users.findUnique({
      where: {
        email: googleUser.email,
      },
    });

    // 2. Create user if not exists
    if (!user) {
      user = await tx.users.create({
        data: {
          name: googleUser.name ?? "Google User",
          email: googleUser.email,
          avatar: googleUser.picture ?? "",
          emailVerified: true,
        },
      });
    }

    // 3. Find linked Google account
    const existingAccount = await tx.authAccounts.findUnique({
      where: {
        userId_provider: {
          userId: user.id,
          provider: "GOOGLE",
        },
      },
    });

    // Defensive check
    if (existingAccount && existingAccount.userId !== user.id) {
      throw new AppError(
        "Google account is already linked to another user",
        httpStatus.CONFLICT,
      );
    }

    // 4. Link Google account if not linked yet
    if (!existingAccount) {
      await tx.authAccounts.create({
        data: {
          userId: user.id,
          provider: "GOOGLE",
          providerAccountId: googleUser.id,
        },
      });
    }

    return user;
  });

  // 5. Apply the same business rules as password login
  validateUserStatus(result);

  // 6. Create application session (JWT + AccountSession)
  return createLoginSession(result, sessionInfo);
};
