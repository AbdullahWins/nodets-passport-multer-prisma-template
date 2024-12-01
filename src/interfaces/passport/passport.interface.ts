// src/interfaces/passport.ts

export interface PassportAuthError {
  message: string;
  code?: string;
  statusCode?: number;
}

export interface PassportAuthInfo {
  message: string;
}
