// src/dtos/user/user.zod.ts
import { z } from "zod";

const BaseUserDtoZodSchema = z.object({
  fullName: z.string().min(1),
  username: z.string().min(1),
  email: z.string().min(1).email(),
  password: z.string().min(1),
  phone: z.string().min(1).max(15),
  image: z.string().min(1).url(),
  isEmailVerified: z.boolean(),
  role: z.string().min(1),
});

export const UserSignupDtoZodSchema = BaseUserDtoZodSchema.pick({
  fullName: true,
  username: true,
  email: true,
  password: true,
});

export const UserLoginDtoZodSchema = BaseUserDtoZodSchema.pick({
  email: true,
  password: true,
});
