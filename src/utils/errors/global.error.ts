// src/utils/errors/global.error.ts
import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { staticProps } from "../constants/static.constant";
import { ApiError, handleApiErrorResponse } from "./api.error";
import { environment } from "../../configs";
import { IErrorResponse } from "../../interfaces";
import { MongoServerError } from "mongodb";
import { MongooseError } from "mongoose";
import {
  handleMongooseError,
  handleMongooseServerError,
} from "./mongoose.error";
import { MulterError } from "multer";
import { handleMulterError } from "./multer.error";
import { handleZodError } from "./zod.error";
import { errorLogger } from "../../services";

const getErrorResponse = (error: any): IErrorResponse => {
  //handle ApiError
  if (error instanceof ApiError) {
    handleApiErrorResponse(error);
  }

  //handle mongoose error
  if (error instanceof MongoServerError) {
    return handleMongooseServerError(error);
  }

  //handle mongoose error
  if (error instanceof MongooseError) {
    return handleMongooseError(error);
  }

  //handle multer error
  if (error instanceof MulterError) {
    return handleMulterError(error);
  }

  //handle zod error
  if (error instanceof Error && error.name === "ZodError") {
    return handleZodError(error);
  }

  // Handle generic errors
  return {
    statusCode: error?.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
    message: error?.message || staticProps.common.SOMETHING_WENT_WRONG,
    errorMessages: error?.stack ? [{ message: error.stack }] : [],
    success: false,
    data: null,
    meta: null,
  };
};

export const globalErrorHandler: ErrorRequestHandler = (
  error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const errorResponse = getErrorResponse(error);
  const isProduction = environment.server.SERVER_ENV === "production";

  errorLogger.error(error.message);

  if (isProduction) {
    return res.status(errorResponse.statusCode).json({
      statusCode: errorResponse.statusCode,
      message: errorResponse.message,
      success: false,
      data: null,
    });
  } else {
    return res.status(errorResponse.statusCode).json({
      statusCode: errorResponse.statusCode,
      success: errorResponse.success,
      message: errorResponse.message,
      errorMessages: errorResponse.errorMessages,
      data: errorResponse.data,
    });
  }
};
