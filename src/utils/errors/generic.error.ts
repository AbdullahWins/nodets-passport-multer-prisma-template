// src/utils/errors/generic.error.ts
import httpStatus from "http-status";
import { IErrorMessage } from "../../interfaces";

export const handleGenericErrorResponse = (error: IErrorMessage) => {
  const statusCode = httpStatus.INTERNAL_SERVER_ERROR;
  return {
    statusCode: statusCode,
    message: error.message,
    errorMessages: [],
    success: false,
    data: null,
    meta: null,
  };
};
