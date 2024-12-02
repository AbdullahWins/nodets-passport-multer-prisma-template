import { PrismaClient } from "@prisma/client";
import { IAdminLogin, IAdminSignup, IAdminUpdate } from "../../interfaces";
import {
  ApiError,
  generateJwtToken,
  hashPassword,
  sendEmail,
  uploadFiles,
  validateZodSchema,
} from "../../utilities";
import { AdminResponseDto } from "../../dtos";
import { AdminSignupDtoZodSchema } from "../../validators";
import {
  createAdminRepo,
  getAdminByIdRepo,
  getAllAdminsRepo,
  updateAdminByIdRepo,
  deleteAdminByIdRepo,
} from "../../repositories";
import httpStatus from "http-status";
import { emailProps, staticProps } from "../../constants";

const prisma = new PrismaClient();

// Admin Login Service
export const SignInAdminService = async (loginData: IAdminLogin) => {
  const admin = await prisma.admin.findUnique({
    where: { email: loginData.email },
  });

  if (!admin) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      staticProps.common.INVALID_CREDENTIALS
    );
  }

  const token = generateJwtToken(admin);
  return { accessToken: token, admin: new AdminResponseDto(admin) };
};

// Admin SignUp Service
export const SignUpAdminService = async (
  signupData: IAdminSignup,
  files?: any
) => {
  // Validate schema
  validateZodSchema(AdminSignupDtoZodSchema, signupData);

  // Check if admin already exists
  const existingAdmin = await prisma.admin.findUnique({
    where: { email: signupData.email },
  });
  if (existingAdmin) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      staticProps.common.ALREADY_EXISTS
    );
  }

  // Hash password
  const hashedPassword = await hashPassword(signupData.password);

  // Handle file upload (profile image)
  let imagePath = staticProps.default.DEFAULT_IMAGE_PATH;
  if (files && files.single) {
    const { filePath } = await uploadFiles(files.single);
    imagePath = filePath || imagePath;
  }

  // Create admin
  const createdAdmin = await createAdminRepo({
    ...signupData,
    password: hashedPassword,
    image: imagePath,
  });

  // Send welcome email
  sendEmail({
    email: signupData.email,
    subject: emailProps.subject.WELCOME_ADMIN,
    template: emailProps.template.WELCOME_ADMIN,
    data: { name: signupData.fullName },
  });

  const adminDto = new AdminResponseDto(createdAdmin);
  const token = generateJwtToken({
    id: createdAdmin.id,
    email: createdAdmin.email,
    role: createdAdmin.role,
  });

  return { accessToken: token, admin: adminDto };
};

// Get All Admins Service
export const GetAllAdminsService = async (page: number, limit: number) => {
  const { data, meta } = await getAllAdminsRepo(page, limit);
  return { data: data.map((admin) => new AdminResponseDto(admin)), meta };
};

// Get Admin by ID Service
export const GetAdminByIdService = async (adminId: number) => {
  const admin = await getAdminByIdRepo(adminId);
  if (!admin) {
    throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
  }
  return new AdminResponseDto(admin);
};

// Update Admin by ID Service
export const UpdateAdminByIdService = async (
  adminId: number,
  data: IAdminUpdate,
  files?: any
) => {
  if (data.password) {
    data.password = await hashPassword(data.password);
  }

  // Handle file upload (profile image)
  if (files && files.single) {
    const { filePath } = await uploadFiles(files.single);
    if (filePath) {
      data.image = filePath;
    }
  }

  const updatedAdmin = await updateAdminByIdRepo(adminId, data);
  return new AdminResponseDto(updatedAdmin);
};

// Delete Admin by ID Service
export const DeleteAdminByIdService = async (adminId: number) => {
  await deleteAdminByIdRepo(adminId);
};
