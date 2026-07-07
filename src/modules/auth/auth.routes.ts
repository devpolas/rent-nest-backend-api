import { Router } from "express";
import { refreshToken, signin, signup } from "./auth.controller";

const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/refresh-token", refreshToken);

export const authRouter = router;
