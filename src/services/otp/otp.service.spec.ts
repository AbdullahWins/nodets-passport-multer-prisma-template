import bcrypt from "bcrypt";
import moment from "moment";
import { generateOtp, otpExpiresIn, validateOtp } from "./otp.service";
import { staticProps } from "../../utils";

describe("OTP Service", () => {
  describe("generateOtp", () => {
    it("should generate an OTP of the specified length", async () => {
      const length = 6;
      const otp = await generateOtp(length);
      expect(otp).toHaveLength(length);
      expect(otp).toMatch(/^\d+$/); // Check if OTP contains only digits
    });

    it("should generate an OTP of default length 4 if no length is provided", async () => {
      const otp = await generateOtp();
      expect(otp).toHaveLength(4);
      expect(otp).toMatch(/^\d+$/);
    });
  });

  describe("otpExpiresIn", () => {
    it("should return a future expiration time in unix format", () => {
      const minutes = 10;
      const expiresIn = otpExpiresIn(minutes);
      expect(expiresIn).toBeGreaterThan(moment().utc().unix());
    });

    it("should default to 5 minutes if no time is provided", () => {
      const expiresIn = otpExpiresIn();
      expect(expiresIn).toBeGreaterThan(moment().utc().unix());
      expect(expiresIn).toBeLessThanOrEqual(moment().add(5, "minutes").unix());
    });
  });

  describe("validateOtp", () => {
    let otp: string;
    let hashedOtp: string;
    let otpExpires: number;

    beforeAll(async () => {
      otp = await generateOtp();
      hashedOtp = await bcrypt.hash(otp, 10);
      otpExpires = otpExpiresIn(5); // Set to expire in 5 minutes
    });

    it("should return OTP_EXPIRED if OTP is expired", async () => {
      const expiredTime = moment().subtract(1, "minute").unix();
      const result = await validateOtp(otp, hashedOtp, expiredTime);
      expect(result.message).toBe(staticProps.otp.OTP_EXPIRED);
      expect(result.isMatched).toBe(false);
    });

    it("should return OTP_INVALID if OTP does not match", async () => {
      const result = await validateOtp("wrongOtp", hashedOtp, otpExpires);
      expect(result.message).toBe(staticProps.otp.OTP_INVALID);
      expect(result.isMatched).toBe(false);
    });

    it("should return OTP_VERIFIED if OTP matches and is not expired", async () => {
      const result = await validateOtp(otp, hashedOtp, otpExpires);
      expect(result.message).toBe(staticProps.otp.OTP_VERIFIED);
      expect(result.isMatched).toBe(true);
    });
  });
});
