import { Router } from "express";
import {
  createPropertyCategory,
  deletePropertyCategory,
  getAllPropertyCategories,
  getPropertyCategoryById,
  updatePropertyCategory,
} from "./category.controller";
import { protect, restrictTo } from "../../middlewares/auth";

const router = Router();

// Public
router.route("/").get(getAllPropertyCategories);

router.route("/:id").get(getPropertyCategoryById);

// Protected
router.use(protect);

// Landlord + Admin create
router.route("/").post(restrictTo("LANDLORD", "ADMIN"), createPropertyCategory);

// Admin only
router
  .route("/:id")
  .patch(restrictTo("ADMIN"), updatePropertyCategory)
  .delete(restrictTo("ADMIN"), deletePropertyCategory);

export const categoryRouter = router;
