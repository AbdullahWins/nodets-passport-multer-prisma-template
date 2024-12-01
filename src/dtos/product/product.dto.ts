// src/dtos/product/product.dto.ts
import { Schema, Types } from "mongoose";
import { IProduct } from "../../interfaces";

// Base Product DTO
export class ProductDto implements Partial<IProduct> {
  _id: Types.ObjectId;
  name: string;
  image: string;
  game: Schema.Types.ObjectId;

  constructor(product: IProduct) {
    this._id = product._id!;
    this.name = product.name;
    this.image = product.image;
    this.game = product.game;
  }
}

// DTO for product response after signup/signin
export class ProductResponseDto extends ProductDto {
  constructor(product: IProduct) {
    super(product);
  }
}
