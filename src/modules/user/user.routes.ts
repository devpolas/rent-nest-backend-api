import { Router } from "express";
import { getMe, updateUser } from "./user.controller";
import { protect } from "../../middlewares/auth";

const router = Router();

router.use(protect);

router.get("/me", getMe);
router.route("/:id").patch(updateUser);

export const userRouter = router;
