import httpStatus from "http-status";
import { Request, RequestHandler, Response } from "express";
import {
  ApiError,
  catchAsync,
  parseQueryData,
  sendResponse,
  staticProps,
} from "../../utils";
import {
  getAllAdmins,
  getAdminById,
  createAdmin,
  updateAdminById,
  deleteAdminById,
  validateZodSchema,
} from "../../services";
import { AdminUpdateDtoZodSchema } from "../../validators";
import { AdminResponseDto } from "../../dtos";

// Get all admins with pagination
export const GetAllAdmins: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { page, limit } = parseQueryData(req.query);
  try {
    const admins = await getAllAdmins(page, limit);

    const adminsFromDto = admins.data.map(
      (admin) => new AdminResponseDto(admin)
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "Admins retrieved successfully",
      data: adminsFromDto,
      meta: admins.meta,
    });
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Error retrieving admins"
    );
  }
};

// Get one admin by ID
export const GetAdminById: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { adminId } = req.params;
  try {
    const admin = await getAdminById(Number(adminId));
    if (!admin) {
      throw new ApiError(httpStatus.NOT_FOUND, "Admin not found");
    }

    const adminFromDto = new AdminResponseDto(admin);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "Admin retrieved successfully",
      data: adminFromDto,
    });
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Error retrieving admin"
    );
  }
};

// Create a new admin
export const CreateAdmin: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const data = req.body;
  try {
    const admin = await createAdmin(data);

    const adminFromDto = new AdminResponseDto(admin);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      message: "Admin created successfully",
      data: adminFromDto,
    });
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Error creating admin"
    );
  }
};

// Update one admin by ID
export const UpdateAdminById: RequestHandler = catchAsync(async (req, res) => {
  const { adminId } = req.params;
  const parsedData = req.body;
  const { single } = req.files as { single?: Express.Multer.File[] }; // Handling file upload

  // Validate incoming data
  validateZodSchema(AdminUpdateDtoZodSchema, parsedData);

  // Extract password and other fields
  const { password, ...body } = parsedData;

  // Call service to update the admin
  try {
    const updatedAdmin = await updateAdminById(
      Number(adminId),
      body,
      password,
      single
    );

    // Process the data
    const adminFromDto = new AdminResponseDto(updatedAdmin);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.UPDATED,
      data: adminFromDto,
    });
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Error updating admin"
    );
  }
});

// Delete one admin by ID
export const DeleteAdminById: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { adminId } = req.params;
  try {
    await deleteAdminById(Number(adminId));
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "Admin deleted successfully",
    });
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Error deleting admin"
    );
  }
};
