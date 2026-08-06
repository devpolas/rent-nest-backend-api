import type { RentalRequestStatus } from "../../../generated/prisma/enums";
import prisma from "../../lib/prisma";
import { AppError } from "../../utils/appError";
import type { ReviewInputType, ReviewUpdateInputType } from "./review.schema";
import httpStatus from "http-status";

const allowedStatuses: RentalRequestStatus[] = [
  "ACTIVE",
  "EXPIRED",
  "COMPLETED",
];

export const createReviewIntoDB = async ({
  tenantId,
  propertyId,
  payload,
}: {
  tenantId: string;
  propertyId: string;
  payload: ReviewInputType;
}) => {
  const existingProperty = await prisma.property.findUnique({
    where: {
      id: propertyId,
    },

    select: {
      id: true,
      totalRating: true,
      reviewCount: true,
    },
  });

  if (!existingProperty) {
    throw new AppError("Property not found", httpStatus.NOT_FOUND);
  }

  const rentalRequest = await prisma.rentalRequests.findUnique({
    where: {
      tenantId_propertyId: {
        tenantId,
        propertyId: existingProperty.id,
      },
    },
  });

  if (!rentalRequest) {
    throw new AppError("Rental request not found", httpStatus.NOT_FOUND);
  }

  if (!allowedStatuses.includes(rentalRequest.status)) {
    throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
  }

  const result = await prisma.$transaction(async (tx) => {
    const newReview = await tx.review.create({
      data: {
        propertyId,
        tenantId,
        ...payload,
      },
    });

    const newReviewCount = existingProperty.reviewCount + 1;

    const newTotalRating = existingProperty.totalRating + payload.rating;

    const newAverageRating = newTotalRating / newReviewCount;

    await tx.property.update({
      where: {
        id: propertyId,
      },

      data: {
        reviewCount: newReviewCount,
        totalRating: newTotalRating,
        averageRating: newAverageRating,
      },
    });

    return newReview;
  });

  return result;
};

export const updateReviewIntoDBById = async ({
  reviewId,
  payload,
  reviewerId,
}: {
  reviewId: string;
  payload: ReviewUpdateInputType;
  reviewerId?: string;
}) => {
  const { rating, comment } = payload;

  const existingReview = await prisma.review.findUnique({
    where: {
      id: reviewId,
    },
  });

  if (!existingReview) {
    throw new AppError("Review not found", httpStatus.NOT_FOUND);
  }

  if (reviewerId && existingReview.tenantId !== reviewerId) {
    throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
  }

  const payloadData = {
    ...(rating !== undefined && { rating }),
    ...(comment !== undefined && { comment }),
  };

  const updatedReview = await prisma.review.update({
    where: {
      id: reviewId,
    },
    data: payloadData,
  });

  const review = await prisma.review.findUnique({
    where: {
      id: updatedReview.id,
    },
  });

  return review;
};

export const getReviewFromDBById = async (reviewId: string) => {
  const existingReview = await prisma.review.findUnique({
    where: {
      id: reviewId,
    },
    include: {
      tenant: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
      },
    },
  });

  if (!existingReview) {
    throw new AppError("Review not found", httpStatus.NOT_FOUND);
  }

  return existingReview;
};

export const getAllReviewFromDB = async ({
  reviewerId,
}: {
  reviewerId?: string;
}) => {
  const reviews = await prisma.review.findMany({
    where: {
      ...(reviewerId && {
        tenantId: reviewerId,
      }),
    },
    include: {
      tenant: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return reviews;
};

export const getAllReviewFromDBByPropertyId = async (propertyId: string) => {
  const reviews = await prisma.review.findMany({
    where: { propertyId },
    include: {
      tenant: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return reviews;
};

export const deleteReviewFromDBById = async ({
  id,
  reviewerId,
}: {
  id: string;
  reviewerId?: string;
}) => {
  const existingReview = await prisma.review.findUnique({
    where: {
      id,
    },
  });

  if (!existingReview) {
    throw new AppError("Review not found", httpStatus.NOT_FOUND);
  }

  if (reviewerId && existingReview.tenantId !== reviewerId) {
    throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
  }

  const result = await prisma.$transaction(async (tx) => {
    const property = await tx.property.findUnique({
      where: {
        id: existingReview.propertyId,
      },

      select: {
        totalRating: true,
        reviewCount: true,
      },
    });

    if (!property) {
      throw new AppError("Property not found", httpStatus.NOT_FOUND);
    }

    await tx.review.delete({
      where: {
        id,
      },
    });

    const newReviewCount = property.reviewCount - 1;
    const newTotalRating = property.totalRating - existingReview.rating;

    const newAverageRating =
      newReviewCount > 0 ? newTotalRating / newReviewCount : 0;

    await tx.property.update({
      where: {
        id: existingReview.propertyId,
      },

      data: {
        reviewCount: newReviewCount,
        totalRating: newTotalRating,
        averageRating: newAverageRating,
      },
    });

    return true;
  });

  return result;
};
