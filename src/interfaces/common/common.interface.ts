// src/interfaces/common/common.interface.ts

export interface IOtpData {
  email: string;
  otp: string;
}

export interface IMetaData {
  total: number;
  page: number;
  limit: number;
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
