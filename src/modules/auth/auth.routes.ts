import { Router } from "express";
import { refreshToken, signin, signup } from "./auth.controller";
import { getMe } from "../user/user.controller";
import { protect } from "../../middlewares/auth";

const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/refresh-token", refreshToken);

router.use(protect);
router.get("/me", getMe);

export const authRouter = router;
