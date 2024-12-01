// src/dtos/store/store.zod.ts
import { z } from "zod";

// Base Store DTO schema with minimal properties
const BaseStoreDtoZodSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  email: z.string().email().min(5).max(50),
  password: z.string().min(1),
  phone: z.string().min(5).max(15),
  image: z.string().min(1).url(),
  document: z.string().url(),
  role: z.string().min(1),
  otp: z.string().min(1),
});

// Extended Store DTO schema for signup
export const StoreSignupDtoZodSchema = BaseStoreDtoZodSchema.pick({
  name: true,
  address: true,
  email: true,
  phone: true,
  password: true,
});

// Extended Store DTO schema for login
export const StoreLoginDtoZodSchema = BaseStoreDtoZodSchema.pick({
  email: true,
  password: true,
});

// Extended Store DTO schema for email and otp
export const StoreOtpDtoZodSchema = BaseStoreDtoZodSchema.pick({
  email: true,
  otp: true,
});

// Extended Store DTO schema for partial store details
export const StoreUpdateDtoZodSchema = BaseStoreDtoZodSchema.partial();
