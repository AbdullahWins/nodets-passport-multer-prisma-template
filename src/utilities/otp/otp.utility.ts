// src/services/otp/otp.service.ts
import moment from "moment";
import bcrypt from "bcrypt";
import { staticProps } from "../../constants";

// generate random number
const generateRandomNumber = (length: number): string => {
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
};

// generate otp
export const generateOtp = async (length?: number): Promise<string> => {
  const otpLength = length || 4;
  const otp = generateRandomNumber(otpLength);
  return otp;
};

// otp expiration
export const otpExpiresIn = (minutes?: number): number => {
  return moment()
    .add(minutes || 5, "minutes")
    .unix();
};

// validate otp
export const validateOtp = async (
  otp: string,
  hashedOtp: string,
  otpExpires: number
): Promise<{ message: string; isMatched: boolean }> => {
  if (moment().utc().unix() > otpExpires) {
    return {
      isMatched: false,
      message: staticProps.otp.OTP_EXPIRED,
    };
  }
  const isMatched = await bcrypt.compare(otp, hashedOtp);
  return {
    isMatched: isMatched,
    message: isMatched
      ? staticProps.otp.OTP_VERIFIED
      : staticProps.otp.OTP_INVALID,
  };
};
