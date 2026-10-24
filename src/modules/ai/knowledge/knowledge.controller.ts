import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../../utils/catchAsync";
import { sendResponse } from "../../../utils/sendResponse";
import { knowledgeSearchSchema } from "../ai.schema";
import { retrieveKnowledge } from "./retrieval.service";
import { ingestKnowledgeBase } from "./ingestion.service";

const search = catchAsync(async (req: Request, res: Response) => {
  const { q } = knowledgeSearchSchema.parse(req.query);
  const results = retrieveKnowledge(q);

  sendResponse(res, {
    success: true,
    message: "Knowledge search completed.",
    statusCode: httpStatus.OK,
    data: { results },
  });
});

const ingest = catchAsync(async (_req: Request, res: Response) => {
  const result = await ingestKnowledgeBase();

  sendResponse(res, {
    success: true,
    message: "Knowledge base checked successfully.",
    statusCode: httpStatus.OK,
    data: result,
  });
});

export const knowledgeController = {
  search,
  ingest,
};
