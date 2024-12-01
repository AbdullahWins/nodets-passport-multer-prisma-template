// src/configs/logger/logger.config.ts
import winston from "winston";
import path from "path";
import fs from "fs";

// Set the log directory
const logDirectory = path.join(process.cwd(), "logs");
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// Custom log colors
const customColors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "cyan",
  verbose: "blue",
  debug: "magenta",
  silly: "gray",
};

winston.addColors(customColors);

// Logger configuration
export const loggerConfig = {
  level: "info", // Set a default log level
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp }) => {
      const formattedMessage = `[${timestamp}] [${level.toUpperCase()}] ${
        typeof message === "object" ? JSON.stringify(message, null, 2) : message
      }`;
      return formattedMessage;
    })
  ),
  transports: [
    // Console transport
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    // File transport for combined logs
    new winston.transports.File({
      filename: path.join(logDirectory, "combined.log"),
      level: "info",
      handleExceptions: true,
    }),
    // File transport for error logs
    new winston.transports.File({
      filename: path.join(logDirectory, "error.log"),
      level: "error",
      handleExceptions: true,
    }),
    // HTTP logs can be captured separately if needed
    new winston.transports.File({
      filename: path.join(logDirectory, "http.log"),
      level: "http",
      handleExceptions: true,
    }),
  ],
  exitOnError: false, // Do not exit on handled exceptions
};
