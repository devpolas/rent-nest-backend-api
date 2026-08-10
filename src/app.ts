import express from "express";
import session from "express-session";
import type { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import httpStatus from "http-status";
import { randomUUID } from "node:crypto";
import config from "./config";
import globalErrorController from "./middlewares/error";
import notfound from "./middlewares/not-found";
import { sendResponse } from "./utils/sendResponse";
import { authRouter } from "./modules/auth/auth.routes";
import { userRouter } from "./modules/user/user.routes";
import { propertyRouter } from "./modules/property/property.route";
import { rentalRouter } from "./modules/rental/rental.route";
import { paymentRouter } from "./modules/payments/payment.route";
import { reviewRouter } from "./modules/reviews/review.route";
import { amenityRouter } from "./modules/amenity/amenity.route";
import { categoryRouter } from "./modules/category/category.route";
import { featureRouter } from "./modules/feature/feature.route";
import { ruleRouter } from "./modules/rule/rule.route";
import { profileRouter } from "./modules/profile/profile.route";
import { locationRouter } from "./modules/location/location.route";
import { socialProfileRouter } from "./modules/social-profile/social-profile.route";
import { propertyImageRouter } from "./modules/property-images/property-image.route";
import { imageRouter } from "./modules/image/image.routes";
import { Time } from "./utils/timeHelper";

const app: Application = express();

const isProduction = config.node_env === "production";

/**
 * =========================================================
 * PROXY
 * =========================================================
 *
 * Required when the API is behind:
 *
 * - Vercel
 * - Render
 * - Railway
 * - Nginx
 * - Cloudflare
 * - another reverse proxy
 *
 * This allows Express to correctly resolve:
 *
 * req.ip
 * req.protocol
 * req.secure
 */
app.set("trust proxy", isProduction ? true : 1);

/**
 * =========================================================
 * CORS
 * =========================================================
 */

const allowedOrigins = config.app_urls ?? [];

app.use(
  cors({
    origin: (origin, callback) => {
      /**
       * Allow requests without Origin.
       *
       * Examples:
       * - curl
       * - Postman
       * - server-to-server
       * - Next.js Server Actions
       */
      if (!origin) {
        callback(null, true);
        return;
      }
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "Origin",
      "X-Client-Info",
      "X-Client-Session",
      "X-Request-ID",
    ],
    exposedHeaders: ["Set-Cookie"],
  }),
);

/**
 * =========================================================
 * COOKIE PARSER
 * =========================================================
 */

app.use(cookieParser());

/**
 * =========================================================
 * EXPRESS SESSION
 * =========================================================
 *
 * Used primarily for:
 *
 * - Google OAuth state
 * - temporary OAuth data
 * - short-lived server-side sessions
 *
 * This is separate from your JWT
 * accessToken / refreshToken cookies.
 */

app.use(
  session({
    secret: config.session_secret,
    resave: false,
    saveUninitialized: false,

    /**
     * Express should trust the proxy in production.
     */
    proxy: isProduction,

    cookie: {
      httpOnly: true,
      secure: isProduction,
      /**
       * Development:
       * localhost:3000 -> localhost:8000
       *
       * Production:
       * frontend and backend may be cross-site,
       * therefore SameSite=None is required.
       */
      sameSite: isProduction ? "none" : "lax",
      maxAge: Time.hour(1),
      path: "/",
    },
  }),
);

/**
 * =========================================================
 * BODY PARSERS
 * =========================================================
 */

app.use(
  express.json({
    limit: "2mb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "2mb",
  }),
);

/**
 * =========================================================
 * REQUEST METADATA
 * =========================================================
 *
 * Give every request a basic request ID.
 *
 * If the client already provides one,
 * preserve it.
 */

app.use((req, res, next) => {
  const existingRequestId = req.headers["x-request-id"];
  const requestId =
    typeof existingRequestId === "string" ? existingRequestId : randomUUID();
  res.setHeader("X-Request-ID", requestId);
  req.headers["x-request-id"] = requestId;

  next();
});

/**
 * =========================================================
 * HEALTH / ROOT
 * =========================================================
 */

app.get("/", (_req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Rent Nest is ready to talk!",
  });
});

app.get("/health", (_req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Rent Nest is healthy!",
  });
});

app.get("/version", (_req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Version information retrieved successfully.",
    data: {
      version: "0.1.0",
    },
  });
});

/**
 * =========================================================
 * API ROUTES
 * =========================================================
 */

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/profiles", profileRouter);
app.use("/api/v1/properties", propertyRouter);
app.use("/api/v1/images", imageRouter);
app.use("/api/v1/locations", locationRouter);
app.use("/api/v1/property-images", propertyImageRouter);
app.use("/api/v1/rental-requests", rentalRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/amenities", amenityRouter);
app.use("/api/v1/features", featureRouter);
app.use("/api/v1/rules", ruleRouter);
app.use("/api/v1/social-profiles", socialProfileRouter);
app.use("/api/v1/payments", paymentRouter);
app.use("/api/v1/reviews", reviewRouter);

/**
 * =========================================================
 * 404
 * =========================================================
 */

app.use(notfound);

/**
 * =========================================================
 * GLOBAL ERROR HANDLER
 * =========================================================
 */

app.use(globalErrorController);

export default app;
