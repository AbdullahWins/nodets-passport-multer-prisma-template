// src/utils/errors/global.error.ts
import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { staticProps } from "../../constants";
import { ApiError, handleApiError } from "./api.error";
import { environment } from "../../configs";
import { IErrorResponse } from "../../interfaces";
import { handlePrismaError } from "./prisma.error"; // Updated import for Prisma error handling
import { MulterError } from "multer";
import { handleMulterError } from "./multer.error";
import { handleZodError } from "./zod.error";
import { errorLogger } from "../../utilities";

// Get a structured error response from different error types
const getErrorResponse = (error: any): IErrorResponse => {
  // Handle ApiError
  if (error instanceof ApiError) {
    return handleApiError(error);
  }

  // Handle Prisma errors
  if (error.name === "PrismaClientValidationError" || error.code) {
    return handlePrismaError(error);
  }

  // Handle multer error
  if (error instanceof MulterError) {
    return handleMulterError(error);
  }

  // Handle zod error
  if (error instanceof Error && error.name === "ZodError") {
    return handleZodError(error);
  }

  // Handle generic errors (fallback)
  return {
    statusCode: error?.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
    message: error?.message || staticProps.common.SOMETHING_WENT_WRONG,
    errorMessages: error?.stack ? [{ message: error.stack }] : [],
    success: false,
    data: null,
    meta: null,
  };
};

// Global error handler middleware
export const globalErrorHandler: ErrorRequestHandler = (
  error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Get the structured error response
  const errorResponse = getErrorResponse(error);

  // Determine if we're in a production environment
  const isProduction = environment.server.SERVER_ENV === "production";

  // Log the error message for debugging
  errorLogger.error(error.message);

  // Production environment: less verbose error message
  if (isProduction) {
    return res.status(errorResponse.statusCode).json({
      statusCode: errorResponse.statusCode,
      message: errorResponse.message,
      success: false,
      data: null,
    });
  } else {
    // Development environment: more verbose error message with detailed stack
    return res.status(errorResponse.statusCode).json({
      statusCode: errorResponse.statusCode,
      success: errorResponse.success,
      message: errorResponse.message,
      errorMessages: errorResponse.errorMessages,
      data: errorResponse.data,
    });
  }
};
