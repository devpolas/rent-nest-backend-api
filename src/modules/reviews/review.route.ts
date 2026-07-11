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

router.route("/admin/all").get(restrictTo("ADMIN"), getAllReviews);

router
  .route("/:id")
  .patch(restrictTo("TENANT", "ADMIN"), updateReview)
  .delete(restrictTo("TENANT", "ADMIN"), deleteReviewById);

export const reviewRouter = router;
