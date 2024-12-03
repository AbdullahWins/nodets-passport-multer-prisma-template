// src/configs/multer/multer.config.ts
import { Request } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const uploadDir = path.join(process.cwd(), "public/files");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, "public/files");
  },
  filename: (
    _req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

export const upload = multer({
  storage: storage,
  fileFilter: (
    _req: Request,
    file: Express.Multer.File,
    cb: (error: any, acceptFile: boolean) => void
  ) => {
    const supportedFile = /jpg|jpeg|png|webp|svg|pdf|docx/;
    const extension = path.extname(file.originalname);

    if (supportedFile.test(extension)) {
      cb(null, true);
    } else {
      cb(new Error("Must be a jpg/png/jpeg/webp/svg/pdf/docx file"), false);
    }
  },
});
