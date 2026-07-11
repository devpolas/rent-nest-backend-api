import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AppError } from "../../utils/appError";
import httpStatus from "http-status";
import {
  createReviewIntoDB,
  deleteReviewFromDBById,
  getAllReviewFromDB,
  getAllReviewFromDBByPropertyId,
  getReviewFromDBById,
  updateReviewIntoDBById,
} from "./review.service";
import { ReviewSchema, ReviewUpdateSchema } from "./review.schema";
import { sendResponse } from "../../utils/sendResponse";

export const createReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const propertyId = req.params.propertyId as string;

    if (!user) {
      throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
    }

    const body = ReviewSchema.parse(req.body);

    const review = await createReviewIntoDB({
      tenantId: user.id,
      propertyId,
      payload: body,
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Review created successfully",
      data: {
        review,
      },
    });
  },
);

export const updateReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const reviewId = req.params.id as string;

    if (!user) {
      throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
    }

    const filter: {
      reviewerId?: string;
    } = {};

    if (user.role === "TENANT") {
      filter.reviewerId = user.id;
    }

    const body = ReviewUpdateSchema.parse(req.body);

    const review = await updateReviewIntoDBById({
      reviewId,
      payload: body,
      ...filter,
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Review updated successfully",
      data: {
        review,
      },
    });
  },
);

export const getReviewById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;

    const review = await getReviewFromDBById(id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Review retrieved successfully",
      data: {
        review,
      },
    });
  },
);

export const getReviewsByPropertyId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const propertyId = req.params.propertyId as string;
    const reviews = await getAllReviewFromDBByPropertyId(propertyId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Reviews retrieved successfully",
      data: {
        reviews,
      },
    });
  },
);

export const getAllReviews = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
    }

    const filter: {
      reviewerId?: string;
    } = {};

    if (user.role === "TENANT") {
      filter.reviewerId = user.id;
    }

    const reviews = await getAllReviewFromDB({ ...filter });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Reviews retrieved successfully",
      data: {
        reviews,
      },
    });
  },
);

export const deleteReviewById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const id = req.params.id as string;

    if (!user) {
      throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
    }

    const filter: {
      reviewerId?: string;
    } = {};

    if (user.role === "TENANT") {
      filter.reviewerId = user.id;
    }

    await deleteReviewFromDBById({ id, ...filter });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.NO_CONTENT,
      message: "Review updated successfully",
    });
  },
);
