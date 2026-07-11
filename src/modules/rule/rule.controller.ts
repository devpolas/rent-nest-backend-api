import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import {
  createRuleIntoDB,
  deleteRuleFromDB,
  getAllRulesFromDB,
  getRuleByIdFromDB,
  updateRuleIntoDB,
} from "./rule.service";
import { RuleTypeSchema, RuleUpdateTypeSchema } from "./rule.schema";

// Create Rule
export const createRule = catchAsync(async (req: Request, res: Response) => {
  const payload = RuleTypeSchema.parse(req.body);

  const rule = await createRuleIntoDB(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Rule created successfully",
    data: {
      rule,
    },
  });
});

// Get All Rules
export const getAllRules = catchAsync(async (req: Request, res: Response) => {
  const rules = await getAllRulesFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rules retrieved successfully",
    data: {
      rules,
    },
  });
});

// Get Rule By Id
export const getRuleById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  const rule = await getRuleByIdFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rule retrieved successfully",
    data: {
      rule,
    },
  });
});

// Update Rule
export const updateRule = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  const payload = RuleUpdateTypeSchema.parse(req.body);

  const rule = await updateRuleIntoDB(id, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Rule updated successfully",
    data: {
      rule,
    },
  });
});

// Delete Rule
export const deleteRule = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  await deleteRuleFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.NO_CONTENT,
    message: "Rule deleted successfully",
  });
});
