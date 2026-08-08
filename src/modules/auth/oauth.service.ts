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
  googleClient,
} from "../../config/google";
import { createLoginSession, validateUserStatus } from "./auth.helper";

/**
 * Step 1: Generate Google authorization URL
 */
export const googleLogin = async (req: Request): Promise<string> => {
  const state = crypto.randomBytes(32).toString("hex");

  req.session.googleOAuthState = state;

  // Force session to save BEFORE returning redirect URL
  await new Promise<void>((resolve, reject) => {
    req.session.save((err) => {
      if (err)
        reject(
          new AppError(
            "Failed to initialize session.",
            httpStatus.INTERNAL_SERVER_ERROR,
          ),
        );
      else resolve();
    });
  });

  return googleClient.generateAuthUrl({
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

  if (!googleUser.email_verified) {
    throw new AppError("Google email is not verified", httpStatus.BAD_REQUEST);
  }

  const user = await prisma.$transaction(async (tx) => {
    // 1. Find user by email
    let existingUser = await tx.users.findUnique({
      where: {
        email: googleUser.email,
      },
    });

    // 2. Create user if not exists
    if (!existingUser) {
      existingUser = await tx.users.create({
        data: {
          name: googleUser.name ?? "Google User",
          email: googleUser.email,
          avatar: googleUser.picture ?? null,
          emailVerified: true,
          profile: {},
        },
      });
    }

    // 3. Check Google account already linked

    const googleAccount = await tx.authAccounts.findUnique({
      where: {
        userId_provider: {
          userId: existingUser.id,
          provider: "GOOGLE",
        },
      },
    });

    // 4. Link Google account

    if (!googleAccount) {
      await tx.authAccounts.create({
        data: {
          userId: existingUser.id,
          provider: "GOOGLE",
          providerAccountId: googleUser.id,
          profile: {},
        },
      });
    }

    return existingUser;
  });

  // user status validation
  validateUserStatus(user);

  // create JWT + AccountSession
  return createLoginSession(user, sessionInfo);
};
