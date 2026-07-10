import type Stripe from "stripe";
import config from "../../config";
import prisma from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { AppError } from "../../utils/appError";
import httpStatus from "http-status";

export const checkout = async ({
  rentRequestId,
}: {
  rentRequestId: string;
}): Promise<Stripe.Checkout.Session> => {
  const isExitsRentRequest = await prisma.rentalRequests.findUnique({
    where: {
      id: rentRequestId,
    },
    select: {
      id: true,
      status: true,
      leaseMonths: true,
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

  if (!isExitsRentRequest) {
    throw new AppError(
      "Rent Request not found, Payment failed",
      httpStatus.NOT_FOUND,
    );
  }

  if (isExitsRentRequest.status !== "APPROVED") {
    throw new AppError(
      "Rent request has not been approved.",
      httpStatus.BAD_REQUEST,
    );
  }

  const { tenant, property, leaseMonths, id } = isExitsRentRequest;

  if (!tenant) {
    throw new AppError(
      "Tenant not found, Payment failed",
      httpStatus.NOT_FOUND,
    );
  }

  if (!property) {
    throw new AppError(
      "Property not found, Payment failed",
      httpStatus.NOT_FOUND,
    );
  }

  if (!leaseMonths || leaseMonths <= 0) {
    throw new AppError("Invalid lease duration.", httpStatus.BAD_REQUEST);
  }

  const isExitsPayment = await prisma.payment.findUnique({
    where: {
      propertyId_tenantId_status: {
        propertyId: property.id,
        tenantId: tenant.id,
        status: "SUCCESS",
      },
    },
  });

  if (isExitsPayment) {
    throw new AppError(
      "Payment has already been completed.",
      httpStatus.BAD_REQUEST,
    );
  }

  const totalPrice =
    Number(property.rent) * Number(leaseMonths) +
    Number(property.securityDeposit);

  // Stripe expects smallest currency unit
  // Example: $100.00 => 10000
  const amountInCents = Math.round(totalPrice * 100);

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
    },

    mode: "payment",

    success_url: `${config.website_url}/payment?success=true&session_id={CHECKOUT_SESSION_ID}`,

    cancel_url: `${config.website_url}/payment?success=false`,
  });

  return session;
};
