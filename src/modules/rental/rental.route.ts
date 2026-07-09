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

const router = Router();

// protect
router.use(protect);

// tenant
router.use(restrictTo("TENANT"));

router.route("/rentals").post(createRentRequest).get(getAllRentRequestByTenant);

router
  .route("/rentals/:id")
  .get(getRentRequestByTenantById)
  .patch(updateRentRequestByTenantById)
  .delete(deleteRentRequestByTenantById);

// landlord
router.use(restrictTo("LANDLORD"));

router.route("landlord/requests").get(getAllRentRequestByOwner);
router
  .route("landlord/requests/:id")
  .get(getRentRequestByOwnerById)
  .patch(updateRentRequestByLandlordAndAdmin)
  .delete(deleteRentRequestByOwnerById);

// admin
router.use(restrictTo("ADMIN"));

router.route("/rentals").get(getAllRentRequestByAdmin);
router
  .route("/rentals/:id")
  .get(getRentRequestByAdminById)
  .patch(updateRentRequestByLandlordAndAdmin)
  .delete(deleteRentRequestByAdminById);

export const rentalRouter = router;
