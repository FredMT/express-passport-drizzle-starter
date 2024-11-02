import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public errors?: any[]
  ) {
    super(message);
    this.name = "AppError";
    Error.captureStackTrace(this, this.constructor);
  }
}

// Helper function to format Zod validation errors
const formatZodError = (error: ZodError) => {
  const firstError = error.errors[0];

  return {
    message: firstError.message,
    field: firstError.path.join("."),
    details: error.errors.map((err) => ({
      field: err.path.join("."),
      message: err.message,
      code: err.code,
    })),
  };
};

export const errorHandler = (
  err: Error | AppError | ZodError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error:", {
    name: err.name,
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const formattedError = formatZodError(err);
    return res.status(400).json({
      status: "error",
      message: formattedError.message,
      field: formattedError.field,
      details:
        process.env.NODE_ENV === "development"
          ? formattedError.details
          : undefined,
    });
  }

  // Handle custom application errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
      errors: err.errors,
    });
  }

  // Handle unknown errors
  return res.status(500).json({
    status: "error",
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
};
