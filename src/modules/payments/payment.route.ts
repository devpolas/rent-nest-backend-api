import { Router } from "express";
import { protect, restrictTo } from "../../middlewares/auth";
import {
  getAllPaymentHistory,
  getPaymentHistoryById,
  getSession,
  makePayment,
} from "./payment.controller";

const router = Router();

// Create Stripe Checkout Session
router.post(
  "/",
  protect,
  restrictTo("TENANT", "LANDLORD", "ADMIN"),
  makePayment,
);

// Get all payment history
router.get(
  "/",
  protect,
  restrictTo("TENANT", "LANDLORD", "ADMIN"),
  getAllPaymentHistory,
);

// Verify Stripe session & store payment
router.get("/session/:sessionId", protect, getSession);

// Get payment by transaction ID
router.get(
  "/transaction/:transactionId",
  protect,
  restrictTo("TENANT", "LANDLORD", "ADMIN"),
  getPaymentHistoryById,
);

export const paymentRouter = router;
