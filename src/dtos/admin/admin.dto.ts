// src/dtos/admin/admin.dto.ts
import { Types } from "mongoose";
import { IAdmin } from "../../interfaces";
import { getFileUrl } from "../../utils";

// Base Admin DTO with minimal properties
class AdminDtoBase implements Partial<IAdmin> {
  _id: Types.ObjectId;
  fullName: string;
  email: string;
  image: string;
  role: string;
  isEmailVerified: boolean;

  constructor(
    admin: Pick<
      IAdmin,
      "_id" | "fullName" | "email" | "image" | "role" | "isEmailVerified"
    >
  ) {
    this._id = admin._id!;
    this.fullName = admin.fullName;
    this.email = admin.email;
    this.image = getFileUrl(admin.image);
    this.role = admin.role;
    this.isEmailVerified = admin.isEmailVerified;
  }
}

// Extended Admin DTO with additional properties
export class AdminResponseDto extends AdminDtoBase {
  constructor(admin: IAdmin) {
    super(admin);
  }
}
