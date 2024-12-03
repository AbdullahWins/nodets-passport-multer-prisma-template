import { Request, Response, NextFunction, RequestHandler } from "express";
import httpStatus from "http-status";
import { parseQueryData, sendResponse } from "../../utilities";
import {
  DeleteAdminByIdService,
  GetAdminByIdService,
  GetAllAdminsService,
  SignInAdminService,
  SignUpAdminService,
  UpdateAdminByIdService,
} from "../../services";
import { staticProps } from "../../constants";
import { catchAsync } from "../../middlewares";

// Admin Login
export const SignInAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await SignInAdminService(req.body);
      sendResponse(res, {
        statusCode: httpStatus.OK,
        message: staticProps.common.LOGGED_IN,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Admin SignUp
export const SignUpAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await SignUpAdminService(req.body, req.files);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.CREATED,
      data: result,
    });
  }
);

// Get All Admins with Pagination
export const GetAllAdmins: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { page, limit } = parseQueryData(req.query);
    const result = await GetAllAdminsService(page, limit);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.RETRIEVED,
      data: result.data,
      meta: result.meta,
    });
  }
);

// Get Admin by ID
export const GetAdminById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const adminId = Number(req.params.adminId);
    const result = await GetAdminByIdService(adminId);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.RETRIEVED,
      data: result,
    });
  }
);

// Update Admin by ID
export const UpdateAdminById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const adminId = Number(req.params.adminId);
    const result = await UpdateAdminByIdService(adminId, req.body, req.files);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.UPDATED,
      data: result,
    });
  }
);

// Delete Admin by ID
export const DeleteAdminById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const adminId = Number(req.params.adminId);
    await DeleteAdminByIdService(adminId);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.DELETED,
    });
  }
);
