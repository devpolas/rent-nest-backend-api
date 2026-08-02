import type { NextFunction, Request, Response } from "express";

import { catchAsync } from "../../utils/catchAsync";
import { uploadImage } from "./image.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

export const uploadImagesController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      throw new Error("No images uploaded");
    }

    const uploaded = await Promise.all(
      files.map((file) => uploadImage(file, "rent-nest/properties")),
    );

    const images = uploaded.map((image) => ({
      url: image.secure_url,
      publicId: image.public_id,
    }));

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Images uploaded successfully",
      data: {
        images,
      },
    });
  },
);
