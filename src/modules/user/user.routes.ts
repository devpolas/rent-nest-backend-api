import { Router } from "express";
import {
  deleteMe,
  deleteUserById,
  getAllUsers,
  getUserById,
  updateProfile,
  updateUserById,
} from "./user.controller";
import { protect, restrictTo } from "../../middlewares/auth";

const router = Router();

router.use(protect);

// User self routes
router.route("/").patch(updateProfile).delete(deleteMe);

// Admin routes
router.use(restrictTo("ADMIN"));

router.route("/").get(getAllUsers);

router
  .route("/:id")
  .patch(updateUserById)
  .delete(deleteUserById)
  .get(getUserById);

export const userRouter = router;
