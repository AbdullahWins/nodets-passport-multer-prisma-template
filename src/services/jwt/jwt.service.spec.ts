import { generateJwtToken, verifyJwtToken } from "./jwt.service"; // Adjust the import path as necessary
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { IJwtPayload } from "../../interfaces";
import { environment } from "../../configs";
import { ObjectId } from "bson";

// Mock the jsonwebtoken module
jest.mock("jsonwebtoken");

describe("JWT Service", () => {
  const mockUser: IJwtPayload = {
    _id: new ObjectId("64b642d1a4c8f97d6d4a1abc"),
    email: "abc@gmail.com",
    role: "user", // Add role to match the actual implementation
  };
  const mockToken = "mockedToken";
  const mockSecret: Secret = "testSecret"; // Example secret
  const mockPayload: JwtPayload = { _id: "12345" };

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  describe("generateJwtToken", () => {
    it("should generate a JWT token", () => {
      // Mock the jwt.sign function
      (jwt.sign as jest.Mock).mockReturnValue(mockToken);

      const token = generateJwtToken(mockUser);

      expect(jwt.sign).toHaveBeenCalledWith(
        {
          _id: mockUser._id.toString(), // Convert ObjectId to string as implemented
          email: mockUser.email,
          role: mockUser.role,
        },
        environment.jwt.JWT_ACCESS_TOKEN_SECRET,
        {
          expiresIn: environment.jwt.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
        }
      );
      expect(token).toBe(mockToken);
    });
  });

  describe("verifyJwtToken", () => {
    it("should verify a JWT token and return the payload", () => {
      // Mock the jwt.verify function
      (jwt.verify as jest.Mock).mockReturnValue(mockPayload);

      const payload = verifyJwtToken(mockToken, mockSecret);

      expect(jwt.verify).toHaveBeenCalledWith(mockToken, mockSecret);
      expect(payload).toEqual(mockPayload);
    });

    it("should throw an error if verification fails", () => {
      // Mock the jwt.verify function to throw an error
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("Invalid token");
      });

      expect(() => verifyJwtToken(mockToken, mockSecret)).toThrow(
        "Invalid token"
      );
    });
  });
});
