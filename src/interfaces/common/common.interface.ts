// src/interfaces/common/common.interface.ts
import { Types } from "mongoose";

export interface ICommonEntitySchema {
  _id: Types.ObjectId;
  email: string;
  phone: string;
  password: string;
  role: string;
  image?: string;
  googleId?: string;
  otp?: string | undefined;
  otpExpires?: number | undefined;
  isEmailVerified?: boolean;
  createdAt?: number;
  updatedAt?: number;
  __v?: number;
}

// common schema
export interface ICommonSchema {
  _id?: Types.ObjectId;
  createdAt?: number;
  updatedAt?: number;
  __v?: number;
}

export interface IOtpData {
  email: string;
  otp: string;
}

export interface IErrorMessage {
  path?: string;
  message: string;
}

export interface IErrorResponse {
  statusCode: number;
  message: string;
  errorMessages?: IErrorMessage[];
  success: boolean;
  data: null;
  meta: null;
}

export interface IApiReponse<T> {
  statusCode: number;
  message?: string | null;
  success?: boolean;
  data?: T | null;
  meta?: object | null;
}

export interface IKeyValueObject {
  [key: string]: string | undefined;
}
