import { Router } from "express";
import { protect, restrictTo } from "../../middlewares/auth";
import {
  createProperty,
  deletePropertyById,
  getAllProperties,
  getPropertyById,
  updatePropertyById,
} from "./property.controller";

const router = Router();

router.route("/properties").get(getAllProperties);
router.route("/properties/:id").get(getPropertyById);

router.use(protect);
router.use(restrictTo("ADMIN", "LANDLORD"));
router.route("/landlord/properties").post(createProperty);
router
  .route("/landlord/properties/:id")
  .patch(updatePropertyById)
  .delete(deletePropertyById);

export const propertyRouter = router;
