import fs from "fs";
import path from "path";
import { Request, Response, NextFunction } from "express";

export const checkImageExists = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Decode the original URL to handle spaces and special characters
  const decodedPath = decodeURI(req.originalUrl);

  // Build the file path based on the public directory
  const filePath = path.join(process.cwd(), decodedPath);

  fs.access(filePath, fs.constants.F_OK, (error) => {
    if (error) {
      // If the file does not exist, send a structured JSON response
      return res.status(404).json({
        success: false,
        message: "File Not Found",
        errorMessages: [
          {
            path: filePath,
            message: "Image not found or has been deleted.",
          },
        ],
      });
    }
    // If the file exists, proceed to the next middleware or route handler
    return next();
  });
};
