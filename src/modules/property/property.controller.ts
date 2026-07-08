import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AppError } from "../../utils/appError";
import httpStatus from "http-status";
import { createPropertyIntoDB } from "./property.service";
import { CompletePropertySchema } from "./property.schema";
import { sendResponse } from "../../utils/sendResponse";

export const createCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError("Unauthorize", httpStatus.UNAUTHORIZED);
    }

    const body = CompletePropertySchema.parse(req.body);

    const property = await createPropertyIntoDB(req.user.id, body);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Property created successfully",
      data: {
        property,
      },
    });
  },
);
