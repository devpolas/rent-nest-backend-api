import type Stripe from "stripe";
import prisma from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import config from "../../config";
import { AppError } from "../../utils/appError";
import httpStatus from "http-status";
import { Prisma } from "../../../generated/prisma/client";
import { sendEmail } from "../../utils/sendEmail";

export const checkout = async ({
  rentRequestId,
  tenantId,
}: {
  rentRequestId: string;
  tenantId: string;
}): Promise<Stripe.Checkout.Session> => {
  const rentRequest = await prisma.rentalRequests.findUnique({
    where: {
      id: rentRequestId,
    },
    select: {
      id: true,
      status: true,
      leaseDays: true,
      tenantId: true,
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

  if (!rentRequest) {
    throw new AppError("Rental request not found", httpStatus.NOT_FOUND);
  }

  if (rentRequest.tenantId !== tenantId) {
    throw new AppError(
      "You cannot pay for this rental request",
      httpStatus.FORBIDDEN,
    );
  }

  if (rentRequest.status !== "APPROVED") {
    throw new AppError(
      "Only approved rental requests can be paid",
      httpStatus.BAD_REQUEST,
    );
  }

  if (!rentRequest.property || !rentRequest.tenant) {
    throw new AppError("Invalid rental request data", httpStatus.BAD_REQUEST);
  }

  if (rentRequest.leaseDays <= 0) {
    throw new AppError("Invalid lease duration", httpStatus.BAD_REQUEST);
  }

  const existingPayment = await prisma.payment.findFirst({
    where: {
      tenantId,
      propertyId: rentRequest.property.id,
      status: "SUCCESS",
    },
  });

  if (existingPayment) {
    throw new AppError("Payment already completed", httpStatus.BAD_REQUEST);
  }

  const totalAmount =
    Number(rentRequest.property.rent) * rentRequest.leaseDays +
    Number(rentRequest.property.securityDeposit);

  const amountInCents = Math.round(totalAmount * 100);

  /**
   * Create Stripe checkout session first.
   * Database status changes only after Stripe succeeds.
   */
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: rentRequest.tenant.email,
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: amountInCents,
          product_data: {
            name: `Rental payment - ${rentRequest.property.title}`,
            description: rentRequest.property.description.slice(0, 300),
          },
        },
        quantity: 1,
      },
    ],

    metadata: {
      rentRequestId: rentRequest.id,
      tenantId: rentRequest.tenant.id,
      propertyId: rentRequest.property.id,
      leaseDays: String(rentRequest.leaseDays),
    },

    success_url: `${config.website_url}/dashboard/payment?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.website_url}/dashboard/payment?success=false`,
  });

  /**
   * Mark request as payment pending
   */
  await prisma.rentalRequests.update({
    where: {
      id: rentRequest.id,
    },

    data: {
      status: "PAYMENT_PENDING",
    },
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
      "Payment has not been completed",
      httpStatus.BAD_REQUEST,
    );
  }

  const transactionId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id;

  if (!transactionId) {
    throw new AppError("Transaction ID not found", httpStatus.BAD_REQUEST);
  }

  const existingPayment = await prisma.payment.findUnique({
    where: {
      transactionId,
    },
  });

  if (existingPayment) {
    return existingPayment;
  }

  const metadata = session.metadata;

  if (!metadata) {
    throw new AppError("Payment metadata missing", httpStatus.BAD_REQUEST);
  }

  const { rentRequestId, leaseDays } = metadata;

  if (!rentRequestId || !leaseDays) {
    throw new AppError("Invalid payment metadata", httpStatus.BAD_REQUEST);
  }

  const leaseDaysNumber = Number(leaseDays);

  if (!Number.isInteger(leaseDaysNumber) || leaseDaysNumber <= 0) {
    throw new AppError("Invalid lease duration", httpStatus.BAD_REQUEST);
  }

  if (session.amount_total === null || !session.currency) {
    throw new AppError("Invalid payment amount", httpStatus.BAD_REQUEST);
  }
  const currency = session.currency;
  const rentalRequest = await prisma.rentalRequests.findUnique({
    where: {
      id: rentRequestId,
    },

    select: {
      id: true,
      status: true,
      propertyId: true,
      tenantId: true,
      landlordId: true,

      tenant: {
        select: {
          name: true,
          email: true,
        },
      },

      landlord: {
        select: {
          name: true,
          email: true,
        },
      },

      property: {
        select: {
          title: true,
        },
      },
    },
  });

  if (!rentalRequest) {
    throw new AppError("Rental request not found", httpStatus.NOT_FOUND);
  }

  if (rentalRequest.status !== "PAYMENT_PENDING") {
    throw new AppError(
      "Rental request is not ready for payment",
      httpStatus.BAD_REQUEST,
    );
  }

  const expireIn = new Date();

  expireIn.setDate(expireIn.getDate() + leaseDaysNumber);

  const amount = new Prisma.Decimal((session.amount_total / 100).toFixed(2));

  const payment = await prisma.$transaction(async (tx) => {
    await tx.rentalRequests.update({
      where: {
        id: rentRequestId,
      },

      data: {
        status: "ACTIVE",
      },
    });

    return await tx.payment.create({
      data: {
        amount,
        currency,
        propertyId: rentalRequest.propertyId,
        tenantId: rentalRequest.tenantId,
        landlordId: rentalRequest.landlordId,
        transactionId,
        provider: "STRIPE",

        status: "SUCCESS",

        expireIn,
      },
    });
  });

  // Email notification
  try {
    await sendEmail({
      to: rentalRequest.tenant.email,
      subject: "Payment Successful",
      title: "Payment Completed Successfully",
      description: `
        <p>Hello ${rentalRequest.tenant.name},</p>
        <p>
          Your payment for 
          <strong>${rentalRequest.property.title}</strong>
          has been completed successfully.
        </p>
        <p>
          Amount:
          <strong>${amount.toFixed(2)} ${currency.toUpperCase()}</strong>
        </p>
        <p>
          Lease Duration:
          <strong>${leaseDaysNumber} days</strong>
        </p>
        <p>
          Transaction ID:
          <strong>${transactionId}</strong>
        </p>
        <p>
          Thank you for choosing Rent Nest.
        </p>
      `,
    });

    await sendEmail({
      to: rentalRequest.landlord.email,
      subject: "New Rental Payment Received",
      title: "New Tenant Payment",
      description: `
        <p>Hello ${rentalRequest.landlord.name},</p>
        <p>
          A tenant has completed payment for your property.
        </p>
        <p>
          Property:
          <strong>${rentalRequest.property.title}</strong>
        </p>
        <p>
          Tenant:
          <strong>${rentalRequest.tenant.name}</strong>
        </p>
        <p>
          Amount:
          <strong>${amount.toFixed(2)} ${currency.toUpperCase()}</strong>
        </p>
        <p>
          Transaction ID:
          <strong>${transactionId}</strong>
        </p>
      `,
    });
  } catch (error) {
    console.error("Payment email failed:", error);
  }

  return payment;
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

    orderBy: {
      createdAt: "desc",
    },

    include: {
      property: {
        select: {
          id: true,
          title: true,
          rent: true,
          images: true,
        },
      },

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
    where: { transactionId },
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
