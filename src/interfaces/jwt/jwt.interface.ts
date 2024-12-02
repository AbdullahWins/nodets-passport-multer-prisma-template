// src/interfaces/jwt/jwt.interface.ts
import { Model } from "mongoose";
import { Strategy as JwtStrategy } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";

export interface IJwtPayload {
  id: number;
  email: string;
  role: string;
}

export interface IConfigureJwtStrategy {
  (jwtSecret: string): JwtStrategy;
}

export interface IConfigureLocalStrategy {
  (model: Model<any>): LocalStrategy;
}
