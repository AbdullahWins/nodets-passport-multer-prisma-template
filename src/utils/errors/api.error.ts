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

export const handleApiErrorResponse = (error: ApiError) => {
  // Don't create a new error, just return the response structure
  return {
    statusCode: error.statusCode,
    message: error.message,
    errorMessages: error.stack,
    success: false,
    data: null,
    meta: null,
  };
};
