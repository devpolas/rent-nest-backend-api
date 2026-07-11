import { Router } from "express";
import { protect, restrictTo } from "../../middlewares/auth";
import {
  createRentRequest,
  deleteRentRequestByAdminById,
  deleteRentRequestByOwnerById,
  deleteRentRequestByTenantById,
  getAllRentRequestByAdmin,
  getAllRentRequestByOwner,
  getAllRentRequestByTenant,
  getRentRequestByAdminById,
  getRentRequestByOwnerById,
  getRentRequestByTenantById,
  updateRentRequestByLandlordAndAdmin,
  updateRentRequestByTenantById,
} from "./rental.controller";
import { paymentRouter } from "../payments/payment.route";

const router = Router();

// Protected routes
router.use(protect);

// Tenant routes
router
  .route("/")
  .post(restrictTo("TENANT"), createRentRequest)
  .get(restrictTo("TENANT"), getAllRentRequestByTenant);

// forward to payment router
router.use("/:rentRequestId/payment", paymentRouter);

router
  .route("/:id")
  .get(restrictTo("TENANT"), getRentRequestByTenantById)
  .patch(restrictTo("TENANT"), updateRentRequestByTenantById)
  .delete(restrictTo("TENANT"), deleteRentRequestByTenantById);

// Landlord routes
router
  .route("/landlord/requests")
  .get(restrictTo("LANDLORD"), getAllRentRequestByOwner);

router
  .route("/landlord/requests/:id")
  .get(restrictTo("LANDLORD"), getRentRequestByOwnerById)
  .patch(restrictTo("LANDLORD"), updateRentRequestByLandlordAndAdmin)
  .delete(restrictTo("LANDLORD"), deleteRentRequestByOwnerById);

// Admin routes
router
  .route("/admin/requests")
  .get(restrictTo("ADMIN"), getAllRentRequestByAdmin);

router
  .route("/admin/requests/:id")
  .get(restrictTo("ADMIN"), getRentRequestByAdminById)
  .patch(restrictTo("ADMIN"), updateRentRequestByLandlordAndAdmin)
  .delete(restrictTo("ADMIN"), deleteRentRequestByAdminById);

export const rentalRouter = router;
