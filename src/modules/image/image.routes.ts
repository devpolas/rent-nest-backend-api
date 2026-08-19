import { Router } from "express";

import upload from "../../middlewares/upload";

import { uploadImagesController } from "./image.controller";

const router = Router();

router.post("/upload", upload.array("images", 10), uploadImagesController);

export const imageRouter = router;
