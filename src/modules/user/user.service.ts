import prisma from "../../lib/prisma";
import { AppError } from "../../utils/appError";
import httpStatus from "http-status";
import type { AdminUserInputType, UserUpdateInputType } from "./user.schema";
import type { Prisma } from "../../../generated/prisma/client";

const userInclude = {
  _count: {
    select: {
      landlordRentalRequests: true,
      tenantRentalRequests: true,
      property: true,
    },
  },
  profile: {
    include: {
      location: true,
      socialProfile: true,
    },
  },
  sessions: true,
} satisfies Prisma.UsersInclude;

const meInclude = {
  ...userInclude,
  accounts: true,
} satisfies Prisma.UsersInclude;

// Get single user
export const getUserByIdFromDB = async (id: string) => {
  const user = await prisma.users.findUnique({
    where: {
      id,
    },
    omit: {
      password: true,
    },
    include: userInclude,
  });

  if (!user) {
    throw new AppError("User doesn't exist", httpStatus.NOT_FOUND);
  }

  return user;
};
// Get me
export const getMe = async (id: string) => {
  const user = await prisma.users.findUnique({
    where: {
      id,
    },
    omit: {
      password: true,
    },
    include: meInclude,
  });

  if (!user) {
    throw new AppError("User doesn't exist", httpStatus.NOT_FOUND);
  }

  return user;
};

// Get all users
export const getAllUsersFromDB = async () => {
  const users = await prisma.users.findMany({
    omit: {
      password: true,
    },
    include: userInclude,
    orderBy: {
      createdAt: "desc",
    },
  });

  return users;
};

// Update user
export const updateUserIntoDB = async (
  id: string,
  payload: UserUpdateInputType | AdminUserInputType,
) => {
  const existingUser = await prisma.users.findUnique({
    where: {
      id,
    },
  });

  if (!existingUser) {
    throw new AppError("User doesn't exist", httpStatus.NOT_FOUND);
  }

  const userData = {
    ...(payload.name !== undefined && {
      name: payload.name,
    }),

    ...(payload.phone !== undefined && {
      phone: payload.phone,
    }),

    ...(payload.avatar !== undefined && {
      avatar: payload.avatar,
    }),

    ...("role" in payload &&
      payload.role !== undefined && {
        role: payload.role,
      }),

    ...("status" in payload &&
      payload.status !== undefined && {
        status: payload.status,
      }),
  };

  await prisma.users.update({
    where: {
      id,
    },

    data: userData,
  });

  const updatedUser = await prisma.users.findUnique({
    where: {
      id,
    },

    include: userInclude,

    omit: {
      password: true,
    },
  });

  return updatedUser;
};

// Delete user
export const deleteUserFromDB = async (id: string) => {
  const user = await prisma.users.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    throw new AppError("User doesn't exist", httpStatus.NOT_FOUND);
  }

  await prisma.users.delete({
    where: {
      id,
    },
  });

  return null;
};
