// src/controllers/store/store.controller.ts
import { isValidObjectId } from "mongoose";
import httpStatus from "http-status";
import { Request, RequestHandler, Response } from "express";
import { Store } from "../../models";
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
import { StoreResponseDto } from "../../dtos";

// get all stores
export const GetAllStores: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { page, limit } = parseQueryData(req.query);

    // Paginate the stores, excluding the password field in the query
    const paginatedResult = await paginate(
      Store.find(), // Exclude the 'password' field
      { page, limit }
    );

    const storesFromDto = paginatedResult.data.map(
      (store) => new StoreResponseDto(store.toObject())
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.RETRIEVED,
      data: storesFromDto,
      meta: paginatedResult.meta,
    });
  }
);

// get one store
export const GetStoreById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { storeId } = req.params;

    // Validate ID format
    if (!isValidObjectId(storeId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.INVALID_ID);
    }

    const store = await Store.findById(storeId).lean();

    if (!store) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }

    const storeFromDto = new StoreResponseDto(store);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.RETRIEVED,
      data: storeFromDto,
    });
  }
);

// update one store
export const UpdateStoreById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    // parsing data and params
    const { storeId } = req.params;
    const parsedData = req.body;
    const { single, document } = req.files as IMulterFiles;

    if (!isValidObjectId(storeId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.INVALID_ID);
    }

    // Check if a store exists or not
    const existsStore = await Store.findById(storeId).lean();
    if (!existsStore)
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.NOT_FOUND);

    // Get parsed data
    const { password, ...body } = parsedData;

    // Create updated data object conditionally based on the paths returned
    let constructedData: any = {
      ...body,
    };

    //hash password if password exists
    if (password) {
      const hashedPassword = await hashPassword(password);
      constructedData = { ...constructedData, password: hashedPassword };
    }

    // Upload files
    if (single || document) {
      const { filePath, documentPath } = await uploadFiles(single, document);
      constructedData = {
        ...constructedData,
        image: filePath,
        document: documentPath,
      };
    }

    // Updating role info
    const data = await Store.findOneAndUpdate(
      { _id: storeId },
      {
        $set: constructedData,
      },
      { new: true, runValidators: true }
    );

    // Process the data
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }

    const storeFromDto = new StoreResponseDto(data);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.UPDATED,
      data: storeFromDto,
    });
  }
);

// delete one store
export const DeleteStoreById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { storeId } = req.params;

    if (!isValidObjectId(storeId))
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.INVALID_ID);

    const result = await Store.deleteOne({ _id: storeId });

    if (result.deletedCount === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.DELETED,
    });
  }
);
