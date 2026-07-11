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

const router = Router();

// forward to review router
router.use("/:propertyId/reviews", reviewRouter);

// Public routes
router.route("/").get(getAllProperties);
router.route("/:id").get(getPropertyById);

// Protected routes
router.use(protect);

router.route("/").post(restrictTo("LANDLORD", "ADMIN"), createProperty);

// Landlord routes
router.route("/my").get(restrictTo("LANDLORD"), getAllProperties);

router
  .route("/:id")
  .patch(restrictTo("LANDLORD", "ADMIN"), updatePropertyById)
  .delete(restrictTo("LANDLORD", "ADMIN"), deletePropertyById);

export const propertyRouter = router;
