import { Router } from "express";
import { protect, restrictTo } from "../../middlewares/auth";

import {
  createProperty,
  getAllProperties,
  getPropertyById,
  updatePropertyById,
  deletePropertyById,
} from "./property.controller";

import { reviewRouter } from "../reviews/review.route";
import { propertyImageRouter } from "../property-images/property-image.route";

const router = Router();

router.use("/:propertyId/images", propertyImageRouter);
router.use("/:propertyId/reviews", reviewRouter);

router.get("/", getAllProperties);

// Must come before /:id
router.get("/my-properties", protect, restrictTo("LANDLORD"), getAllProperties);

router.post("/", protect, restrictTo("LANDLORD"), createProperty);

// Public property details
router.get("/:id", getPropertyById);

router.use(protect);
// Protected property management
router
  .route("/:id")
  .patch(restrictTo("LANDLORD", "ADMIN"), updatePropertyById)
  .delete(restrictTo("LANDLORD", "ADMIN"), deletePropertyById);

export const propertyRouter = router;
