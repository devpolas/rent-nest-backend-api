import { Router } from "express";
import { protect, restrictTo } from "../../middlewares/auth";
import { getSession, makePayment } from "./payment.controller";

const router = Router({ mergeParams: true });

router.use(protect);

router.route("/").post(restrictTo("TENANT"), makePayment);
router.route("/:sessionId").get(getSession);
// router.route("/").get(getPaymentHistory);

export const paymentRouter = router;
