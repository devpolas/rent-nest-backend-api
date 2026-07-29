import prisma from "../../lib/prisma";
import { AppError } from "../../utils/appError";
import httpStatus from "http-status";

import type {
  LocationCreateInput,
  LocationUpdateInput,
} from "./location.schema";

// Create Location
export const createLocationIntoDB = async (payload: LocationCreateInput) => {
  if (payload.type !== "PROPERTY" && !payload.profileId) {
    throw new AppError(
      "Profile id required for user location",
      httpStatus.BAD_REQUEST,
    );
  }

  if (payload.profileId) {
    const existingLocation = await prisma.location.findFirst({
      where: {
        profileId: payload.profileId,
        type: payload.type,
      },
    });

    if (existingLocation) {
      throw new AppError("Location already exists", httpStatus.BAD_REQUEST);
    }
  }

  const locationPayload = await prisma.location.create({
    data: {
      type: payload.type,

      country: payload.country,
      division: payload.division,
      district: payload.district,
      city: payload.city,
      village: payload.village,
      postalCode: payload.postalCode,

      ...(payload.latitude !== undefined && {
        latitude: payload.latitude,
      }),

      ...(payload.longitude !== undefined && {
        longitude: payload.longitude,
      }),

      ...(payload.addressLine !== undefined && {
        addressLine: payload.addressLine,
      }),

      ...(payload.profileId !== undefined && {
        profileId: payload.profileId,
      }),
    },
  });

  const location = await prisma.location.create({
    data: locationPayload,
  });

  return location;
};

// Get All Locations

export const getAllLocationsFromDB = async () => {
  const locations = await prisma.location.findMany({
    orderBy: {
      createdAt: "desc",
    },

    include: {
      profile: true,
      property: true,
    },
  });

  return locations;
};

// Get Location By Id
export const getLocationByIdFromDB = async (id: string) => {
  const location = await prisma.location.findUnique({
    where: {
      id,
    },

    include: {
      profile: true,
      property: true,
    },
  });

  if (!location) {
    throw new AppError("Location not found", httpStatus.NOT_FOUND);
  }

  return location;
};

// Get Profile Locations
export const getLocationsByProfileIdFromDB = async (profileId: string) => {
  const locations = await prisma.location.findMany({
    where: {
      profileId,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return locations;
};

// Update Location
export const updateLocationIntoDB = async (
  id: string,
  payload: LocationUpdateInput,
) => {
  const existingLocation = await prisma.location.findUnique({
    where: {
      id,
    },
  });

  if (!existingLocation) {
    throw new AppError("Location not found", httpStatus.NOT_FOUND);
  }

  const updatePayload = {
    ...(payload.latitude !== undefined && {
      latitude: payload.latitude,
    }),

    ...(payload.longitude !== undefined && {
      longitude: payload.longitude,
    }),

    ...(payload.type !== undefined && {
      type: payload.type,
    }),

    ...(payload.country !== undefined && {
      country: payload.country,
    }),

    ...(payload.division !== undefined && {
      division: payload.division,
    }),

    ...(payload.district !== undefined && {
      district: payload.district,
    }),

    ...(payload.city !== undefined && {
      city: payload.city,
    }),

    ...(payload.village !== undefined && {
      village: payload.village,
    }),

    ...(payload.postalCode !== undefined && {
      postalCode: payload.postalCode,
    }),

    ...(payload.addressLine !== undefined && {
      addressLine: payload.addressLine,
    }),
  };

  const updatedLocation = await prisma.location.update({
    where: {
      id,
    },

    data: updatePayload,
  });

  return updatedLocation;
};

// Delete Location
export const deleteLocationFromDB = async (id: string) => {
  const existingLocation = await prisma.location.findUnique({
    where: {
      id,
    },
  });

  if (!existingLocation) {
    throw new AppError("Location not found", httpStatus.NOT_FOUND);
  }

  await prisma.location.delete({
    where: {
      id,
    },
  });

  return null;
};
