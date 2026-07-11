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

router.route("/").post(restrictTo("TENANT", "LANDLORD", "ADMIN"), makePayment);

router
  .route("/")
  .get(restrictTo("TENANT", "LANDLORD", "ADMIN"), getAllPaymentHistory);

router.route("/:sessionId").get(getSession);

router
  .route("/:transactionId")
  .get(restrictTo("TENANT", "LANDLORD", "ADMIN"), getPaymentHistoryById);

export const paymentRouter = router;
