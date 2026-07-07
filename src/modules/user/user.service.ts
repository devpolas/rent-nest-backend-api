import prisma from "../../lib/prisma";
import { AppError } from "../../utils/appError";
import httpStatus from "http-status";

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
