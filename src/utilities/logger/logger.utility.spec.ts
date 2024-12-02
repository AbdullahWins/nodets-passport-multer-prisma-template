import fs from "fs";
import { errorLogger, httpLogger, infoLogger } from "./logger.utility";

// Mock the filesystem to avoid actual file creation
jest.mock("fs");

describe("Logger", () => {
  beforeAll(() => {
    // Simulate that the directory does not exist
    (fs.existsSync as jest.Mock).mockReturnValue(false);

    // Mock mkdirSync to simulate directory creation
    (fs.mkdirSync as jest.Mock).mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it("should create infoLogger correctly", () => {
    expect(infoLogger).toBeDefined();
    expect(infoLogger.level).toBe("info");
    expect(infoLogger.transports.length).toBe(2); // Should have 2 transports
  });

  it("should log info messages to console and file", () => {
    const logSpy = jest.spyOn(infoLogger, "info");
    const message = "This is an info message";

    // Call the logger
    infoLogger.info(message);

    expect(logSpy).toHaveBeenCalledWith(message); // Check if logger was called with the correct message
  });

  it("should create httpLogger correctly", () => {
    expect(httpLogger).toBeDefined();
    expect(httpLogger.level).toBe("http");
    expect(httpLogger.transports.length).toBe(2); // Should have 2 transports
  });

  it("should create errorLogger correctly", () => {
    expect(errorLogger).toBeDefined();
    expect(errorLogger.level).toBe("error");
    expect(errorLogger.transports.length).toBe(2); // Should have 2 transports
  });

  it("should log error messages to console and file", () => {
    const logSpy = jest.spyOn(errorLogger, "error");
    const errorMessage = "This is an error message";

    // Call the logger
    errorLogger.error(errorMessage);

    expect(logSpy).toHaveBeenCalledWith(errorMessage); // Check if logger was called with the correct error message
  });
});
