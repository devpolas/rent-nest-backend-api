import express from "express";
import type { Application, Request, Response } from "express";
import { express as useragent } from "express-useragent";
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

const app: Application = express();

app.use(express.json());
app.use(useragent());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: config.app_urls, credentials: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Rent Nest Ready To Talk",
  });
});

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/profiles", profileRouter);
app.use("/api/v1/properties", propertyRouter);
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
