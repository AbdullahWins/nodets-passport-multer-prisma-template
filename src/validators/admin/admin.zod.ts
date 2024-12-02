import { z } from "zod";

// Base Admin DTO schema with all properties
const BaseAdminDtoZodSchema = z.object({
  id: z.number().optional(), // Optional for Admin Update, not used in Signup/Login
  fullName: z.string().min(1),
  email: z.string().min(1).email(),
  image: z.string().min(1).url().optional(), // Image is optional for updates
  password: z.string().min(1).optional(), // Password is optional for updates (if not updating, keep it optional)
  isEmailVerified: z.boolean().optional(), // Optional for update
  role: z.string().min(1),
  googleId: z.string().min(1).optional(), // Optional for Admin creation (if using Google login)
  otp: z.string().optional(), // Optional for OTP management
  otpExpires: z.number().optional(), // Optional for OTP expiration management
});

// Admin Signup DTO schema (password required)
export const AdminSignupDtoZodSchema = BaseAdminDtoZodSchema.pick({
  fullName: true,
  email: true,
  password: true,
  role: true,
});

// Admin Login DTO schema (email & password required)
export const AdminLoginDtoZodSchema = BaseAdminDtoZodSchema.pick({
  email: true,
  password: true,
});

// Admin Update DTO schema (all properties optional for update)
export const AdminUpdateDtoZodSchema = BaseAdminDtoZodSchema.partial();

// Admin Delete DTO schema (only requires id to delete)
export const AdminDeleteDtoZodSchema = z.object({
  id: z.number(),
});
