// src/middlewares/monitor/monitor.middleware.ts
import promClient from "prom-client";
import { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { IErrorResponse } from "../../interfaces";
import { httpRequestDurationMicroseconds } from "../../configs";
import { staticProps } from "../../constants";

// Middleware to track request duration
export const promClientMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  res.on("finish", () => {
    // Record the request duration when the response is finished
    end({
      method: req.method,
      route: req.originalUrl,
      status_code: res.statusCode,
    });
  });
  next();
};

export const promMetricsMiddleware = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    res.set("Content-Type", promClient.register.contentType); // Set Prometheus content type
    const metrics = await promClient.register.metrics(); // Get the metrics
    res.send(metrics); // Send the metrics
  } catch (error) {
    const errorResponse: IErrorResponse = {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: staticProps.monitor.FAILED_TO_FETCH_METRICS,
      errorMessages: [{ message: (error as Error).message }],
      success: false,
      data: null,
      meta: null,
    };
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(errorResponse);
  }
};
