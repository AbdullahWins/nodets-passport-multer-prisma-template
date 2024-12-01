import { Schema, model } from "mongoose";
import { IUserDocument, IUserModel } from "../../interfaces";
import { CommonEntitySchema } from "../common/common.schema";
import { ENUM_USER_ROLES } from "../../utils";

const UserSchema = new Schema<IUserDocument>({
  fullName: {
    type: String,
    required: [true, "Full name is required"],
  },
  username: {
    type: String,
    required: [true, "Username is required and must be unique."],
    unique: true,
  },
  phone: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: [true, "Image is required"],
    default: "/public/default/default.png",
  },
  role: {
    type: String,
    enum: ENUM_USER_ROLES,
    default: ENUM_USER_ROLES.NORMAL_USER,
  },
});

// Extend the common schema
UserSchema.add(CommonEntitySchema);

const User = model<IUserDocument, IUserModel>("User", UserSchema);
export default User;
