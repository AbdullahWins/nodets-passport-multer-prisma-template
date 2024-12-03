// src/utils/helpers/global/url.util.ts
import { Request } from "express";
import { environment } from "../../configs";

export const getRequestFulllUrl = (req: Request) => {
  return "https://" + req.get("host") + req.originalUrl;
};

export const getRequestBaseUrl = (req: Request) => {
  return "https://" + req.get("host");
};

export const getFileUrl = (filePath?: string): string => {
  const baseUrl = environment.server.SERVER_BASE_URL;

  if (!filePath || filePath.trim() === "") {
    // Return a default image URL if no file path is provided
    return `${baseUrl}/public/default/default.png`;
  }

  // Ensure the file path uses forward slashes for URLs
  const normalizedPath = filePath.replace(/\\/g, "/");

  const fileUrl = `${baseUrl}/${normalizedPath}`;

  console.log("fileUrl", fileUrl);

  return fileUrl;
};
