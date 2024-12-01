// src/interfaces/admin/admin.interface.ts
import { Model } from "mongoose";
import { ICommonEntitySchema } from "../common/common.interface";

// admin interface
export interface IAdmin extends ICommonEntitySchema {
  fullName: string;
  isVerified?: boolean;
}

// admin signup interface
export interface IAdminSignup {
  googleId?: string;
  fullName?: string;
  email?: string;
  password?: string;
  role?: string;
}

// admin login interface
export interface IAdminLogin {
  googleId?: string;
  email?: string;
  password?: string;
}

// admin schema methods
export interface IAdminModel extends Model<IAdmin> {
  isEntityExistsById(adminId: string, select?: string): Promise<IAdmin | null>;
  isEntityExistsByEmail(email: string, select?: string): Promise<IAdmin | null>;
}

export interface IAdminDocument extends IAdmin, Document {}
