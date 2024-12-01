import { Schema, model } from "mongoose";
import { IAdminDocument, IAdminModel } from "../../interfaces";
import { CommonEntitySchema } from "../common/common.schema";
import { ENUM_ADMIN_ROLES } from "../../utils";

const AdminSchema = new Schema({
  fullName: {
    type: String,
    required: [true, "Full name is required"],
  },
  image: {
    type: String,
    required: [true, "Image is required"],
    default: "/public/default/default.png",
  },
  role: {
    type: String,
    enum: ENUM_ADMIN_ROLES,
    default: ENUM_ADMIN_ROLES.NORMAL_ADMIN,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
});

// Extend the common schema
AdminSchema.add(CommonEntitySchema);

const Admin = model<IAdminDocument, IAdminModel>("Admin", AdminSchema);
export default Admin;
