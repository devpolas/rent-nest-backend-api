import { Router } from "express";

import {
  createLocation,
  deleteLocation,
  getAllLocations,
  getLocationById,
  getLocationsByProfileId,
  updateLocation,
} from "./location.controller";

import { protect, restrictTo } from "../../middlewares/auth";

const router = Router();

// Public
router.route("/").get(getAllLocations);
router.route("/:id").get(getLocationById);

// Protected
router.use(protect);

// Create user location
router.route("/").post(restrictTo("TENANT", "LANDLORD"), createLocation);

// Profile locations
router.route("/profile/:profileId").get(getLocationsByProfileId);

// Update/Delete
router
  .route("/:id")
  .patch(restrictTo("TENANT", "LANDLORD"), updateLocation)
  .delete(restrictTo("ADMIN"), deleteLocation);

export const locationRouter = router;
