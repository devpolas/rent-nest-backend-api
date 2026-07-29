import { Router } from "express";
import {
  deleteMe,
  deleteUserById,
  getAllUsers,
  getMe,
  getUserById,
  updateMe,
  updateUserById,
} from "./user.controller";
import { protect, restrictTo } from "../../middlewares/auth";

const router = Router();

// Authentication required
router.use(protect);

// Current user routes

router.route("/me").get(getMe).patch(updateMe).delete(deleteMe);

// Admin routes

router.use(restrictTo("ADMIN"));

router.route("/").get(getAllUsers);

router
  .route("/:id")
  .get(getUserById)
  .patch(updateUserById)
  .delete(deleteUserById);

export const userRouter = router;
