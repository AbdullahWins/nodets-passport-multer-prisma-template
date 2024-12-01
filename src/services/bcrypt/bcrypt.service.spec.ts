import bcrypt from "bcrypt";
import { comparePassword, hashPassword } from "./bcrypt.service";

// Mock the bcrypt functions
jest.mock("bcrypt");

describe("Bcrypt Service", () => {
  describe("comparePassword", () => {
    it("should return true for matching passwords", async () => {
      const password = "testpassword";
      const hash = "hashedpassword"; // This would be a hash created from the actual password

      (bcrypt.compare as jest.Mock).mockResolvedValue(true); // Mocking bcrypt.compare to return true

      const result = await comparePassword(password, hash);

      expect(result).toBe(true); // Expect that the result is true
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hash); // Expect that bcrypt.compare was called with the correct parameters
    });

    it("should return false for non-matching passwords", async () => {
      const password = "testpassword";
      const hash = "hashedpassword";

      (bcrypt.compare as jest.Mock).mockResolvedValue(false); // Mocking bcrypt.compare to return false

      const result = await comparePassword(password, hash);

      expect(result).toBe(false); // Expect that the result is false
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hash); // Expect that bcrypt.compare was called with the correct parameters
    });
  });

  describe("hashPassword", () => {
    it("should return a hashed password", async () => {
      const password = "testpassword";
      const hashedPassword = "hashedpassword";

      // Use hash instead of hashSync for async handling
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword); // Mocking bcrypt.hash to return a hashed password

      const result = await hashPassword(password);

      expect(result).toBe(hashedPassword); // Expect that the result is the hashed password
      expect(bcrypt.hash).toHaveBeenCalledWith(password, expect.any(Number)); // Expect that bcrypt.hash was called with the correct parameters
    });
  });
});
