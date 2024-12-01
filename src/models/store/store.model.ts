import { Schema, model } from "mongoose";
import validator from "validator";
import { IStoreDocument, IStoreModel } from "../../interfaces";
import { CommonEntitySchema } from "../common/common.schema";
import { ENUM_STORE_ROLES } from "../../utils";

const StoreSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  address: {
    type: String,
    required: [true, "Address is required"],
  },
  phone: {
    type: String,
    required: [true, "Phone is required"],
    validate: [validator.isMobilePhone, "Please provide a valid phone number."],
  },
  image: {
    type: String,
    required: [true, "Image is required"],
    default: "/public/default/default.png",
  },
  document: {
    type: String,
    required: [true, "Document is required"],
    default: "/public/default/default.png",
  },
  role: {
    type: String,
    enum: ENUM_STORE_ROLES,
    default: ENUM_STORE_ROLES.STORE_ADMIN,
  },
});

// Extend the common schema
StoreSchema.add(CommonEntitySchema);

const Store = model<IStoreDocument, IStoreModel>("Store", StoreSchema);
export default Store;
