import type Stripe from "stripe";
import config from "../../config";
import prisma from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { AppError } from "../../utils/appError";
import httpStatus from "http-status";
import { Prisma } from "../../../generated/prisma/client";

export const checkout = async ({
  rentRequestId,
  tenantId,
}: {
  rentRequestId: string;
  tenantId: string;
}): Promise<Stripe.Checkout.Session> => {
  const existingRentRequest = await prisma.rentalRequests.findUnique({
    where: {
      id: rentRequestId,
    },
    select: {
      id: true,
      status: true,
      leaseDays: true,
      tenant: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      property: {
        select: {
          id: true,
          title: true,
          description: true,
          rent: true,
          securityDeposit: true,
        },
      },
    },
  });

  if (!existingRentRequest) {
    throw new AppError(
      "Rent Request not found, Payment failed",
      httpStatus.NOT_FOUND,
    );
  }

  if (existingRentRequest.status !== "APPROVED") {
    throw new AppError(
      "Rent request has not been approved.",
      httpStatus.BAD_REQUEST,
    );
  }

  const { tenant, property, leaseDays, id } = existingRentRequest;

  if (!tenant || !property) {
    throw new AppError("Invalid rental request data.", httpStatus.BAD_REQUEST);
  }

  if (tenantId !== tenant.id) {
    throw new AppError(
      "You cannot pay for this rental request",
      httpStatus.FORBIDDEN,
    );
  }

  if (!leaseDays || leaseDays <= 0) {
    throw new AppError("Invalid lease duration.", httpStatus.BAD_REQUEST);
  }

  const existingPayment = await prisma.payment.findUnique({
    where: {
      propertyId_tenantId_status: {
        propertyId: property.id,
        tenantId: tenant.id,
        status: "SUCCESS",
      },
    },
  });

  if (existingPayment) {
    throw new AppError(
      "Payment has already been completed.",
      httpStatus.BAD_REQUEST,
    );
  }

  const totalPrice =
    Number(property.rent) * Number(leaseDays) +
    Number(property.securityDeposit);

  // Stripe expects smallest currency unit
  // Example: $100.00 => 10000
  const amountInCents = Math.round(totalPrice * 100);

  await prisma.rentalRequests.update({
    where: {
      id: existingRentRequest.id,
    },
    data: {
      status: "PAYMENT_PENDING",
    },
  });

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: amountInCents,
          product_data: {
            name: `Please pay for ${property.title}`,
            description: property.description,
          },
        },
        quantity: 1,
      },
    ],

    customer_email: tenant.email,

    metadata: {
      rentRequestId: id,
      tenantId: tenant.id,
      propertyId: property.id,
      leaseDays,
    },

    mode: "payment",

    success_url: `${config.website_url}/payment?success=true&session_id={CHECKOUT_SESSION_ID}`,

    cancel_url: `${config.website_url}/payment?success=false`,
  });

  return session;
};

export const paymentCreateIntoDB = async ({
  sessionId,
}: {
  sessionId: string;
}) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.payment_status !== "paid") {
    throw new AppError(
      "Payment has not been completed.",
      httpStatus.BAD_REQUEST,
    );
  }

  const transactionId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id;

  if (!transactionId) {
    throw new AppError("Transaction ID not found.", httpStatus.BAD_REQUEST);
  }

  const existingPayment = await prisma.payment.findUnique({
    where: {
      transactionId,
    },
  });

  console.log(existingPayment);

  if (existingPayment) {
    return existingPayment;
  }

  if (!session.metadata) {
    throw new AppError(
      "Fail to payment please contact support session",
      httpStatus.FAILED_DEPENDENCY,
    );
  }

  const { rentRequestId, leaseDays } = session.metadata ?? {};

  if (!rentRequestId || !leaseDays) {
    throw new AppError("Invalid payment metadata.", httpStatus.BAD_REQUEST);
  }

  if (!session.currency) {
    throw new AppError("Currency not found.", httpStatus.BAD_REQUEST);
  }

  const currency = session.currency;

  if (session.amount_total == null) {
    throw new AppError("Payment amount not found.", httpStatus.BAD_REQUEST);
  }

  // expireIn
  const leaseDaysNumber = Number(leaseDays);

  if (!Number.isInteger(leaseDaysNumber) || leaseDaysNumber <= 0) {
    throw new AppError("Invalid lease duration.", httpStatus.BAD_REQUEST);
  }

  const expireIn = new Date();
  expireIn.setDate(expireIn.getDate() + leaseDaysNumber);

  const totalAmount = new Prisma.Decimal(
    (session.amount_total / 100).toFixed(2),
  );

  const currentRentRequest = await prisma.rentalRequests.findUnique({
    where: {
      id: rentRequestId,
    },
    select: {
      id: true,
      status: true,
      propertyId: true,
      tenantId: true,
      landlordId: true,
    },
  });

  if (!currentRentRequest) {
    throw new AppError("Rent request not found", httpStatus.NOT_FOUND);
  }

  if (currentRentRequest.status !== "PAYMENT_PENDING") {
    throw new AppError(
      "Rental request is no longer eligible for payment.",
      httpStatus.BAD_REQUEST,
    );
  }

  await prisma.$transaction(async (tx) => {
    await tx.rentalRequests.update({
      where: { id: rentRequestId },
      data: {
        status: "ACTIVE",
      },
    });
    await tx.payment.create({
      data: {
        amount: totalAmount,
        currency,
        propertyId: currentRentRequest.propertyId,
        tenantId: currentRentRequest.tenantId,
        landlordId: currentRentRequest.landlordId,
        transactionId,
        status: "SUCCESS",
        provider: "STRIPE",
        expireIn,
      },
    });
  });

  const paymentHistory = await prisma.payment.findUnique({
    where: {
      transactionId,
    },
  });

  return paymentHistory;
};

export const getAllPaymentHistoryFromDB = async ({
  tenantId,
  landlordId,
}: {
  tenantId?: string;
  landlordId?: string;
}) => {
  const paymentHistory = await prisma.payment.findMany({
    where: {
      ...(tenantId && {
        tenantId,
      }),
      ...(landlordId && {
        landlordId,
      }),
    },
    include: {
      tenant: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return paymentHistory;
};

export const getPaymentHistoryByIdFromDB = async ({
  transactionId,
  tenantId,
  landlordId,
}: {
  transactionId: string;
  tenantId?: string;
  landlordId?: string;
}) => {
  const paymentHistory = await prisma.payment.findUnique({
    where: {
      transactionId,
    },
    include: {
      tenant: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      landlord: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!paymentHistory) {
    throw new AppError("Payment not found", httpStatus.NOT_FOUND);
  }

  if (tenantId && paymentHistory.tenantId !== tenantId) {
    throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
  }
  if (tenantId && paymentHistory.landlordId !== landlordId) {
    throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
  }

  return paymentHistory;
};
