import type { NextFunction, Request, Response } from "express";

export default function globalErrorController(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
}
