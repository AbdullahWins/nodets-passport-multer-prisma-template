// src/utils/errors/zod.error.ts
import httpStatus from "http-status";
import { IErrorMessage, IErrorResponse } from "../../interfaces";
import { staticProps } from "../constants/static.constant";

// Custom error handler for Zod validation errors
export const handleZodError = (error: any): IErrorResponse => {
  const errors: IErrorMessage[] = error.errors.map((err: any) => {
    return {
      path: err.path[err.path.length - 1],
      message: err.message,
    };
  });

  return {
    statusCode: httpStatus.BAD_REQUEST,
    message: staticProps.common.VALIDATION_ERROR,
    errorMessages: errors,
    success: false,
    data: null,
    meta: null,
  };
};
