// src/interfaces/admin/admin.interface.ts
import { Admin } from "@prisma/client";

// Admin interface

export interface IAdmin {
  id: number;
  fullName: string;
  email: string;
  password: string;
  image: string;
  role: string;
  isEmailVerified: boolean;
  otp?: string | null;
  otpExpires?: number | null;
  googleId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Admin signup interface
export interface IAdminSignup {
  fullName: string;
  email: string;
  password: string;
  role: string;
  image: string;
}

// Admin login interface
export interface IAdminLogin {
  email: string;
  password: string;
}

// Admin response DTO interface (for response formatting)
export interface IAdminResponseDto {
  id: number;
  fullName: string;
  email: string;
  image: string;
  role: string;
  isEmailVerified?: boolean;
}

// For Prisma's generated Admin type (strictly type-safe)
export type AdminFromPrisma = Admin;
