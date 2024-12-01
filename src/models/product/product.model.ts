// src/models/product/product.model.ts
import moment from "moment";
import { Schema, model } from "mongoose";
import { IProduct, IProductDocument, IProductModel } from "../../interfaces";

const ProductSchema = new Schema<IProductDocument>({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  image: {
    type: String,
    required: [true, "Image is required."],
  },
  game: {
    type: Schema.Types.ObjectId,
    ref: "Game",
    required: [true, "Game is required"],
  },
  createdAt: {
    type: Number,
    default: () => moment().utc().unix(),
  },
  updatedAt: {
    type: Number,
    default: () => moment().utc().unix(),
  },
});

// checking is product found with the id
ProductSchema.statics.isProductExistsById = async function (
  productId: string,
  select: string
): Promise<IProduct | null> {
  const product = await this.findById(productId).select(select).lean();
  return product;
};

// checking is product found with the email
ProductSchema.statics.isProductExistsByName = async function (
  name: string,
  select: string
): Promise<IProduct | null> {
  const product = await this.findOne({ name }).select(select).lean();
  return product;
};

const Product = model<IProductDocument, IProductModel>(
  "Product",
  ProductSchema
);
export default Product;
