import { Request, Response } from "express";
import { httpLogger } from "../../utilities";
import { requestLoggerMiddleware } from "../../middlewares";
import moment from "moment";

// Mock both `httpLogger` and `getRequestFulllUrl` in a single `jest.mock` call
jest.mock("../../utilities", () => ({
  ...jest.requireActual("../../utilities"), // Preserve other utilities
  httpLogger: {
    http: jest.fn(), // Mock `httpLogger.http`
  },
  getRequestFulllUrl: jest.fn(() => "http://localhost:3000/test"), // Mock `getRequestFulllUrl`
}));

describe("requestLoggerMiddleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = {
      method: "GET",
      get: jest.fn((header: string) => {
        if (header === "host") return "localhost:3000"; // Mocking the `host` header
        return undefined;
      }),
      originalUrl: "/test", // Mock the originalUrl
    } as Partial<Request>;
    res = {
      on: jest.fn(),
      statusCode: 200,
    } as unknown as Partial<Response>;
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks(); // Reset all mocks between tests
  });

  it("calls next() to pass control to the next middleware", () => {
    requestLoggerMiddleware(req as Request, res as Response, next);
    expect(next).toHaveBeenCalled();
  });

  it("logs the request details when the response finishes", () => {
    const startTime = moment();
    // Simulate a 50ms duration
    moment(startTime).add(50, "ms");

    // Mock moment to return a fixed time for start and end
    jest.spyOn(moment.prototype, "diff").mockReturnValue(50);

    requestLoggerMiddleware(req as Request, res as Response, next);

    // Simulate the "finish" event
    const finishCallback = (res.on as jest.Mock).mock.calls[0][1];
    finishCallback(); // Invoke the registered callback

    expect(httpLogger.http).toHaveBeenCalledWith(
      "GET http://localhost:3000/test 200 - 50ms"
    );

    // Restore moment's original behavior
    jest.restoreAllMocks();
  });

  it("ensures the finish event is registered on the response", () => {
    requestLoggerMiddleware(req as Request, res as Response, next);

    // Ensure the "finish" event is registered
    expect(res.on).toHaveBeenCalledWith("finish", expect.any(Function));
  });
});
