// src/services/bcrypt/bcrypt.service.ts
import bcrypt from "bcrypt";
import { environment } from "../../configs";

export const comparePassword = async (
  normalPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  const isMatched = await bcrypt.compare(normalPassword, hashedPassword);
  return isMatched;
};

export const hashPassword = async (string: string): Promise<string> => {
  const hashedString = await bcrypt.hash(
    string,
    environment.encryption.BCRYPT_SALT_ROUND
  );
  return hashedString;
};
