import { Router } from "express";
import type { NextFunction, Request, Response } from "express";
import { protect, restrictTo } from "../../middlewares/auth";
import {
  createRentRequest,
  deleteRentRequest,
  getAllRentRequests,
  getRentRequest,
  updateRentRequestByOwnerOrAdmin,
  updateRentRequestByTenant,
} from "./rental.controller";
import { paymentRouter } from "../payments/payment.route";
import { AppError } from "../../utils/appError";
import httpStatus from "http-status";

const router = Router();

router.use(protect);

// Tenant create
router
  .route("/")
  .post(restrictTo("TENANT"), createRentRequest)
  .get(restrictTo("TENANT", "LANDLORD", "ADMIN"), getAllRentRequests);

// Payment routes
router.use("/:rentRequestId/payment", paymentRouter);

// rent request
router
  .route("/:id")
  .get(restrictTo("TENANT", "LANDLORD", "ADMIN"), getRentRequest)
  .delete(restrictTo("TENANT", "LANDLORD", "ADMIN"), deleteRentRequest)
  .patch(
    restrictTo("TENANT", "LANDLORD", "ADMIN"),
    (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
      }
      if (req.user.role === "TENANT") {
        return updateRentRequestByTenant(req, res, next);
      }

      return updateRentRequestByOwnerOrAdmin(req, res, next);
    },
  );

export const rentalRouter = router;
