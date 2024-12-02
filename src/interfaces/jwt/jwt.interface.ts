// src/interfaces/jwt/jwt.interface.ts
import { PrismaClient } from "@prisma/client";
import { Strategy as JwtStrategy } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";

export interface IJwtPayload {
  id: number; // Assuming Prisma uses a numeric ID
  email: string;
  role: string;
}

// Updated the strategy configuration types
export interface IConfigureJwtStrategy {
  (jwtSecret: string): JwtStrategy;
}

export interface IConfigureLocalStrategy {
  (prisma: PrismaClient): LocalStrategy;
}
