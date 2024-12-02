import httpStatus from "http-status";
import { transporter } from "../../configs";
import { ApiError } from "..";

import { renderTemplate } from "../handlebar/handlebar.utility";
import { errorLogger } from "../logger/logger.utility";
import { sendEmail } from "./email.utility";
import { emailProps } from "../../constants";

// Mock dependencies
jest.mock("../../configs", () => ({
  transporter: {
    verify: jest.fn(),
    sendMail: jest.fn(),
  },
}));

jest.mock("../handlebar/handlebar.service", () => ({
  renderTemplate: jest.fn(),
}));

jest.mock("../logger/logger.service", () => ({
  errorLogger: {
    error: jest.fn(),
  },
  infoLogger: {
    info: jest.fn(),
  },
}));

describe("sendEmail", () => {
  const mockEmailData = {
    email: "abdudevs@gmail.com",
    subject: emailProps.subject.WELCOME_ADMIN,
    template: emailProps.template.WELCOME_ADMIN,
    data: { name: "testJest" },
  };

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it("should throw an ApiError when sending email fails", async () => {
    // Arrange
    (transporter.verify as jest.Mock).mockResolvedValueOnce(undefined);
    (renderTemplate as jest.Mock).mockReturnValueOnce("<p>Test Email</p>");
    (transporter.sendMail as jest.Mock).mockRejectedValueOnce(
      new Error("Send mail error")
    );

    // Act & Assert
    await expect(sendEmail(mockEmailData)).rejects.toThrow(ApiError);
    await expect(sendEmail(mockEmailData)).rejects.toHaveProperty(
      "statusCode",
      httpStatus.INTERNAL_SERVER_ERROR // Keeping this as INTERNAL_SERVER_ERROR
    );
    await expect(sendEmail(mockEmailData)).rejects.toHaveProperty(
      "message",
      "Failed to send email to user."
    );

    expect(errorLogger.error).toHaveBeenCalledWith(
      expect.stringContaining("Error on mail server:")
    );
  });

  it("should throw an ApiError if required fields are missing", async () => {
    // Arrange
    const incompleteEmailData = { ...mockEmailData, email: "" };

    // Act & Assert
    await expect(sendEmail(incompleteEmailData)).rejects.toThrow(ApiError);
    await expect(sendEmail(incompleteEmailData)).rejects.toHaveProperty(
      "statusCode",
      httpStatus.BAD_REQUEST
    );
    await expect(sendEmail(incompleteEmailData)).rejects.toHaveProperty(
      "message",
      "Missing required field: email."
    );
  });
});
