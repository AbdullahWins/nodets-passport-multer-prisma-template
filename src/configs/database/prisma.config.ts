// src/configs/database/prisma.config.ts
import { PrismaClient } from "@prisma/client";
import { errorLogger, infoLogger } from "../../services";

// Initialize Prisma Client only once
export const prisma = new PrismaClient();

// Optionally connect when the app starts
export const connectToPostgres = async () => {
  try {
    await prisma.$connect();
    infoLogger.info("Connected to PostgreSQL using Prisma!");
  } catch (error) {
    errorLogger.error("Error connecting to the database: ", error);
    process.exit(1); // Exit the process if Prisma can't connect
  }
};

// Gracefully shut down Prisma client on process termination
const shutdown = async () => {
  await prisma.$disconnect();
  infoLogger.info("Disconnected from PostgreSQL.");
};

process.on("SIGINT", shutdown); // Handles termination (e.g., Ctrl+C)
process.on("SIGTERM", shutdown); // Handles termination signal (e.g., Kubernetes shutdown)
