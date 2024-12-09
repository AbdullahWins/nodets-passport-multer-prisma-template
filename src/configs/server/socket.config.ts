import { Server as HTTPServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { errorLogger, infoLogger } from "../../utilities";

export let socketIo: SocketIOServer | null = null;

// Define custom socket data type
interface CustomSocket extends Socket {
  data: {
    entityId?: string;
  };
}

// Initialize WebSocket
export const initializeWebSocket = (httpServer: HTTPServer): void => {
  socketIo = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.CORS_ALLOWED_ORIGINS || "*",
      methods: ["GET", "POST"],
    },
  });

  // Log when WebSocket server is running
  socketIo.on("connection", (socket: CustomSocket) => {
    const entityId = socket.handshake.query.entityId as string;

    // Assign entityId to socket and join room
    if (entityId) {
      infoLogger.info(`WebSocket connected: ${entityId}`);
      socket.data.entityId = entityId;
      socket.join(entityId); // Automatically join a room named after entityId
    } else {
      errorLogger.error("WebSocket connected: unknown entityId");
    }

    // Handle custom events
    registerSocketEvents(socket);

    // Handle disconnection
    socket.on("disconnect", () => {
      if (socket.data.entityId) {
        infoLogger.info(`WebSocket disconnected: ${socket.data.entityId}`);
      } else {
        errorLogger.error("WebSocket disconnected: unknown entityId");
      }
    });
  });

  infoLogger.info("WebSocket server initialized");
};

// Register event handlers for each socket
const registerSocketEvents = (socket: CustomSocket) => {
  socket.on("message", (data) => {
    infoLogger.info(`WebSocket message from ${socket.data.entityId}: ${data}`);
    socket.emit("message", `Server received: ${data}`);
  });

  socket.on("joinNotificationChannel", (roomId: string) => {
    if (roomId) {
      socket.join(roomId);
      infoLogger.info(
        `Socket ${socket.data.entityId} joined notification room: ${roomId}`
      );
    } else {
      errorLogger.error(
        `Socket ${socket.data.entityId} failed to join room: Invalid roomId`
      );
    }
  });
};

// Get the WebSocket instance
export const getWebSocketInstance = (): SocketIOServer => {
  if (!socketIo) {
    throw new Error(
      "Socket.IO is not initialized. Call initializeWebSocket() first."
    );
  }
  return socketIo;
};
