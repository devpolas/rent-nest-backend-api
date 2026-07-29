import { Router } from "express";
import {
  signup,
  signin,
  refreshToken,
  verifyUserEmail,
  resendVerificationEmail,
  forgotUserPassword,
  resetUserPassword,
  logout,
  logoutAllOtherDevices,
  logoutSingleDevice,
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
router.post("/logout", logout);
router.delete("/sessions/:sessionId", protect, logoutSingleDevice);
router.post("/logout-other-devices", protect, logoutAllOtherDevices);

export const authRouter = router;
