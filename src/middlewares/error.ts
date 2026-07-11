import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/appError";
import { ZodError } from "zod";
import { Prisma } from "../../generated/prisma/client";

const handleJWTerror = () => {
  return new AppError("Please login first!", 401);
};

const handleZodError = (err: ZodError) => {
  const message = err.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join(", ");

  return new AppError(message, 400);
};

const handlePrismaKnownRequestError = (
  err: Prisma.PrismaClientKnownRequestError,
) => {
  switch (err.code) {
    case "P2002":
      return new AppError("A record with this value already exists.", 409);

    case "P2003":
      return new AppError(
        "Related record does not exist or cannot be referenced.",
        400,
      );

    case "P2025":
      return new AppError("Requested record was not found.", 404);

    case "P2014":
      return new AppError(
        "This operation would violate a required relation.",
        400,
      );

    case "P2016":
      return new AppError("Query interpretation failed.", 400);

    case "P2018":
      return new AppError("Required related record was not found.", 400);

    case "P2021":
      return new AppError("The table does not exist.", 500);

    case "P2022":
      return new AppError("The column does not exist.", 500);

    case "P2024":
      return new AppError("Database connection timeout.", 503);

    case "P2034":
      return new AppError(
        "Database transaction failed. Please try again.",
        409,
      );

    default:
      return new AppError("Database request failed.", 500);
  }
};

const handlePrismaValidationError = () => {
  return new AppError("Invalid database query.", 400);
};

const handlePrismaInitializationError = () => {
  return new AppError("Failed to connect to the database.", 503);
};

const handlePrismaRustPanicError = () => {
  return new AppError("Unexpected database engine failure.", 500);
};

const handlePrismaUnknownRequestError = () => {
  return new AppError("Unknown database error.", 500);
};

const sendDevError = (err: any, res: Response) => {
  res.status(err.statusCode).json({
    timestamp: new Date().toISOString(),
    success: false,
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendProductionError = (err: AppError, res: Response) => {
  // Don't send accidentally other error
  if (err.isOperational) {
    res.status(err.statusCode).json({
      timestamp: new Date().toISOString(),
      success: false,
      status: err.status,
      message: err.message,
    });
  } else {
    // when it was not operational error send the default error
    res.status(500).json({
      status: "error",
      message: "something went very wrong!",
    });
  }
};

export default function globalErrorController(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  err.statusCode = err.statusCode ?? 500;
  err.status = err.status ?? "error";

  if (process.env.NODE_ENV === "development") {
    sendDevError(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = err;

    if (error instanceof ZodError) {
      error = handleZodError(error);
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      error = handlePrismaKnownRequestError(error);
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      error = handlePrismaValidationError();
    }

    if (error instanceof Prisma.PrismaClientInitializationError) {
      error = handlePrismaInitializationError();
    }

    if (error instanceof Prisma.PrismaClientRustPanicError) {
      error = handlePrismaRustPanicError();
    }

    if (error instanceof Prisma.PrismaClientUnknownRequestError) {
      error = handlePrismaUnknownRequestError();
    }

    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      error = handleJWTerror();
    }

    sendProductionError(error, res);
  }
}
