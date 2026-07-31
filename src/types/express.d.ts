import type { UserRole } from "../../generated/prisma/enums";
import "express-session";

declare module "express-session" {
  interface SessionData {
    callbackUrl?: string;
    googleOAuthState?: string;
  }
}

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

export {};
