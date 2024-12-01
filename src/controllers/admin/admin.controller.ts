// src/controllers/admin/admin.controller.ts
import httpStatus from "http-status";
import { Request, RequestHandler, Response } from "express";
import { isValidObjectId } from "mongoose";
import { Admin } from "../../models";
import { hashPassword, uploadFiles, validateZodSchema } from "../../services";
import {
  ApiError,
  catchAsync,
  staticProps,
  sendResponse,
  parseQueryData,
  paginate,
} from "../../utils";
import { IAdmin, IMulterFiles } from "../../interfaces";
import { AdminResponseDto, AdminUpdateDtoZodSchema } from "../../dtos";

// get all admins with pagination
export const GetAllAdmins: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { page, limit } = parseQueryData(req.query);

    const paginatedResult = await paginate(Admin.find(), {
      page,
      limit,
    });

    if (paginatedResult.data.length === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }

    const adminsFromDto = paginatedResult.data.map(
      (admin) => new AdminResponseDto(admin.toObject())
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.RETRIEVED,
      data: adminsFromDto,
      meta: paginatedResult.meta,
    });
  }
);

// get one admin
export const GetAdminById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { adminId } = req.params;

    // Validate ID format
    if (!isValidObjectId(adminId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.INVALID_ID);
    }
    // check if admin exists
    const admin = await Admin.findById(adminId).lean<IAdmin>();
    if (!admin) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }

    const adminFromDto = new AdminResponseDto(admin);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.RETRIEVED,
      data: adminFromDto,
    });
  }
);

// update one admin
export const UpdateAdminById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    // parsing data and params
    const { adminId } = req.params;
    const parsedData = req.body;
    const { single } = req.files as IMulterFiles;

    validateZodSchema(AdminUpdateDtoZodSchema, parsedData);

    //get parsed data
    const { password, ...body } = parsedData;

    // Check if a admin exists or not
    const existsAdmin = await Admin.findById(adminId);
    if (!existsAdmin)
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.NOT_FOUND);

    // Create updated data object conditionally based on the paths returned
    let constructedData: any = {
      ...body,
    };

    if (password) {
      const hashedPassword = await hashPassword(password);
      constructedData = {
        ...constructedData,
        password: hashedPassword,
      };
    }

    // Upload files
    if (single) {
      const { filePath } = await uploadFiles(single);
      constructedData = {
        ...constructedData,
        image: filePath || staticProps.default.DEFAULT_IMAGE_PATH,
      };
    }

    // updating role info
    const data = await Admin.findOneAndUpdate(
      { _id: adminId },
      {
        $set: constructedData,
      },
      { new: true, runValidators: true }
    );

    //process data
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }

    const adminFromDto = new AdminResponseDto(data);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.UPDATED,
      data: adminFromDto,
    });
  }
);

// delete one admin
export const DeleteAdminById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { adminId } = req.params;

    if (!isValidObjectId(adminId)) {
      // Ensure the statusCode is set when throwing ApiError for invalid ID
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.INVALID_ID);
    }

    const result = await Admin.deleteOne({ _id: adminId });

    if (result.deletedCount === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.DELETED,
    });
  }
);
