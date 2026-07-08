import { Router } from "express";
import { protect, restrictTo } from "../../middlewares/auth";
import { createCategory } from "./property.controller";

const router = Router();

router.use(protect);
router.use(restrictTo("ADMIN", "LANDLORD"));
router.route("/landlord/properties").post(createCategory);

export const propertyRouter = router;
