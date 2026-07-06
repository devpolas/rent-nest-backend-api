import type { Response } from "express";

interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

interface SendResponse<T> {
  success: boolean;
  message: string;
  statusCode: number;
  data?: T;
  meta?: Meta;
}

export const sendResponse = <T>(
  res: Response,
  response: SendResponse<T>,
): Response => {
  const { success, message, statusCode, data, meta } = response;

  return res.status(statusCode).json({
    success,
    message,
    timestamp: new Date().toISOString(),
    ...(data !== undefined && { data }),
    ...(meta && { meta }),
  });
};
