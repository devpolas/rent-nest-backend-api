import { Router } from "express";
import { UserRole } from "../../../../generated/prisma/enums";
import { protect, restrictTo } from "../../../middlewares/auth";
import { knowledgeController } from "./knowledge.controller";

export const knowledgeRouter = Router();

knowledgeRouter.get("/search", knowledgeController.search);

knowledgeRouter.post(
  "/ingest",
  protect,
  restrictTo(UserRole.ADMIN, UserRole.MODERATOR),
  knowledgeController.ingest,
);
