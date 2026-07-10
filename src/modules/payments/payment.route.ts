import { Router } from "express";
import { protect } from "../../middlewares/auth";
import { makePayment } from "./payment.controller";

const router = Router({ mergeParams: true });

router.use(protect);

router.route("/").post(makePayment);
// router.route("/").get(getPaymentHistory);
// router.route("/:sessionId").get(sessionStatus);

export const paymentRouter = router;
