import prisma from "../../lib/prisma";
import { AppError } from "../../utils/appError";
import httpStatus from "http-status";
import type {
  SocialProfileCreateInput,
  SocialProfileUpdateInput,
} from "./social-profile.schema";

// Get all social profiles
export const getSocialProfilesFromDB = async (profileId: string) => {
  const socials = await prisma.socialProfile.findMany({
    where: {
      profileId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return socials;
};

// Get single social profile
export const getSocialProfileByIdFromDB = async (id: string) => {
  const social = await prisma.socialProfile.findUnique({
    where: {
      id,
    },
  });

  if (!social) {
    throw new AppError("Social profile not found", httpStatus.NOT_FOUND);
  }

  return social;
};

// Create social profile
export const createSocialProfileIntoDB = async (
  profileId: string,
  payload: SocialProfileCreateInput,
) => {
  const exists = await prisma.socialProfile.findUnique({
    where: {
      platform_profileId: {
        profileId,
        platform: payload.platform,
      },
    },
  });

  if (exists) {
    throw new AppError(
      "This social platform already exists",
      httpStatus.BAD_REQUEST,
    );
  }

  const social = await prisma.socialProfile.create({
    data: {
      profileId,
      platform: payload.platform,
      url: payload.url,
    },
  });

  return social;
};

// Update social profile
export const updateSocialProfileIntoDB = async (
  id: string,
  profileId: string,
  payload: SocialProfileUpdateInput,
) => {
  const social = await prisma.socialProfile.findUnique({
    where: {
      id,
    },
  });

  if (!social) {
    throw new AppError("Social profile not found", httpStatus.NOT_FOUND);
  }

  if (social.profileId !== profileId) {
    throw new AppError("You are not allowed", httpStatus.FORBIDDEN);
  }

  const updatedSocial = await prisma.socialProfile.update({
    where: {
      id,
    },
    data: {
      url: payload.url,
    },
  });

  return updatedSocial;
};

// Delete social profile
export const deleteSocialProfileFromDB = async (
  id: string,
  profileId: string,
) => {
  const social = await prisma.socialProfile.findUnique({
    where: {
      id,
    },
  });

  if (!social) {
    throw new AppError("Social profile not found", httpStatus.NOT_FOUND);
  }

  if (social.profileId !== profileId) {
    throw new AppError("You are not allowed", httpStatus.FORBIDDEN);
  }

  await prisma.socialProfile.delete({
    where: {
      id,
    },
  });
};
