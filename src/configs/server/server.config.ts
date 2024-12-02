// src/configs/server/server.config.ts
import { Application } from "express";
import { Server } from "http";
import { connectToPostgres } from "../database/prisma.config";
import { environment } from "../environment/environment.config";
import { errorLogger, infoLogger } from "../../utilities";

// Server related work
process.on("uncaughtException", (error) => {
  errorLogger.error(`Uncaught exception server: ${error.message}`);
  process.exit(1);
});

// Server listener
export const startServer = async (app: Application) => {
  let server: Server;
  try {
    // server listen
    server = app.listen(environment.server.SERVER_PORT, async () => {
      // connect to database after server started
      await connectToPostgres(); // Await the connection

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
