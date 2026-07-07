import { Router } from "express";
import { getMe } from "./user.controller";
import { protect } from "../../middlewares/auth";

const router = Router();

router.use(protect);
router.get("/me", getMe);

export const userRouter = router;
