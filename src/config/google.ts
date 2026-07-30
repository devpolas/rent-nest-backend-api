import { google } from "googleapis";
import type { Session, SessionData } from "express-session";
import config from "./index";
import { AppError } from "../utils/appError";
import httpStatus from "http-status";

export interface GoogleResponse {
  id: string;
  email: string;
  email_verified: boolean;
  name: string | null;
  picture: string | null;
  provider: string;
}

export const oauth2Client = new google.auth.OAuth2(
  config.google_client_id,
  config.google_client_secret,
  config.google_callback_url,
);

export const GOOGLE_SCOPES = ["openid", "email", "profile"];

export const googleCallback = async (
  session: Session & Partial<SessionData>,
  code: string,
  state: string,
) => {
  if (!session.googleOAuthState) {
    throw new AppError("OAuth session expired.", httpStatus.BAD_REQUEST);
  }

  if (session.googleOAuthState !== state) {
    throw new AppError("Invalid OAuth state.", httpStatus.BAD_REQUEST);
  }

  delete session.googleOAuthState;

  const { tokens } = await oauth2Client.getToken(code);

  oauth2Client.setCredentials(tokens);

  const oauth2 = google.oauth2({
    auth: oauth2Client,
    version: "v2",
  });

  const { data: profile } = await oauth2.userinfo.get();
  console.log(profile);

  if (!profile.email || !profile.id) {
    throw new AppError(
      "Google account information missing.",
      httpStatus.BAD_REQUEST,
    );
  }

  return {
    id: profile.id,
    email: profile.email,
    email_verified: profile.verified_email,
    name: profile.name,
    picture: profile.picture,
    provider: "GOOGLE",
  };
};
