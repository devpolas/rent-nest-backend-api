import { Router } from "express";
import {
  createRule,
  deleteRule,
  getAllRules,
  getRuleById,
  updateRule,
} from "./rule.controller";
import { protect, restrictTo } from "../../middlewares/auth";

const router = Router();

// Public
router.route("/").get(getAllRules);

router.route("/:id").get(getRuleById);

// Protected
router.use(protect);

// Landlord + Admin create
router.route("/").post(restrictTo("LANDLORD", "ADMIN"), createRule);

// Admin only
router
  .route("/:id")
  .patch(restrictTo("ADMIN"), updateRule)
  .delete(restrictTo("ADMIN"), deleteRule);

export const ruleRouter = router;
