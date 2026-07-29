import { Router } from "express";

import {
  createImages,
  getImages,
  setThumbnail,
  deleteImage,
} from "./property-image.controller";

import { protect, restrictTo } from "../../middlewares/auth";

const router = Router();

// Public

router.get("/property/:propertyId", getImages);

// Protected

router.use(protect);

router.post("/", restrictTo("LANDLORD", "ADMIN"), createImages);

router.patch("/:id/thumbnail", restrictTo("LANDLORD", "ADMIN"), setThumbnail);

router.delete("/:id", restrictTo("LANDLORD", "ADMIN"), deleteImage);

export const propertyImageRouter = router;
