// src/interfaces/store/store.interface.ts
import { Model } from "mongoose";
import { ICommonEntitySchema } from "../common/common.interface";

// store interface
export interface IStore extends ICommonEntitySchema {
  name: string;
  address: string;
  document?: string;
}

// store add interface
export interface IStoreAdd {
  name: string;
  address: string;
  email: string;
  phone: string;
  password: string;
  image?: string;
  document?: string;
  role?: string;
}

// store signup interface
export interface IStoreSignup extends IStoreAdd {}

// store login interface
export interface IStoreLogin {
  email: string;
  password: string;
}

// store update interface
export interface IStoreUpdate extends Partial<IStore> {}

// store schema methods
export interface IStoreModel extends Model<IStore> {
  isEntityExistsById(storeId: string, select?: string): Promise<IStore | null>;
  isEntityExistsByEmail(email: string, select?: string): Promise<IStore | null>;
}

export interface IStoreDocument extends IStore, Document {}
