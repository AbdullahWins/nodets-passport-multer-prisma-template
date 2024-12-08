import { Server as HTTPServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";

let io: SocketIOServer | null = null;

// Initialize WebSocket
export const initializeWebSocket = (httpServer: HTTPServer): void => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.CORS_ALLOWED_ORIGINS || "*", // Adjust for production
      methods: ["GET", "POST"],
    },
  });

  // Log when WebSocket server is running
  io.on("connection", (socket: Socket) => {
    const entityId = socket.handshake.query.entityId as string;

    if (entityId) {
      console.log(`WebSocket connected with entityId: ${entityId}`);
      socket.data.entityId = entityId; // Store it for later use
    } else {
      console.warn("WebSocket connected without entityId");
    }

    // Example: Handle a "message" event
    socket.on("message", (data) => {
      console.log(`Message from ${socket.data.entityId || "unknown"}: ${data}`);
      socket.emit("message", `Server received: ${data}`);
    });

    socket.on("disconnect", () => {
      console.log(
        `WebSocket disconnected: ${socket.data.entityId || "unknown"}`
      );
    });
  });

  // Log to confirm the WebSocket server is initialized and listening
  console.log("WebSocket server is initialized and ready for connections.");
};

// Get the WebSocket instance
export const getWebSocketInstance = (): SocketIOServer => {
  if (!io) {
    throw new Error(
      "Socket.IO is not initialized. Call initializeWebSocket() first."
    );
  }
  return io;
};
