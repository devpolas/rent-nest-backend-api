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
  logoutFromOtherDevices,
  logoutDeviceBySessionId,
  continueWithGoogle,
  googleCallbackController,
} from "./auth.controller";
import { protect } from "../../middlewares/auth";
import { me } from "../user/user.controller";

const router = Router();

router.get("/google/calback", googleCallbackController);
router.get("/google", continueWithGoogle);

router.post("/signup", signup);
router.post("/signin", signin);

router.post("/refresh-token", refreshToken);

router.post("/verify-email", verifyUserEmail);
router.post("/resend-verification", resendVerificationEmail);

router.post("/forgot-password", forgotUserPassword);
router.post("/reset-password", resetUserPassword);
router.use(protect);

// Current logged-in user
router.get("/me", me);
router.post("/logout", logout);
router.delete("/sessions/:sessionId", logoutDeviceBySessionId);
router.post("/logout-other-devices", logoutFromOtherDevices);

export const authRouter = router;
