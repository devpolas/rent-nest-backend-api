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

/* ============================================
 * Nested routes
 * ============================================ */

router.use("/:propertyId/images", propertyImageRouter);
router.use("/:propertyId/reviews", reviewRouter);

/* ============================================
 * Public routes
 * ============================================ */

router.get("/", getAllProperties);

/* ============================================
 * Protected routes
 * ============================================ */

router.use(protect);

// Must come before /:id
router.get("/my", restrictTo("LANDLORD"), getAllProperties);

router.post("/", restrictTo("LANDLORD"), createProperty);

/* ============================================
 * Property ID routes
 * ============================================ */

// Public property details
router.get("/:id", getPropertyById);

// Protected property management
router
  .route("/:id")
  .patch(restrictTo("LANDLORD", "ADMIN"), updatePropertyById)
  .delete(restrictTo("LANDLORD", "ADMIN"), deletePropertyById);

export const propertyRouter = router;
