// src/configs/environment/environment.config.ts
import dotenv from "dotenv";
import path from "path";
import { projectRootPath } from "../../utils";

dotenv.config({
  path: projectRootPath ? path.join(projectRootPath, ".env") : ".env",
});

export const environment = {
  server: {
    SERVER_ENV: process.env.SERVER_ENV || "development",
    SERVER_PORT: Number(process.env.SERVER_PORT) || 5000,
    SERVER_BASE_URL: process.env.SERVER_BASE_URL || "http://localhost:6000",
  },

  db: {
    MONGOOSE_URI: process.env.MONGOOSE_URI || "mongodb://localhost:27017",
    DATABASE_NAME: process.env.DATABASE_NAME || "default",
    CONNECTION_STRING:
      `${process.env.MONGOOSE_URI}/${process.env.DATABASE_NAME}` ||
      "mongodb://localhost:27017/default",
  },

  jwt: {
    JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET || "default",
    JWT_ACCESS_TOKEN_EXPIRATION_TIME:
      process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME || "15m",
  },
  google: {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "default",
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "default",
    GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI || "default",
  },

  encryption: {
    BCRYPT_SALT_ROUND: Number(process.env.BCRYPT_SALT_ROUND) || 10,
  },

  log: {
    LOG_LEVEL: process.env.LOG_LEVEL || "info",
  },

  email: {
    NODEMAILER_EMAIL_DISPLAY_NAME:
      process.env.NODEMAILER_EMAIL_DISPLAY_NAME || "Default",
    NODEMAILER_EMAIL_HOSTNAME:
      process.env.NODEMAILER_EMAIL_HOSTNAME || "smtp.test.com",
    NODEMAILER_EMAIL_PORT: Number(process.env.NODEMAILER_EMAIL_PORT) || 587,
    NODEMAILER_EMAIL_ADDRESS: process.env.NODEMAILER_EMAIL_ADDRESS || "default",
    NODEMAILER_EMAIL_PASSWORD:
      process.env.NODEMAILER_EMAIL_PASSWORD || "default",
  },
};
