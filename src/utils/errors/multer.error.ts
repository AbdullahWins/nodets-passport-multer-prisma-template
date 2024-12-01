// src/utils/errors/multer.error.ts
import httpStatus from "http-status";
import { MulterError } from "multer";
import { IErrorResponse } from "../../interfaces";

export const handleMulterError = (error: MulterError): IErrorResponse => {
  return {
    statusCode: httpStatus.BAD_REQUEST,
    message: error.message,
    errorMessages: [
      {
        path: error.field || "file",
        message: error.message,
      },
    ],
    success: false,
    data: null,
    meta: null,
  };
};
