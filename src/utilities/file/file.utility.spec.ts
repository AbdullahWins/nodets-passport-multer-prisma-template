import fs from "fs";
import path from "path";
import {
  removeFile,
  returnSingleFilePath,
  returnMultipleFilePath,
  singleFileTransfer,
  multipleFilesTransfer,
} from "./file.utility"; // Adjust the import path as necessary
import { errorLogger, infoLogger } from "../logger/logger.utility"; // Adjust the import path as necessary

jest.mock("fs");
jest.mock("../logger/logger.service", () => ({
  errorLogger: {
    error: jest.fn(),
  },
  infoLogger: {
    info: jest.fn(),
  },
}));

describe("File Service", () => {
  const mockFilePath = "mock/path/to/file.txt";
  const mockDestinationFolder = "uploads";
  const mockFile = { path: mockFilePath };

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  describe("removeFile", () => {
    it("should delete the file and log success if the file exists", async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.unlinkSync as jest.Mock).mockImplementation(() => {});

      await removeFile(mockFilePath);

      expect(fs.existsSync).toHaveBeenCalledWith(mockFilePath);
      expect(fs.unlinkSync).toHaveBeenCalledWith(mockFilePath);
      expect(infoLogger.info).toHaveBeenCalledWith(
        `File ${mockFilePath} deleted successfully`
      );
    });

    it("should log an error if the file does not exist", async () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);

      await removeFile(mockFilePath);

      expect(fs.existsSync).toHaveBeenCalledWith(mockFilePath);
      expect(fs.unlinkSync).not.toHaveBeenCalled();
      expect(errorLogger.error).toHaveBeenCalledWith(
        `File ${mockFilePath} does not exist`
      );
    });
  });

  describe("returnSingleFilePath", () => {
    it("should return the file path when files are provided as an array", async () => {
      const files = [mockFile];
      const filePath = await returnSingleFilePath(files);

      expect(filePath).toBe(mockFilePath);
    });

    it("should return the file path when files are provided as an object with a single property", async () => {
      const files = { single: [mockFile] };
      const filePath = await returnSingleFilePath(files);

      expect(filePath).toBe(mockFilePath);
    });

    it("should return undefined if no files are provided", async () => {
      const filePath = await returnSingleFilePath(null);

      expect(filePath).toBeUndefined();
    });
  });

  describe("returnMultipleFilePath", () => {
    it("should return an array of image paths", async () => {
      const files = { multiple: [mockFile] };
      const filePaths = await returnMultipleFilePath(files);

      expect(filePaths).toEqual([mockFilePath]);
    });

    it("should return an empty array if no files are provided", async () => {
      const filePaths = await returnMultipleFilePath(null);

      expect(filePaths).toEqual([]);
    });
  });

  describe("singleFileTransfer", () => {
    it("should move the file to the specified destination folder", () => {
      const expectedNewPath = path.join(
        process.cwd(),
        "public",
        mockDestinationFolder,
        "file.txt"
      );
      const expectedUrl = `/public/${mockDestinationFolder}/file.txt`;

      (fs.existsSync as jest.Mock).mockReturnValue(false); // Simulate folder not existing
      (fs.mkdirSync as jest.Mock).mockImplementation(() => {});
      (fs.rename as unknown as jest.Mock).mockImplementation(
        (_src, _dest, cb) => cb(null)
      ); // Simulate successful move

      const result = singleFileTransfer(mockFilePath, mockDestinationFolder);

      expect(fs.existsSync).toHaveBeenCalledWith(path.dirname(expectedNewPath));
      expect(fs.mkdirSync).toHaveBeenCalledWith(path.dirname(expectedNewPath), {
        recursive: true,
      });
      expect(fs.rename).toHaveBeenCalledWith(
        mockFilePath,
        expectedNewPath,
        expect.any(Function)
      );
      expect(infoLogger.info).toHaveBeenCalledWith(
        `File moved successfully to ${expectedNewPath}`
      );
      expect(result).toBe(expectedUrl);
    });

    it("should log an error if moving the file fails", () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true); // Simulate folder existing
      (fs.rename as unknown as jest.Mock).mockImplementation(
        (_src, _dest, cb) => cb(new Error("Move error"))
      );

      singleFileTransfer(mockFilePath, mockDestinationFolder);

      expect(errorLogger.error).toHaveBeenCalledWith(
        `Error moving file: Error: Move error`
      );
    });
  });

  describe("multipleFilesTransfer", () => {
    it("should move multiple files to the specified destination folder", async () => {
      const imagePaths = [mockFilePath];

      (fs.existsSync as jest.Mock).mockReturnValue(false); // Simulate folder not existing
      (fs.mkdirSync as jest.Mock).mockImplementation(() => {});
      (fs.rename as unknown as jest.Mock).mockImplementation(
        (_src, _dest, cb) => cb(null)
      ); // Simulate successful move

      const paths = await multipleFilesTransfer(
        imagePaths,
        mockDestinationFolder
      );

      expect(paths).toEqual([`/public/${mockDestinationFolder}/file.txt`]);
    });
  });
});
