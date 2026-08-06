import express from "express";
import session from "express-session";
import type { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import httpStatus from "http-status";

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

const app: Application = express();
const isProduction = config.node_env === "production";

// Enable proxy trust based on environment or set to true for cloud hosting like Vercel/Render
app.set("trust proxy", isProduction ? true : 1);

// 1. CORS Configuration (DYNAMIC ORIGIN CHECK)
const allowedOrigins = config.app_urls ?? [];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or Next.js server actions)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true, // 👈 Required for cookies
  }),
);

// 2. COOKIE PARSER
app.use(cookieParser());

// 3. EXPRESS SESSION (Updated Cookie Settings for Cross-Domain)

app.use(
  session({
    secret: config.session_secret,
    resave: false,
    saveUninitialized: false,
    proxy: true, // Required for Vercel behind HTTPS proxies
    cookie: {
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax", // 👈 Required for localhost -> vercel cross-site requests
      httpOnly: true,
      maxAge: 1000 * 60 * 10,
    },
  }),
);

// 4. BODY PARSERS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTES
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

app.use(notfound);
app.use(globalErrorController);

export default app;
