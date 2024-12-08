import { Request, Response } from "express";
import { getWebSocketInstance } from "../../configs/server/socket.config";

export const broadcastNotification = (req: Request, res: Response): Response => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  const io = getWebSocketInstance();
  io.emit("notification", message);

  return res.status(200).json({ success: true, message: "Notification sent." });
};