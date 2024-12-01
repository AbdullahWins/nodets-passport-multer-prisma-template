import { NextFunction, Request, Response } from "express";
import moment from "moment";
import { httpLogger } from "../../services";
import { getRequestFulllUrl } from "../../utils";

export const requestLoggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { method } = req;
  const startTime = moment();

  res.on("finish", () => {
    const endTime = moment();
    const duration = endTime.diff(startTime); // duration in milliseconds
    const message = `${method} ${getRequestFulllUrl(req)} ${
      res.statusCode
    } - ${duration}ms`;
    httpLogger.http(message);
  });

  next();
};
