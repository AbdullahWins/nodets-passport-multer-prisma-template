// src/configs/server/server.config.ts
import { Application } from "express";
import { Server } from "http";
import { connectToDatabase } from "../database/database.config";
import { environment } from "../environment/environment.config";
import { errorLogger, infoLogger } from "../../services";

// server related works
process.on("uncaughtException", (error) => {
  errorLogger.error(`Error uncaught exception server: ${error.message}`);
  process.exit(1);
});

// server listener
export const startServer = async (app: Application) => {
  let server: Server;
  try {
    // server listen
    server = app.listen(environment.server.SERVER_PORT, async () => {
      // connect database after server started
      await connectToDatabase();

      infoLogger.info(
        `Listening on port http://localhost:${environment.server.SERVER_PORT}/api/v1`
      );
    });
  } catch (error) {
    errorLogger.error(
      `Error creating server: ${
        error instanceof Error ? error.message : "unknown"
      }`
    );
    process.exit(1);
  }
  // Optionally return the server instance if needed
  return server;
};
