// src/configs/monitor/monitor.config.ts
import promClient from "prom-client";

// Initialize Prometheus metrics
const collectDefaultMetrics = promClient.collectDefaultMetrics;

// Collect default metrics (no timeout property)
collectDefaultMetrics();

// Define the Prometheus histogram
export const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.1, 0.5, 1, 2, 5], // Modify these buckets as per your needs
});
