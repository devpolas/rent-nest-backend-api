import { Router } from "express";

import { createOrUpdateProfile, getProfile } from "./profile.controller";
import { protect } from "../../middlewares/auth";

const router = Router();

router.use(protect);

router.route("/").post(createOrUpdateProfile).get(getProfile);

export const profileRouter = router;
