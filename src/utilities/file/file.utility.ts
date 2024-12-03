import fs from "fs";
import { errorLogger, infoLogger } from "../logger/logger.utility";
import { IUploadFile } from "../../interfaces";

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

  if (single && single.length > 0) {
    filePath = await returnSingleFilePath(single);
  }

  if (document && document.length > 0) {
    documentPath = await returnSingleFilePath(document);
  }

  if (multiple && multiple.length > 0) {
    filesPath = await returnMultipleFilePath(multiple);
  }

  return { filePath, documentPath, filesPath };
};
