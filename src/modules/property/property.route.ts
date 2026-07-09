import { Router } from "express";
import { protect, restrictTo } from "../../middlewares/auth";
import {
  createProperty,
  createPropertyByAdmin,
  deleteMyPropertyById,
  deletePropertyById,
  getAllMyProperties,
  getAllProperties,
  getPropertyById,
  updateMyPropertyById,
  updatePropertyByIdByAdmin,
} from "./property.controller";

const router = Router();

// Public routes
router.route("/properties").get(getAllProperties);
router.route("/properties/:id").get(getPropertyById);

// Protected routes
router.use(protect);

// Landlord routes
router
  .route("/landlord/properties")
  .post(restrictTo("LANDLORD"), createProperty)
  .get(restrictTo("LANDLORD"), getAllMyProperties);

router
  .route("/landlord/properties/:id")
  .patch(restrictTo("LANDLORD"), updateMyPropertyById)
  .delete(restrictTo("LANDLORD"), deleteMyPropertyById);

// Admin routes
router.route("/properties").post(restrictTo("ADMIN"), createPropertyByAdmin);

router
  .route("/properties/:id")
  .patch(restrictTo("ADMIN"), updatePropertyByIdByAdmin)
  .delete(restrictTo("ADMIN"), deletePropertyById);

export const propertyRouter = router;
