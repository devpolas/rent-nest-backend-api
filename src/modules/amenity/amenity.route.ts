import { Router } from "express";
import {
  createAmenity,
  deleteAmenity,
  getAllAmenities,
  getAmenityById,
  updateAmenity,
} from "./amenity.controller";
import { protect, restrictTo } from "../../middlewares/auth";

const router = Router();

// Public routes
router.route("/").get(getAllAmenities);

router.route("/:id").get(getAmenityById);

// Protected routes
router.use(protect);

// Landlord + Admin create
router.route("/").post(restrictTo("LANDLORD", "ADMIN"), createAmenity);

// Admin update/delete
router
  .route("/:id")
  .patch(restrictTo("ADMIN"), updateAmenity)
  .delete(restrictTo("ADMIN"), deleteAmenity);

export const amenityRouter = router;
