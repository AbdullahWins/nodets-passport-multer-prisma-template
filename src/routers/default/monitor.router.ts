import { Request, Response } from "express";
import { promMetricsMiddleware } from "../../middlewares";

// Metrics endpoint for Prometheus to scrape
export const metricsRouter = async (req: Request, res: Response) => {
  promMetricsMiddleware(req, res);
};
