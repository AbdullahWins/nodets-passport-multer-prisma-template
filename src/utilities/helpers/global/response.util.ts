// src/utils/helpers/global/response.util.ts
import { Response } from "express";
import { IApiReponse } from "../../../interfaces";
import { infoLogger } from "../../logger/logger.utility";

export const sendResponse = <T>(res: Response, data: IApiReponse<T>): void => {
  const responseData: IApiReponse<T> = {
    statusCode: data.statusCode || 200,
    success: data.success || true,
    message: data.message || null,
    data: data.data || null,
    meta: data.meta || null,
  };

  // Log the response before sending
  infoLogger.info({
    message: responseData.message,
  });

  // Use sendResponse to send the response
  res.status(data.statusCode).json(responseData);
};

export const sendError = <T>(res: Response, data: IApiReponse<T>): void => {
  const responseData: IApiReponse<T> = {
    statusCode: data.statusCode || 500,
    success: data.success || false,
    message: data.message || null,
    data: null,
    meta: data.meta || null,
  };

  // log the error before sending
  infoLogger.error({
    message: responseData.message,
  });

  // Use sendError to send the response
  res.status(data.statusCode).json(responseData);
};
