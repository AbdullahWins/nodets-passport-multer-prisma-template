import fs from "fs";
import { removeFile } from "./file.utility"; // Adjust the import path as necessary
import { errorLogger, infoLogger } from "../logger/logger.utility"; // Adjust the import path as necessary

jest.mock("fs");
jest.mock("../logger/logger.utility", () => ({
  errorLogger: {
    error: jest.fn(),
  },
  infoLogger: {
    info: jest.fn(),
  },
}));

describe("File Service", () => {
  const mockFilePath = "mock/path/to/file.txt";

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
});
