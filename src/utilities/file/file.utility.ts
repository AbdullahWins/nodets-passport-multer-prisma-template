import fs from "fs";
import { errorLogger, infoLogger } from "../logger/logger.utility";
import { IUploadFile } from "../../interfaces";
import { compressImage } from "../compression/sharp.utility";
import path from "path";

export const removeFile = async (imgPath: string) => {
  try {
    if (fs.existsSync(imgPath)) {
      // Check if file exists
      fs.unlinkSync(imgPath);
      infoLogger.info(`File ${imgPath} deleted successfully`);
    } else {
      errorLogger.error(`File ${imgPath} does not exist`);
    }
  } catch (error) {
    if (error instanceof Error) {
      errorLogger.error(`Error deleting file ${imgPath}: ${error.message}`);
    } else {
      errorLogger.error(`Error deleting file ${imgPath}: ${String(error)}`);
    }
  }
};

// single image file upload -> image path
const returnSingleFilePath = async (files: any) => {
  let filePath;

  if (files && Object.keys(files).length > 0) {
    if (Array.isArray(files)) {
      filePath = files[0].path;
    } else {
      filePath = files.single?.[0]?.path;
    }
  }

  return filePath;
};

// multiple image file upload -> image paths
const returnMultipleFilePath = async (files: any) => {
  let imagesPaths: string[] = [];
  if (files && Array.isArray(files)) {
    files.forEach((item: IUploadFile) => {
      imagesPaths.push(item.path);
    });
  } else if (files && files.multiple) {
    files.multiple.forEach((item: IUploadFile) => {
      imagesPaths.push(item.path);
    });
  }
  return imagesPaths;
};

// Get file paths based on existing store values or as undefined
// export const uploadFiles = async (
//   single?: IUploadFile[],
//   document?: IUploadFile[],
//   multiple?: IUploadFile[]
// ): Promise<{
//   filePath?: string | undefined; // Allow undefined
//   documentPath?: string | undefined; // Allow undefined
//   filesPath?: string[] | undefined; // Allow undefined
// }> => {
//   let filePath: string | undefined;
//   let documentPath: string | undefined;
//   let filesPath: string[] | undefined;

//   if (single && single.length > 0) {
//     filePath = await returnSingleFilePath(single);
//   }

//   if (document && document.length > 0) {
//     documentPath = await returnSingleFilePath(document);
//   }

//   if (multiple && multiple.length > 0) {
//     filesPath = await returnMultipleFilePath(multiple);
//   }

//   return { filePath, documentPath, filesPath };
// };

// Compress image if it's an image file (e.g., jpg, jpeg, png)
const compressIfNeeded = async (filePath: string): Promise<string> => {
  const extname = path.extname(filePath).toLowerCase();
  const imageExtensions = [".jpg", ".jpeg", ".png", ".webp"];

  if (imageExtensions.includes(extname)) {
    // Compress the image using sharp and overwrite original
    return await compressImage(filePath);
  }

  // If not an image, return the original path
  return filePath;
};

export const uploadFiles = async (
  single?: IUploadFile[],
  document?: IUploadFile[],
  multiple?: IUploadFile[]
): Promise<{
  filePath?: string | undefined; // Allow undefined
  documentPath?: string | undefined; // Allow undefined
  filesPath?: string[] | undefined; // Allow undefined
}> => {
  let filePath: string | undefined;
  let documentPath: string | undefined;
  let filesPath: string[] | undefined;

  // Handle single file upload
  if (single && single.length > 0) {
    filePath = await returnSingleFilePath(single);
    if (filePath) {
      // Compress the image if needed (overwrite the original)
      filePath = await compressIfNeeded(filePath);
    }
  }

  // Handle document upload (no compression needed here)
  if (document && document.length > 0) {
    documentPath = await returnSingleFilePath(document);
  }

  // Handle multiple file uploads
  if (multiple && multiple.length > 0) {
    filesPath = await returnMultipleFilePath(multiple);
    // Compress images in multiple uploads if they are images
    if (filesPath) {
      filesPath = await Promise.all(
        filesPath.map((path) => compressIfNeeded(path))
      );
    }
  }

  return { filePath, documentPath, filesPath };
};
