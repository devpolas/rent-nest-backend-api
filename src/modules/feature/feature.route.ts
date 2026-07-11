import { Router } from "express";
import {
  createFeature,
  deleteFeature,
  getAllFeatures,
  getFeatureById,
  updateFeature,
} from "./feature.controller";
import { protect, restrictTo } from "../../middlewares/auth";

const router = Router();

// Public
router.route("/").get(getAllFeatures);

router.route("/:id").get(getFeatureById);

// Protected
router.use(protect);

// Landlord + Admin create
router.route("/").post(restrictTo("LANDLORD", "ADMIN"), createFeature);

// Admin only
router
  .route("/:id")
  .patch(restrictTo("ADMIN"), updateFeature)
  .delete(restrictTo("ADMIN"), deleteFeature);

export const featureRouter = router;
