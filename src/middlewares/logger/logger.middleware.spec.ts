import { Request, Response } from "express";
import { getRequestFulllUrl } from "../../utils";
import { requestLoggerMiddleware } from "./logger.middleware";
import { httpLogger } from "../../services";

jest.mock("../../services/logger/logger.service", () => ({
  httpLogger: {
    http: jest.fn(),
  },
}));

jest.mock("../../utils", () => ({
  getRequestFulllUrl: jest.fn(() => "http://localhost:3000/test"),
}));

describe("requestLoggerMiddleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = { method: "GET" } as Partial<Request>;
    res = {
      on: jest.fn((event: string, callback: () => void) => {
        if (event === "finish") callback(); // Simulate the "finish" event
      }),
      statusCode: 200,
    } as unknown as Partial<Response>;
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks(); // Reset all mocks between tests
  });

  it("logs the request details when the response finishes", () => {
    requestLoggerMiddleware(req as Request, res as Response, next);

    // Simulate the response "finish" event
    res.on?.("finish", () => {});

    expect(next).toHaveBeenCalled(); // Ensure next() is called
    expect(httpLogger.http).toHaveBeenCalledWith(
      "GET http://localhost:3000/test 200 - 0ms"
    );
  });

  it("calls getRequestFulllUrl utility with the request object", () => {
    requestLoggerMiddleware(req as Request, res as Response, next);
    expect(getRequestFulllUrl).toHaveBeenCalledWith(req);
  });
});
