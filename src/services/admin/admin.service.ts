import httpStatus from "http-status";
import {
  IAdminLogin,
  IAdminSignup,
  IAdminUpdate,
  IMetaData,
} from "../../interfaces";
import {
  ApiError,
  generateJwtToken,
  hashPassword,
  removeFile,
  sendEmail,
  sendNotification,
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
import { emailProps, staticProps } from "../../constants";
import { redisUtility } from "../../utilities";
import { prisma } from "../../configs";

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

  //send notification
  const data = {
    recipients: [admin.id.toString(), "66"],
    message: "You have successfully logged in",
  };

  sendNotification(data);

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
  const cacheKey = `admins:${page}:${limit}`;

  // Check Redis Cache
  const cachedAdmins = await redisUtility.get<{
    data: AdminResponseDto[];
    meta: IMetaData;
  }>(cacheKey);
  if (cachedAdmins) {
    return cachedAdmins;
  }

  // Get Admins from DB
  const { data, meta } = await getAllAdminsRepo(page, limit);

  // Map the data to AdminResponseDto and return with meta
  const admins = data.map((admin) => new AdminResponseDto(admin));
  const processedData = { data: admins, meta };

  // Cache the result without an extra "data" wrapper
  await redisUtility.set(cacheKey, processedData);
  return processedData;
};

// Get Admin by ID Service
export const GetAdminByIdService = async (adminId: number) => {
  const cacheKey = `admin:${adminId}`;

  // Check Redis Cache
  const cachedAdmin = await redisUtility.get<AdminResponseDto>(cacheKey);
  if (cachedAdmin) {
    return cachedAdmin;
  }
  // Get Admin from DB
  const admin = await getAdminByIdRepo(adminId);
  if (!admin) {
    throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
  }
  // Cache the result
  await redisUtility.set(cacheKey, new AdminResponseDto(admin));
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
    //delete the previous image if it's not the default image
    const admin = await getAdminByIdRepo(adminId);
    if (!admin) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }
    if (admin.image !== staticProps.default.DEFAULT_IMAGE_PATH) {
      //delete the previous image where possible
      removeFile(admin.image);
    }
  }

  const updatedAdmin = await updateAdminByIdRepo(adminId, data);
  return new AdminResponseDto(updatedAdmin);
};

// Delete Admin by ID Service
export const DeleteAdminByIdService = async (adminId: number) => {
  await deleteAdminByIdRepo(adminId);
};
