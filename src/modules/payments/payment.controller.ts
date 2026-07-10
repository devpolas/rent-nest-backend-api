import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { checkout, paymentCreateIntoDB } from "./payment.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { AppError } from "../../utils/appError";

export const makePayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
    }

    const rentRequestId = req.params.rentRequestId as string;

    const session = await checkout({ rentRequestId, tenantId: user.id });

    sendResponse(res, {
      success: true,
      message: "session url generate successfully for 30 min",
      statusCode: httpStatus.OK,
      data: {
        url: session.url,
      },
    });
  },
);

export const getSession = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const sessionId = req.params.sessionId as string;

    if (!user) {
      throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
    }

    const session = await paymentCreateIntoDB;
    ({ sessionId });

    sendResponse(res, {
      success: true,
      message: "Payment completed successfully.",
      statusCode: httpStatus.OK,
      data: {
        session,
      },
    });
  },
);
