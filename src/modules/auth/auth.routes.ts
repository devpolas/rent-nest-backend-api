import { Router } from "express";
import {
  signup,
  signin,
  refreshToken,
  verifyUserEmail,
  resendVerificationEmail,
  forgotUserPassword,
  resetUserPassword,
} from "./auth.controller";

import { getMe } from "../user/user.controller";
import { protect } from "../../middlewares/auth";

const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);

router.post("/refresh-token", refreshToken);

router.post("/verify-email", verifyUserEmail);

router.post("/resend-verification", resendVerificationEmail);

router.post("/forgot-password", forgotUserPassword);

router.post("/reset-password", resetUserPassword);
router.use(protect);

// Current logged-in user
router.get("/me", getMe);

export const authRouter = router;
