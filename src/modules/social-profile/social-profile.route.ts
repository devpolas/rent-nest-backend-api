import { Router } from "express";
import {
  createSocialProfile,
  deleteSocialProfile,
  getMySocialProfiles,
  getSocialProfileById,
  updateSocialProfile,
} from "./social-profile.controller";

import { protect } from "../../middlewares/auth";

const router = Router();

router.use(protect);

// own profile social

router.route("/").get(getMySocialProfiles).post(createSocialProfile);

router
  .route("/:id")
  .get(getSocialProfileById)
  .patch(updateSocialProfile)
  .delete(deleteSocialProfile);

export const socialProfileRouter = router;
