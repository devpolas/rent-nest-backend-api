import prisma from "../../lib/prisma";
import { AppError } from "../../utils/appError";
import httpStatus from "http-status";
import type { UserInputType } from "./user.schema";

export const getProfileFromDB = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      profile: {
        include: {
          location: true,
          socialProfile: true,
        },
      },
    },
    omit: {
      password: true,
    },
  });

  if (!user) {
    throw new AppError("user doesn't exits", httpStatus.NOT_FOUND);
  }

  return user;
};

export const updateUserIntoDB = async (id: string, payload: UserInputType) => {
  const { avatar, name, phone, profile } = payload;

  const profileImage = profile?.profileImage;
  const bio = profile?.bio;
  const birthdate = profile?.birthdate;
  const socialProfiles = profile?.socialProfiles;
  const locations = profile?.locations;

  const userData = {
    ...(name !== undefined && { name }),
    ...(avatar !== undefined && { avatar }),
    ...(phone !== undefined && { phone }),
  };

  const profileData = {
    ...(profileImage !== undefined && { profileImage }),
    ...(bio !== undefined && { bio }),
    ...(birthdate !== undefined && { birthdate }),
  };

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      profile: {
        include: {
          socialProfile: true,
          location: true,
        },
      },
    },
  });

  if (!user) {
    throw new AppError("User doesn't exist", httpStatus.NOT_FOUND);
  }

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: {
        id: user.id,
      },
      data: userData,
    });

    await tx.profile.upsert({
      where: {
        userId: user.id,
      },
      update: profileData,

      create: {
        userId: user.id,
        ...profileData,
      },
    });

    if (socialProfiles && user.profile) {
      for (const social of socialProfiles) {
        await tx.socialProfile.upsert({
          where: {
            platform_profileId: {
              profileId: user.profile.id,
              platform: social.platform,
            },
          },
          update: {
            url: social.url,
          },
          create: {
            profileId: user.profile.id,
            platform: social.platform,
            url: social.url,
          },
        });
      }
    }

    if (locations && user.profile) {
      for (const location of locations) {
        const locationData = {
          type: location.type,
          country: location.country,
          division: location.division,
          district: location.district,
          city: location.city,
          village: location.village,
          postalCode: location.postalCode,

          ...(location.latitude !== undefined && {
            latitude: location.latitude,
          }),

          ...(location.longitude !== undefined && {
            longitude: location.longitude,
          }),

          ...(location.addressLine !== undefined && {
            addressLine: location.addressLine,
          }),
        };
        await tx.location.upsert({
          where: {
            type_profileId: {
              type: location.type,
              profileId: user.profile.id,
            },
          },

          update: locationData,

          create: {
            profileId: user.profile.id,
            ...locationData,
          },
        });
      }
    }
  });

  const updatedUser = prisma.user.findUnique({
    where: { id },
    include: {
      profile: {
        include: {
          socialProfile: true,
          location: true,
        },
      },
    },
  });

  return updatedUser;
};
