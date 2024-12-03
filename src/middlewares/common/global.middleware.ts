import express from "express";
import { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import { upload } from "../../configs/multer/multer.config";
import { requestLoggerMiddleware } from "../logger/logger.middleware";
import { promClientMiddleware } from "../monitor/monitor.middleware";
import passport from "passport";
import { configurePassport } from "../../configs/passport/passport.config";
import { parseJsonBodyMiddleware } from "../parse/parse.middleware";
import { primaryRequestValidator } from "../validator/validator.middleware";
import { corsConfig } from "../../configs/cors/cors.config";
import { infoLogger } from "../../utilities";
import { environment } from "../../configs";

export const globalMiddleware = (app: Application) => {
  // Load all configurations
  infoLogger.info(`Server starting on port ${environment.server.SERVER_PORT}`);
  // Validate request primarily
  app.use(primaryRequestValidator);

  // Add global middlewares
  app.use(cors(corsConfig));
  app.use(helmet());
  app.use(requestLoggerMiddleware);

  // Add body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Multer middleware for handling multipart/form-data (both files and text)
  app.use(
    upload.fields([
      { name: "single", maxCount: 1 },
      { name: "document", maxCount: 1 },
      { name: "multiple", maxCount: 10 },
    ])
  );

  // Custom JSON parsing middleware
  app.use(parseJsonBodyMiddleware);

  // Prometheus metrics middleware
  app.use(promClientMiddleware);

  // Initialize Passport configuration
  configurePassport();
  app.use(passport.initialize());
};
