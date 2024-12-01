// src/controllers/user/user.controller.ts
import httpStatus from "http-status";
import { isValidObjectId } from "mongoose";
import { Request, RequestHandler, Response } from "express";
import { User } from "../../models";
import { hashPassword, uploadFiles } from "../../services";
import {
  ApiError,
  catchAsync,
  staticProps,
  sendResponse,
  parseQueryData,
  paginate,
} from "../../utils";
import { IMulterFiles } from "../../interfaces";
import { UserResponseDto } from "../../dtos";

// get all users
export const GetAllUsers: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { page, limit } = parseQueryData(req.query);

    const paginatedResult = await paginate(User.find(), { page, limit });

    const usersFromDto = paginatedResult.data.map(
      (user) => new UserResponseDto(user.toObject())
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.RETRIEVED,
      data: usersFromDto,
      meta: paginatedResult.meta,
    });
  }
);

// get one user
export const GetUserById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { userId } = req.params;

    // Validate ID format
    if (!isValidObjectId(userId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.INVALID_ID);
    }

    const user = await User.findById(userId).lean();

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }

    const userFromDto = new UserResponseDto(user);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.RETRIEVED,
      data: userFromDto,
    });
  }
);

// update one user
export const UpdateUserById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    // parsing data and params
    const { userId } = req.params;
    const parsedData = req.body;
    const { single } = req.files as IMulterFiles;

    if (!userId || !parsedData)
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        staticProps.common.MISSING_REQUIRED_FIELDS
      );

    //get parsed data
    const { password, ...body } = parsedData;

    // Check if a user exists or not
    const existsUser = await User.findById(userId);
    if (!existsUser)
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.NOT_FOUND);

    //construct data
    let constructedData = {
      ...body,
    };

    // hash password
    if (password) {
      const hashedPassword = await hashPassword(password);
      constructedData = {
        ...constructedData,
        password: hashedPassword,
      };
    }

    //upload file
    if (single) {
      const { filePath } = await uploadFiles(single);
      constructedData = {
        ...constructedData,
        image: filePath || staticProps.default.DEFAULT_IMAGE_PATH,
      };
    }

    // updating role info
    const data = await User.findOneAndUpdate(
      { _id: userId },
      {
        $set: constructedData,
      },
      { new: true, runValidators: true }
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.UPDATED,
      data,
    });
  }
);

// delete one user
export const DeleteUserById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.INVALID_ID);
    }

    const result = await User.deleteOne({ _id: userId });

    if (result.deletedCount === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.DELETED,
    });
  }
);
