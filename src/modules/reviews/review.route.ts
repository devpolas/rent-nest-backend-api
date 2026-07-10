import { Router } from "express";
import {
  createReview,
  deleteReviewById,
  getAllReviews,
  getReviewById,
  getReviewsByPropertyId,
  updateReview,
} from "./review.controller";
import { protect, restrictTo } from "../../middlewares/auth";

const router = Router({ mergeParams: true });

router.route("/").get(getReviewsByPropertyId);
router.route("/:id").get(getReviewById);

router.use(protect);
router.route("/").post(createReview);

router
  .route("/:id")
  .patch(restrictTo("TENANT", "ADMIN"), updateReview)
  .delete(restrictTo("TENANT", "ADMIN"), deleteReviewById);

router.route("/admin/all").get(restrictTo("ADMIN"), getAllReviews);

export const reviewRouter = router;
