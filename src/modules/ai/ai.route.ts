import { Router } from "express";
import { aiController } from "./ai.controller";
import { knowledgeRouter } from "./knowledge/knowledge.route";

export const aiRouter = Router();

aiRouter.post("/chat", aiController.chat);
aiRouter.use("/knowledge", knowledgeRouter);
