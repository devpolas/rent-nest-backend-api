import { Router } from "express";
import { protect, restrictTo } from "../../middlewares/auth";
import {
  getAllPaymentHistory,
  getPaymentHistoryById,
  getSession,
  makePayment,
} from "./payment.controller";

const router = Router({ mergeParams: true });

router.use(protect);

router.route("/").post(restrictTo("TENANT"), makePayment);
router.route("/:sessionId").get(getSession);

router
  .route("/")
  .get(restrictTo("TENANT", "LANDLORD", "ADMIN"), getAllPaymentHistory);

router
  .route("/:transactionId")
  .get(restrictTo("TENANT", "LANDLORD", "ADMIN"), getPaymentHistoryById);

export const paymentRouter = router;
