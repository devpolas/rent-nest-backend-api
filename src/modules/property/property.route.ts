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

// public route
router.route("/properties").get(getAllProperties);
router.route("/properties/:id").get(getPropertyById);

// protected routes
router.use(protect);

// own property route
router.use(restrictTo("LANDLORD"));
router
  .route("/landlord/properties")
  .post(createProperty)
  .get(getAllMyProperties);
router
  .route("/landlord/properties/:id")
  .patch(updateMyPropertyById)
  .delete(deleteMyPropertyById);

// admin route
router.use(restrictTo("ADMIN"));
router.route("/properties").post(createPropertyByAdmin);
router
  .route("properties/:id")
  .patch(updatePropertyByIdByAdmin)
  .delete(deletePropertyById);

export const propertyRouter = router;
