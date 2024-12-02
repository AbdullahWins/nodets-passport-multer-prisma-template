import { PrismaClient, Admin } from "@prisma/client";
import { IAdmin } from "../../interfaces";
import { ApiError } from "../../utils";
import httpStatus from "http-status";
import { uploadFiles } from "../file/file.service";
import { hashPassword } from "../bcrypt/bcrypt.service";

const prisma = new PrismaClient();

// Get all admins with pagination
export const getAllAdmins = async (page: number, limit: number) => {
  try {
    const admins = await prisma.admin.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalAdmins = await prisma.admin.count();

    return {
      data: admins,
      meta: { totalAdmins, page, limit },
    };
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Error fetching admins"
    );
  }
};

// Get one admin by ID
export const getAdminById = async (adminId: number): Promise<Admin | null> => {
  try {
    return await prisma.admin.findUnique({
      where: { id: adminId },
    });
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Error fetching admin"
    );
  }
};

// Check if an admin exists by email
export const isEntityExistsByEmail = async (
  email: string
): Promise<IAdmin | null> => {
  try {
    return await prisma.admin.findUnique({
      where: { email },
    });
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Error checking admin by email"
    );
  }
};

// Update one admin by ID
export const updateAdminById = async (
  adminId: number,
  data: IAdmin,
  password?: string,
  files?: Express.Multer.File[]
) => {
  try {
    // Check if the admin exists
    const existsAdmin = await prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!existsAdmin) {
      throw new ApiError(httpStatus.NOT_FOUND, "Admin not found");
    }

    let updatedData: IAdmin = { ...data };

    // Hash password if provided
    if (password) {
      updatedData.password = await hashPassword(password);
    }

    // Handle file upload if any
    if (files && files.length > 0) {
      const { filePath } = await uploadFiles(files);
      updatedData.image = filePath || existsAdmin.image; // Use existing image if no new upload
    }

    // Update admin in the database
    const updatedAdmin = await prisma.admin.update({
      where: { id: adminId },
      data: updatedData,
    });

    return updatedAdmin;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Error updating admin"
    );
  }
};

// Delete one admin by ID
export const deleteAdminById = async (adminId: number): Promise<Admin> => {
  try {
    return await prisma.admin.delete({
      where: { id: adminId },
    });
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Error deleting admin"
    );
  }
};

// Create a new admin
export const createAdmin = async (data: IAdmin): Promise<Admin> => {
  try {
    return await prisma.admin.create({
      data,
    });
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Error creating admin"
    );
  }
};
