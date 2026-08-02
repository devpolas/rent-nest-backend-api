import type { Request, Response } from "express";
import httpStatus from "http-status";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { uploadImage } from "./image.service";

export const uploadImagesController = catchAsync(
  async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];

    const folder = (req.query.folder as string) || "rent_nest";

    if (!files || files.length === 0) {
      throw new Error("No images uploaded");
    }

    const uploaded = await Promise.all(
      files.map((file) => uploadImage(file, folder)),
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
