import type { NextFunction, Request, Response } from "express";

export default function globalErrorController(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const statusCode = err.statusCode ?? 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Something went wrong",
    error: err,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
}
