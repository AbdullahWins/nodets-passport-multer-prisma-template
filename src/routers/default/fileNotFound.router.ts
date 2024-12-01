// src/routers/fileNotFound.router.ts
import { Request, Response } from "express";
import httpStatus from "http-status";

export const fileNotFoundRouter = (req: Request, res: Response) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "File Not Found",
    errorMessages: [
      {
        path: req.originalUrl,
        message: "Image not found or has been deleted.",
      },
    ],
  });
};
