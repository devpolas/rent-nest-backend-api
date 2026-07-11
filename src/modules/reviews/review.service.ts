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

  const newReview = await prisma.review.create({
    data: {
      propertyId,
      tenantId,
      ...payload,
    },
  });

  const review = await prisma.review.findUnique({
    where: {
      id: newReview.id,
    },
    include: {
      property: true,
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

  return review;
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
    include: {
      property: true,
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

  return review;
};

export const getReviewFromDBById = async (reviewId: string) => {
  const existingReview = await prisma.review.findUnique({
    where: {
      id: reviewId,
    },
    include: {
      property: true,
      tenant: {
        select: {
          id: true,
          name: true,
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
      property: true,
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
      property: true,
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
    where: { id },
    include: {
      property: true,
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

  if (reviewerId && existingReview.tenantId !== reviewerId) {
    if (!existingReview) {
      throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
    }
  }

  await prisma.review.delete({
    where: { id },
  });

  return true;
};
