import { Router } from "express";

import { createProfile, getProfile, updateProfile } from "./profile.controller";
import { protect } from "../../middlewares/auth";

const router = Router();

router.use(protect);

router.route("/").post(createProfile).get(getProfile).patch(updateProfile);

export const profileRouter = router;
