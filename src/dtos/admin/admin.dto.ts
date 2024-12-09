import { IAdmin } from "../../interfaces";
import { getFileUrl } from "../../utilities";

// Base Admin DTO with minimal properties for strict typing
class AdminDtoBase implements Partial<IAdmin> {
  id: number;
  fullName: string;
  email: string;
  image: string;
  role: string;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    admin: Pick<
      IAdmin,
      | "id"
      | "fullName"
      | "email"
      | "image"
      | "role"
      | "isEmailVerified"
      | "createdAt"
      | "updatedAt"
    >
  ) {
    this.id = admin.id;
    this.fullName = admin.fullName;
    this.email = admin.email;
    this.image = getFileUrl(admin.image); // Ensure to use the `getFileUrl` utility
    this.role = admin.role;
    this.isEmailVerified = admin.isEmailVerified || false;
    this.createdAt = admin.createdAt;
    this.updatedAt = admin.updatedAt;
  }
}

// Extended Admin DTO with additional properties for response shaping
export class AdminResponseDto extends AdminDtoBase {
  constructor(admin: IAdmin) {
    // Inherit the base properties and initialize the extended properties
    super(admin);
  }
}
