import { Application } from "express";
import { createServer, Server as HTTPServer } from "http";
import { connectToPostgres } from "../database/prisma.config";
import { environment } from "../environment/environment.config";
import { errorLogger, infoLogger } from "../../utilities"; // Import WebSocket initialization
import { initializeWebSocket } from "./socket.config";

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  errorLogger.error(`Uncaught exception: ${error.message}`);
  process.exit(1);
});

// Start the server
export const startServer = async (app: Application): Promise<HTTPServer> => {
  try {
    // Create an HTTP server instance
    const httpServer: HTTPServer = createServer(app);

    // Initialize WebSocket server
    initializeWebSocket(httpServer);

    // Start listening on the specified port
    httpServer.listen(environment.server.SERVER_PORT, async () => {
      // Connect to the database after starting the server
      await connectToPostgres();

      infoLogger.info(
        `Server running at http://localhost:${environment.server.SERVER_PORT}/api/v1`
      );
    });

    return httpServer; // Return the server instance if needed
  } catch (error) {
    errorLogger.error(
      `Error starting server: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
    process.exit(1);
  }
};
