import express from "express";
import session from "express-session";
import type { Application, Request, Response } from "express";
import cors from "cors";
import { authRouter } from "./modules/auth/auth.routes";
import globalErrorController from "./middlewares/error";
import config from "./config";
import cookieParser from "cookie-parser";
import { userRouter } from "./modules/user/user.routes";
import { propertyRouter } from "./modules/property/property.route";
import { rentalRouter } from "./modules/rental/rental.route";
import { paymentRouter } from "./modules/payments/payment.route";
import { reviewRouter } from "./modules/reviews/review.route";
import { amenityRouter } from "./modules/amenity/amenity.route";
import { categoryRouter } from "./modules/category/category.route";
import { featureRouter } from "./modules/feature/feature.route";
import { ruleRouter } from "./modules/rule/rule.route";
import notfound from "./middlewares/not-found";
import { profileRouter } from "./modules/profile/profile.route";
import { locationRouter } from "./modules/location/location.route";
import { socialProfileRouter } from "./modules/social-profile/social-profile.route";
import { propertyImageRouter } from "./modules/property-images/property-image.route";
import { sendResponse } from "./utils/sendResponse";
import httpStatus from "http-status";
import { imageRouter } from "./modules/image/image.routes";

const app: Application = express();

app.set("trust proxy", true);
app.use(
  session({
    secret: config.session_secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: config.node_env === "production",
      httpOnly: true,
      maxAge: 1000 * 60 * 10,
    },
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: config.app_urls, credentials: true }));
app.use(cookieParser());

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
