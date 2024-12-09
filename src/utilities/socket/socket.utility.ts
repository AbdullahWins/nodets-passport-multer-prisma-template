import { socketIo } from "../../configs";
import { errorLogger } from "../logger/logger.utility";

interface ISocketNotification {
  recipients: string[];
  message: string;
}

//send a notification to the admin that they logged in
export const sendNotification = async (data: ISocketNotification) => {
  const io = socketIo;
  const { recipients, message } = data;
  if (io) {
    recipients.forEach((recipientId) => {
      io.to(`${recipientId}`).emit("notification", {
        recipientId,
        message,
      });
    });
  } else {
    errorLogger.error(
      "Socket.IO is not initialized. Call initializeWebSocket() first."
    );
    return;
  }
};
