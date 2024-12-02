import { IErrorResponse } from "../../interfaces";

// src/utils/errors/api.error.ts
export class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string, stack = "") {
    super(message);
    this.statusCode = statusCode || 500;
    this.name = this.constructor.name;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export const handleApiError = (error: ApiError): IErrorResponse => {
  return {
    statusCode: error.statusCode,
    message: error.message,
    errorMessages: error.stack ? [{ message: error.stack }] : [],
    success: false,
    data: null,
    meta: null,
  };
};
