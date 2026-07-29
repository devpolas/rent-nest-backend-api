import httpStatus from "http-status";

import type {
  ProfileInputType,
  ProfileUpdateInputType,
} from "./profile.schema";
import prisma from "../../lib/prisma";
import { AppError } from "../../utils/appError";

// Create Profile
export const createProfileIntoDB = async ({
  payload,
  userId,
}: {
  payload: ProfileInputType;
  userId: string;
}) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new AppError("User not found", httpStatus.NOT_FOUND);
  }

  const existingProfile = await prisma.profile.findUnique({
    where: {
      userId: userId,
    },
  });

  if (existingProfile) {
    throw new AppError("Profile already exists", httpStatus.BAD_REQUEST);
  }

  const profile = await prisma.profile.create({
    data: {
      user: {
        connect: {
          id: userId,
        },
      },

      ...(payload.profileImage !== undefined && {
        profileImage: payload.profileImage,
      }),

      ...(payload.bio !== undefined && {
        bio: payload.bio,
      }),

      ...(payload.birthdate !== undefined && {
        birthdate: payload.birthdate,
      }),
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

// Update Profile

export const updateProfileIntoDB = async ({
  userId,
  payload,
}: {
  userId: string;
  payload: ProfileUpdateInputType;
}) => {
  const profile = await prisma.profile.findUnique({
    where: {
      userId,
    },
  });

  if (!profile) {
    throw new AppError("Profile not found", httpStatus.NOT_FOUND);
  }

  const updatePayload = {
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

  const updatedProfile = await prisma.profile.update({
    where: {
      userId,
    },

    data: updatePayload,

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

  return updatedProfile;
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
