import { PrismaClient, Admin } from "@prisma/client";
import { IAdminUpdate, IAdminSignup } from "../../interfaces";
import { ApiError } from "../../utilities";
import httpStatus from "http-status";
import { staticProps } from "../../constants";

const prisma = new PrismaClient();

// Get all admins with pagination
export const getAllAdminsRepo = async (page: number, limit: number) => {
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
      staticProps.common.INTERNAL_SERVER_ERROR
    );
  }
};

// Get admin by ID
export const getAdminByIdRepo = async (
  adminId: number
): Promise<Admin | null> => {
  try {
    return await prisma.admin.findUnique({
      where: { id: adminId },
    });
  } catch (error) {
    throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
  }
};

// Create admin
export const createAdminRepo = async (data: IAdminSignup): Promise<Admin> => {
  try {
    return await prisma.admin.create({
      data,
    });
  } catch (error) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      staticProps.common.ALREADY_EXISTS
    );
  }
};

// Update admin by ID
export const updateAdminByIdRepo = async (
  adminId: number,
  data: IAdminUpdate
): Promise<Admin> => {
  try {
    return await prisma.admin.update({
      where: { id: adminId },
      data,
    });
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.NOT_FOUND);
  }
};

// Delete admin by ID
export const deleteAdminByIdRepo = async (adminId: number): Promise<Admin> => {
  try {
    return await prisma.admin.delete({
      where: { id: adminId },
    });
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.NOT_FOUND);
  }
};
