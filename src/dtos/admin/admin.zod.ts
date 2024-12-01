// src/dtos/admin/admin.zod.ts
import { z } from "zod";

// Base Admin DTO schema with all properties
const BaseAdminDtoZodSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().min(1).email(),
  image: z.string().min(1).url(),
  password: z.string().min(1),
  isEmailVerified: z.boolean(),
  role: z.string().min(1),
});

// Admin Signup DTO schema
export const AdminSignupDtoZodSchema = BaseAdminDtoZodSchema.pick({
  fullName: true,
  email: true,
  password: true,
});

// Admin Login DTO schema
export const AdminLoginDtoZodSchema = BaseAdminDtoZodSchema.pick({
  email: true,
  password: true,
});

// Admin Update DTO schema
export const AdminUpdateDtoZodSchema = BaseAdminDtoZodSchema.partial();
