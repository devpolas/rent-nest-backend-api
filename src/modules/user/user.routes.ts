import { Router } from "express";
import {
  deleteMe,
  deleteUserById,
  getAllUsers,
  getUserById,
  me,
  updateMe,
  updateUserById,
} from "./user.controller";
import { protect, restrictTo } from "../../middlewares/auth";

const router = Router();

// Authentication required
router.use(protect);

// Current user routes
router.route("/me").get(me).patch(updateMe).delete(deleteMe);

// Admin routes
router.route("/").get(restrictTo("ADMIN"), getAllUsers);

router
  .route("/:id")
  .get(restrictTo("ADMIN", "LANDLORD"), getUserById)
  .patch(restrictTo("ADMIN"), updateUserById)
  .delete(restrictTo("ADMIN"), deleteUserById);

export const userRouter = router;
