import httpStatus from "http-status";

import type {
  ProfileInputType,
  ProfileUpdateInputType,
} from "./profile.schema";
import prisma from "../../lib/prisma";
import { AppError } from "../../utils/appError";

// Create Profile & update
export const createOrUpdateProfileIntoDB = async ({
  payload,
  userId,
}: {
  payload: ProfileInputType | ProfileUpdateInputType;
  userId: string;
}) => {
  const user = await prisma.users.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new AppError("User not found", httpStatus.NOT_FOUND);
  }

  const profileData = {
    ...(payload.profileImage !== undefined && {
      profileImage: payload.profileImage,
    }),

    ...(payload.bio !== undefined && {
      bio: payload.bio,
    }),

    ...(payload.birthdate !== undefined && {
      birthdate: payload.birthdate,
    }),
  };

  const profile = await prisma.profile.upsert({
    where: {
      userId,
    },

    create: {
      user: {
        connect: {
          id: userId,
        },
      },

      ...profileData,
    },

    update: profileData,

    include: {
      user: {
        select: {
          id: true,
          email: true,
          role: true,
        },
      },

      location: true,

      socialProfile: true,
    },
  });

  return profile;
};

// Get Profile
export const getProfileFromDB = async (userId: string) => {
  const profile = await prisma.profile.findUnique({
    where: {
      userId,
    },

    include: {
      user: {
        select: {
          id: true,
          email: true,
          role: true,
        },
      },

      location: true,

      socialProfile: true,
    },
  });

  if (!profile) {
    throw new AppError("Profile not found", httpStatus.NOT_FOUND);
  }

  return profile;
};

export const getProfileId = async (userId: string) => {
  const profile = await prisma.profile.findUnique({
    where: {
      userId,
    },
    select: {
      id: true,
    },
  });

  if (!profile) {
    throw new AppError("Profile not found", httpStatus.NOT_FOUND);
  }

  return profile.id;
};
