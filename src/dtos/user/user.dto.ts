// src/dtos/user/user.dto.ts
import { Types } from "mongoose";
import { IUser } from "../../interfaces";
import { getFileUrl } from "../../utils";

// Base User DTO
class UserDtoBase implements Partial<IUser> {
  _id: Types.ObjectId;
  email: string;
  fullName: string;
  image: string;

  constructor(user: Pick<IUser, "_id" | "email" | "fullName" | "image">) {
    this._id = user._id!;
    this.email = user.email;
    this.fullName = user.fullName;
    this.image = getFileUrl(user.image);
  }
}

// DTO for user login response (id, email, fullName and image only)
export class UserLoginDto extends UserDtoBase {
  constructor(user: IUser) {
    super(user);
  }
}

// Full User DTO for regular responses
export class UserResponseDto extends UserDtoBase {
  username: string;
  phone: string;
  isEmailVerified: boolean;

  constructor(user: IUser) {
    super(user);
    this.username = user.username;
    this.phone = user.phone;
    this.isEmailVerified = user.isEmailVerified;
  }
}
