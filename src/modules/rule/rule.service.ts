import slugify from "slugify";
import prisma from "../../lib/prisma";
import { AppError } from "../../utils/appError";
import httpStatus from "http-status";
import type { RuleTypeInput, RuleUpdateTypeInput } from "./rule.schema";

export const createRuleIntoDB = async (payload: RuleTypeInput) => {
  const slug = slugify(payload.name, {
    lower: true,
    strict: true,
  });

  const isExists = await prisma.rule.findFirst({
    where: {
      OR: [
        {
          name: payload.name,
        },
        {
          slug,
        },
      ],
    },
  });

  if (isExists) {
    throw new AppError("Rule already exists", httpStatus.BAD_REQUEST);
  }

  const rule = await prisma.rule.create({
    data: {
      name: payload.name,
      slug,
      ...(payload.icon !== undefined && {
        icon: payload.icon,
      }),
    },
  });

  return rule;
};

export const getAllRulesFromDB = async () => {
  const rules = await prisma.rule.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return rules;
};

export const getRuleByIdFromDB = async (id: string) => {
  const rule = await prisma.rule.findUnique({
    where: {
      id,
    },
  });

  if (!rule) {
    throw new AppError("Rule not found", httpStatus.NOT_FOUND);
  }

  return rule;
};

export const updateRuleIntoDB = async (
  id: string,
  payload: RuleUpdateTypeInput,
) => {
  const existingRule = await prisma.rule.findUnique({
    where: {
      id,
    },
  });

  if (!existingRule) {
    throw new AppError("rule not found", httpStatus.NOT_FOUND);
  }

  const updatePayload = {
    ...(payload.name !== undefined && {
      name: payload.name,
      slug: slugify(payload.name, {
        lower: true,
        strict: true,
      }),
    }),

    ...(payload.icon !== undefined && {
      icon: payload.icon,
    }),
  };

  const isDuplicate = await prisma.rule.findFirst({
    where: {
      OR: [
        ...(updatePayload.name
          ? [
              {
                name: updatePayload.name,
              },
            ]
          : []),

        ...(updatePayload.slug
          ? [
              {
                slug: updatePayload.slug,
              },
            ]
          : []),
      ],

      NOT: {
        id,
      },
    },
  });

  if (isDuplicate) {
    throw new AppError("rule already exists", httpStatus.BAD_REQUEST);
  }

  const updatedRule = await prisma.rule.update({
    where: {
      id,
    },
    data: updatePayload,
  });

  return updatedRule;
};

export const deleteRuleFromDB = async (id: string) => {
  const existingRule = await prisma.rule.findUnique({
    where: {
      id,
    },

    include: {
      _count: {
        select: {
          propertyRules: true,
        },
      },
    },
  });

  if (!existingRule) {
    throw new AppError("rule not found", httpStatus.NOT_FOUND);
  }

  if (existingRule._count.propertyRules > 0) {
    throw new AppError(
      "Cannot delete rule because property exist under this rule",
      httpStatus.BAD_REQUEST,
    );
  }

  await prisma.rule.delete({
    where: {
      id,
    },
  });

  return null;
};
