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
  // ============================================================
  // FETCH RENTAL REQUEST
  // ============================================================

  const rentalRequest = await prisma.rentalRequests.findUnique({
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

  // ============================================================
  // VALIDATION
  // ============================================================

  if (!rentalRequest) {
    throw new AppError("Rental request not found", httpStatus.NOT_FOUND);
  }

  if (rentalRequest.tenantId !== tenantId) {
    throw new AppError(
      "You cannot pay for this rental request",
      httpStatus.FORBIDDEN,
    );
  }

  if (rentalRequest.status !== "APPROVED") {
    throw new AppError(
      "Only approved rental requests can be paid",
      httpStatus.BAD_REQUEST,
    );
  }

  if (!rentalRequest.tenant) {
    throw new AppError("Tenant information not found", httpStatus.BAD_REQUEST);
  }

  if (!rentalRequest.property) {
    throw new AppError(
      "Property information not found",
      httpStatus.BAD_REQUEST,
    );
  }

  if (
    !Number.isInteger(rentalRequest.leaseDays) ||
    rentalRequest.leaseDays <= 0
  ) {
    throw new AppError("Invalid lease duration", httpStatus.BAD_REQUEST);
  }

  // ============================================================
  // CHECK EXISTING SUCCESSFUL PAYMENT
  // ============================================================

  const existingPayment = await prisma.payment.findFirst({
    where: {
      tenantId: rentalRequest.tenantId,
      propertyId: rentalRequest.property.id,
      status: "SUCCESS",
    },
    select: {
      id: true,
      transactionId: true,
    },
  });

  if (existingPayment) {
    throw new AppError(
      "Payment already completed for this property",
      httpStatus.BAD_REQUEST,
    );
  }

  // ============================================================
  // CALCULATE PAYMENT
  // ============================================================

  const rent = Number(rentalRequest.property.rent);
  const securityDeposit = Number(rentalRequest.property.securityDeposit);

  if (
    !Number.isFinite(rent) ||
    rent < 0 ||
    !Number.isFinite(securityDeposit) ||
    securityDeposit < 0
  ) {
    throw new AppError(
      "Invalid property payment amount",
      httpStatus.BAD_REQUEST,
    );
  }

  const totalAmount = rent * rentalRequest.leaseDays + securityDeposit;

  if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
    throw new AppError("Invalid payment amount", httpStatus.BAD_REQUEST);
  }

  const amountInCents = Math.round(totalAmount * 100);

  if (amountInCents <= 0) {
    throw new AppError("Invalid payment amount", httpStatus.BAD_REQUEST);
  }

  // ============================================================
  // CREATE STRIPE CHECKOUT SESSION
  // ============================================================

  const session = await stripe.checkout.sessions.create({
    mode: "payment",

    payment_method_types: ["card"],

    customer_email: rentalRequest.tenant.email,

    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: amountInCents,

          product_data: {
            name: `Rental payment - ${rentalRequest.property.title}`,
            description: rentalRequest.property.description.slice(0, 300),
          },
        },

        quantity: 1,
      },
    ],

    metadata: {
      rentRequestId: rentalRequest.id,
      tenantId: rentalRequest.tenant.id,
      propertyId: rentalRequest.property.id,
      leaseDays: String(rentalRequest.leaseDays),
    },

    // Tenant payment page
    success_url:
      `${config.website_url}/dashboard/tenant/payments` +
      `?status=success` +
      `&session_id={CHECKOUT_SESSION_ID}`,

    cancel_url:
      `${config.website_url}/dashboard/tenant/payments` + `?status=cancelled`,
  });

  // ============================================================
  // MARK RENTAL REQUEST AS PAYMENT PENDING
  // ============================================================

  await prisma.rentalRequests.update({
    where: {
      id: rentalRequest.id,
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
  // ============================================================
  // RETRIEVE STRIPE CHECKOUT SESSION
  // ============================================================

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.mode !== "payment") {
    throw new AppError("Invalid checkout session", httpStatus.BAD_REQUEST);
  }

  if (session.payment_status !== "paid") {
    throw new AppError(
      "Payment has not been completed",
      httpStatus.BAD_REQUEST,
    );
  }

  // ============================================================
  // GET TRANSACTION ID
  // ============================================================

  const transactionId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id;

  if (!transactionId) {
    throw new AppError("Transaction ID not found", httpStatus.BAD_REQUEST);
  }

  // ============================================================
  // PAYMENT HISTORY SELECT
  // ============================================================

  const paymentInclude = {
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
        avatar: true,
      },
    },

    landlord: {
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
      },
    },
  } as const;

  // ============================================================
  // IDEMPOTENCY CHECK
  // ============================================================

  const existingPayment = await prisma.payment.findUnique({
    where: {
      transactionId,
    },
  });

  if (existingPayment) {
    const paymentHistory = await prisma.payment.findUnique({
      where: {
        transactionId,
      },
      include: paymentInclude,
    });

    if (!paymentHistory) {
      throw new AppError("Payment history not found", httpStatus.NOT_FOUND);
    }

    return paymentHistory;
  }

  // ============================================================
  // VALIDATE STRIPE METADATA
  // ============================================================

  const metadata = session.metadata;

  if (!metadata) {
    throw new AppError("Payment metadata missing", httpStatus.BAD_REQUEST);
  }

  const { rentRequestId, tenantId, propertyId, leaseDays } = metadata;

  if (!rentRequestId || !tenantId || !propertyId || !leaseDays) {
    throw new AppError("Invalid payment metadata", httpStatus.BAD_REQUEST);
  }

  const leaseDaysNumber = Number(leaseDays);

  if (!Number.isInteger(leaseDaysNumber) || leaseDaysNumber <= 0) {
    throw new AppError("Invalid lease duration", httpStatus.BAD_REQUEST);
  }

  // ============================================================
  // VALIDATE STRIPE PAYMENT
  // ============================================================

  if (
    session.amount_total === null ||
    session.amount_total <= 0 ||
    !session.currency
  ) {
    throw new AppError("Invalid payment amount", httpStatus.BAD_REQUEST);
  }

  const currency = session.currency;

  // ============================================================
  // FETCH RENTAL REQUEST
  // ============================================================

  const rentalRequest = await prisma.rentalRequests.findUnique({
    where: {
      id: rentRequestId,
    },

    select: {
      id: true,
      status: true,
      leaseDays: true,
      propertyId: true,
      tenantId: true,
      landlordId: true,

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

      property: {
        select: {
          id: true,
          title: true,
          rent: true,
          securityDeposit: true,
        },
      },
    },
  });

  if (!rentalRequest) {
    throw new AppError("Rental request not found", httpStatus.NOT_FOUND);
  }

  // ============================================================
  // VERIFY STRIPE METADATA
  // ============================================================

  if (rentalRequest.tenantId !== tenantId) {
    throw new AppError(
      "Payment tenant does not match rental request",
      httpStatus.BAD_REQUEST,
    );
  }

  if (rentalRequest.propertyId !== propertyId) {
    throw new AppError(
      "Payment property does not match rental request",
      httpStatus.BAD_REQUEST,
    );
  }

  if (rentalRequest.leaseDays !== leaseDaysNumber) {
    throw new AppError(
      "Payment lease duration does not match rental request",
      httpStatus.BAD_REQUEST,
    );
  }

  // ============================================================
  // VERIFY RENTAL REQUEST
  // ============================================================

  if (rentalRequest.status !== "PAYMENT_PENDING") {
    throw new AppError(
      "Rental request is not ready for payment",
      httpStatus.BAD_REQUEST,
    );
  }

  if (!rentalRequest.property) {
    throw new AppError(
      "Property information not found",
      httpStatus.BAD_REQUEST,
    );
  }

  if (!rentalRequest.tenant || !rentalRequest.landlord) {
    throw new AppError(
      "Invalid rental request user data",
      httpStatus.BAD_REQUEST,
    );
  }

  // ============================================================
  // VERIFY PAYMENT AMOUNT
  // ============================================================

  const rent = Number(rentalRequest.property.rent);
  const securityDeposit = Number(rentalRequest.property.securityDeposit);

  if (
    !Number.isFinite(rent) ||
    rent < 0 ||
    !Number.isFinite(securityDeposit) ||
    securityDeposit < 0
  ) {
    throw new AppError(
      "Invalid property payment amount",
      httpStatus.BAD_REQUEST,
    );
  }

  const expectedAmount = rent * rentalRequest.leaseDays + securityDeposit;

  const expectedAmountInCents = Math.round(expectedAmount * 100);

  if (session.amount_total !== expectedAmountInCents) {
    throw new AppError(
      "Payment amount does not match rental request",
      httpStatus.BAD_REQUEST,
    );
  }

  // ============================================================
  // PREPARE PAYMENT DATA
  // ============================================================

  const amount = new Prisma.Decimal((session.amount_total / 100).toFixed(2));

  const expireIn = new Date();

  expireIn.setDate(expireIn.getDate() + leaseDaysNumber);

  // ============================================================
  // CREATE PAYMENT + ACTIVATE RENTAL
  // ============================================================

  await prisma.$transaction(async (tx) => {
    // ----------------------------------------------------------
    // Prevent duplicate payment processing
    // ----------------------------------------------------------

    const duplicatePayment = await tx.payment.findUnique({
      where: {
        transactionId,
      },
    });

    if (duplicatePayment) {
      return;
    }

    // ----------------------------------------------------------
    // Activate rental request
    // ----------------------------------------------------------

    const rentalUpdate = await tx.rentalRequests.updateMany({
      where: {
        id: rentRequestId,
        status: "PAYMENT_PENDING",
      },

      data: {
        status: "ACTIVE",
      },
    });

    if (rentalUpdate.count !== 1) {
      throw new AppError(
        "Rental request has already been processed",
        httpStatus.CONFLICT,
      );
    }

    // ----------------------------------------------------------
    // Create payment
    // ----------------------------------------------------------

    await tx.payment.create({
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

    await tx.property.update({
      where: {
        id: rentalRequest.propertyId,
      },
      data: {
        status: "RENTED",
      },
    });
  });

  // ============================================================
  // FETCH COMPLETE PAYMENT HISTORY
  // ============================================================

  const paymentHistory = await prisma.payment.findUnique({
    where: {
      transactionId,
    },

    include: paymentInclude,
  });

  if (!paymentHistory) {
    throw new AppError("Payment history not found", httpStatus.NOT_FOUND);
  }

  // ============================================================
  // SEND EMAIL NOTIFICATIONS
  // ============================================================

  try {
    await Promise.all([
      sendEmail({
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
            <strong>
              ${amount.toFixed(2)} ${currency.toUpperCase()}
            </strong>
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
      }),

      sendEmail({
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
            <strong>
              ${amount.toFixed(2)} ${currency.toUpperCase()}
            </strong>
          </p>

          <p>
            Transaction ID:
            <strong>${transactionId}</strong>
          </p>
        `,
      }),
    ]);
  } catch (error) {
    console.error("Payment email notification failed:", error);
  }

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
      ...(tenantId ? { tenantId } : {}),
      ...(landlordId ? { landlordId } : {}),
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
          avatar: true,
        },
      },

      landlord: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
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
          avatar: true,
        },
      },

      landlord: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
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

  if (landlordId && paymentHistory.landlordId !== landlordId) {
    throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
  }

  return paymentHistory;
};
