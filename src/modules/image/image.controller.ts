import type { Request, Response } from "express";
import httpStatus from "http-status";

import { AppError } from "../../utils/appError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { deleteImage, uploadImage } from "./image.service";

export const uploadImagesController = catchAsync(
  async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[] | undefined;

    if (!files?.length) {
      throw new AppError("No images uploaded", httpStatus.BAD_REQUEST);
    }

    const folder =
      typeof req.query.folder === "string" && req.query.folder.trim()
        ? req.query.folder.trim()
        : "rent_nest";

    console.log("Uploading images:", {
      count: files.length,
      folder,
    });

    const uploaded = [];

    try {
      for (const file of files) {
        const result = await uploadImage(file, folder);
        uploaded.push(result);
      }
    } catch (error) {
      // Clean up images that were successfully uploaded
      // before another upload failed.
      await Promise.allSettled(
        uploaded.map((image) => deleteImage(image.public_id)),
      );

      console.error("🔥 CLOUDINARY ERROR:", error);

      throw new AppError(
        "Failed to upload images",
        httpStatus.INTERNAL_SERVER_ERROR,
      );
    }

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
