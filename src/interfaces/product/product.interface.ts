// src/interfaces/product/product.interface.ts
import { Model, Schema } from "mongoose";
import { ICommonSchema } from "../common/common.interface";

// product interface
export interface IProduct extends ICommonSchema {
  name: string;
  image: string;
  game: Schema.Types.ObjectId;
}

// product add interface
export interface IProductAdd {
  name: string;
  image: string;
  game: string;
}

// product update interface
export interface IProductUpdate {
  name?: string;
  image?: string;
  game?: string;
}

// product schema methods
export interface IProductModel extends Model<IProduct> {
  isProductExistsById(
    productId?: string,
    name?: string,
    select?: string
  ): Promise<IProduct | null>;
}

export interface IProductDocument extends IProduct, Document {}
