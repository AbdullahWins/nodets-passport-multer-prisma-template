// src/interfaces/user/user.interface.ts
import { Model } from "mongoose";
import { ICommonEntitySchema } from "../common/common.interface";

// user interface
export interface IUser extends ICommonEntitySchema {
  fullName: string;
  username: string;
}

// user signup interface
export interface IUserSignup {
  fullName: string;
  username: string;
  email: string;
  phone: string;
  password: string;
}

// user login interface
export interface IUserLogin {
  email: string;
  password: string;
}

// user schema methods
export interface IUserModel extends Model<IUser> {
  isEntityExistsById(userId: string, select?: string): Promise<IUser | null>;
  isEntityExistsByEmail(email: string, select?: string): Promise<IUser | null>;
}

export interface IUserDocument extends IUser, Document {}
