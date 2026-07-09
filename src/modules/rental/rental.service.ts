import prisma from "../../lib/prisma";
import { AppError } from "../../utils/appError";
import type {
  RentalRequestAdminAndOwnerUpdateType,
  RentalRequestType,
} from "./rental.schema";
import httpStatus from "http-status";

export const createRentRequestIntoDB = async (
  tenantId: string,
  payload: RentalRequestType,
) => {
  const { propertyId, leaseMonths, message, moveInDate } = payload;

  const isExitsRentRequestByTenant = await prisma.rentalRequests.findUnique({
    where: {
      tenantId_propertyId: {
        tenantId,
        propertyId,
      },
    },
  });

  if (isExitsRentRequestByTenant) {
    throw new AppError("Rent request already exists", httpStatus.BAD_REQUEST);
  }

  const isExitsTenant = await prisma.user.findUnique({
    where: {
      id: tenantId,
    },
    omit: {
      password: true,
    },
  });

  if (!isExitsTenant) {
    throw new AppError(
      "Tenant not found, Failed to createRentRequest",
      httpStatus.BAD_REQUEST,
    );
  }

  const isExitsProperty = await prisma.property.findUnique({
    where: {
      id: propertyId,
    },
  });

  if (!isExitsProperty) {
    throw new AppError(
      "Property not found, Failed to createRentRequest",
      httpStatus.BAD_REQUEST,
    );
  }

  const newRent = await prisma.rentalRequests.create({
    data: {
      tenantId,
      propertyId,
      landlordId: isExitsProperty.landlordId,
      message,
      moveInDate,
      leaseMonths,
    },
  });

  const rent = await prisma.rentalRequests.findUnique({
    where: {
      id: newRent.id,
    },
    include: {
      tenant: {
        include: {
          profile: true,
        },
        omit: {
          password: true,
        },
      },
      landlord: {
        include: {
          profile: true,
        },
        omit: {
          password: true,
        },
      },
      property: {
        include: {
          location: true,
          images: true,
          amenities: {
            include: {
              amenity: true,
            },
          },
          features: {
            include: {
              feature: true,
            },
          },
          rules: {
            include: {
              rule: true,
            },
          },
        },
      },
    },
  });

  return rent;
};

export const updateRentRequestIntoDB = async (
  rentId: string,
  payload: RentalRequestAdminAndOwnerUpdateType,
  tenantId?: string,
  landlordId?: string,
) => {
  const isExitsRentRequest = await prisma.rentalRequests.findUnique({
    where: {
      id: rentId,
    },
  });

  if (!isExitsRentRequest) {
    throw new AppError("Rent request not found", httpStatus.NOT_FOUND);
  }
  if (
    (tenantId && tenantId !== isExitsRentRequest.tenantId) ||
    (landlordId && landlordId !== isExitsRentRequest.landlordId)
  ) {
    throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
  }

  const rentPayload = {
    ...(payload.message !== undefined && { message: payload.message }),
    ...(payload.moveInDate !== undefined && { moveInDate: payload.moveInDate }),
    ...(payload.leaseMonths !== undefined && {
      leaseMonths: payload.leaseMonths,
    }),
    ...(payload.status !== undefined && { status: payload.status }),
  };

  const updatedRentRequest = await prisma.rentalRequests.update({
    where: {
      id: rentId,
    },
    data: {
      ...rentPayload,
    },
  });

  const rent = await prisma.rentalRequests.findUnique({
    where: {
      id: updatedRentRequest.id,
    },
    include: {
      tenant: {
        include: {
          profile: true,
        },
        omit: {
          password: true,
        },
      },
      landlord: {
        include: {
          profile: true,
        },
        omit: {
          password: true,
        },
      },
      property: {
        include: {
          location: true,
          images: true,
          amenities: {
            include: {
              amenity: true,
            },
          },
          features: {
            include: {
              feature: true,
            },
          },
          rules: {
            include: {
              rule: true,
            },
          },
        },
      },
    },
  });

  return rent;
};

export const getAllRentRequestsFromDB = async (
  tenantId?: string,
  landlordId?: string,
) => {
  const rents = await prisma.rentalRequests.findMany({
    where: { ...(tenantId && { tenantId }), ...(landlordId && { landlordId }) },
    include: {
      tenant: {
        include: {
          profile: true,
        },
        omit: {
          password: true,
        },
      },
      landlord: {
        include: {
          profile: true,
        },
        omit: {
          password: true,
        },
      },
      property: {
        include: {
          location: true,
          images: true,
          amenities: {
            include: {
              amenity: true,
            },
          },
          features: {
            include: {
              feature: true,
            },
          },
          rules: {
            include: {
              rule: true,
            },
          },
        },
      },
    },
  });

  return rents;
};

export const getRentRequestFromDB = async (
  rentId: string,
  tenantId?: string,
  landlordId?: string,
) => {
  const isExitsRentRequest = await prisma.rentalRequests.findUnique({
    where: {
      id: rentId,
    },
  });

  if (!isExitsRentRequest) {
    throw new AppError("Rent request not found", httpStatus.NOT_FOUND);
  }

  if (
    (landlordId && landlordId !== isExitsRentRequest.landlordId) ||
    (tenantId && tenantId !== isExitsRentRequest.tenantId)
  ) {
    throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
  }

  const rent = await prisma.rentalRequests.findUnique({
    where: {
      id: rentId,
    },
    include: {
      tenant: {
        include: {
          profile: true,
        },
        omit: {
          password: true,
        },
      },
      landlord: {
        include: {
          profile: true,
        },
        omit: {
          password: true,
        },
      },
      property: {
        include: {
          location: true,
          images: true,
          amenities: {
            include: {
              amenity: true,
            },
          },
          features: {
            include: {
              feature: true,
            },
          },
          rules: {
            include: {
              rule: true,
            },
          },
        },
      },
    },
  });

  return rent;
};

export const deleteRentRequestFromDB = async (
  rentId: string,
  tenantId?: string,
  landlordId?: string,
) => {
  const isExitsRentRequest = await prisma.rentalRequests.findUnique({
    where: {
      id: rentId,
    },
  });

  if (!isExitsRentRequest) {
    throw new AppError("Rent request not found", httpStatus.NOT_FOUND);
  }

  if (
    (landlordId && landlordId !== isExitsRentRequest.landlordId) ||
    (tenantId && tenantId !== isExitsRentRequest.tenantId)
  ) {
    throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
  }

  await prisma.rentalRequests.delete({
    where: {
      id: rentId,
    },
  });
};
