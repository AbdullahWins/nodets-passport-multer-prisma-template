// src/controllers/product/product.controller.ts
import httpStatus from "http-status";
import { isValidObjectId } from "mongoose";
import { Request, RequestHandler, Response } from "express";
import { Product } from "../../models";
import {
  catchAsync,
  staticProps,
  sendResponse,
  ApiError,
  parseQueryData,
  paginate,
} from "../../utils";
import {
  ProductAddDtoZodSchema,
  ProductResponseDto,
  ProductUpdateDtoZodSchema,
} from "../../dtos";
import { validateZodSchema } from "../../services";
import { IProductAdd, IProductUpdate } from "../../interfaces";

// get all products with pagination
export const GetAllProducts: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { page, limit } = parseQueryData(req.query);

    const paginatedResult = await paginate(Product.find(), { page, limit });

    const productsFromDto = paginatedResult.data.map(
      (product) => new ProductResponseDto(product.toObject())
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.RETRIEVED,
      data: productsFromDto,
      meta: paginatedResult.meta,
    });
  }
);

// get one product
export const GetProductById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { productId } = req.params;

    // Validate ID format
    if (!isValidObjectId(productId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.INVALID_ID);
    }

    const product = await Product.findById(productId);

    if (!product) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }

    const productFromDto = new ProductResponseDto(product);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.RETRIEVED,
      data: productFromDto,
    });
  }
);

// create one product
export const AddOneProduct: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    // Parsing data
    const parsedData = req.body;
    const { name, image, game } = parsedData as IProductAdd;

    // validate data with zod schema
    validateZodSchema(ProductAddDtoZodSchema, parsedData);

    const constructedData = {
      name,
      image,
      game,
    };

    // Create new product
    const productData = await Product.create(constructedData);

    if (!productData) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }

    const productFromDto = new ProductResponseDto(productData);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      message: staticProps.common.CREATED,
      data: productFromDto,
    });
  }
);

// update one product
export const UpdateProductById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    // parsing data and params
    const productId = req.params.productId;
    const parsedData = req.body;

    //get parsed data
    const { name, image, game } = parsedData as IProductUpdate;

    if (!isValidObjectId(productId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.INVALID_ID);
    }

    // validate data with zod schema
    validateZodSchema(ProductUpdateDtoZodSchema, parsedData);

    // Check if a product exists or not
    const existsProduct = await Product.findById(productId);
    if (!existsProduct) {
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.NOT_FOUND);
    }

    //construct data
    let constructedData = {
      name,
      image,
      game,
    };

    // updating role info
    const productData = await Product.findOneAndUpdate(
      { _id: productId },
      {
        $set: constructedData,
      },
      { new: true, runValidators: true }
    );

    //process the product data
    if (!productData) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }
    const productFromDto = new ProductResponseDto(productData);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.UPDATED,
      data: productFromDto,
    });
  }
);

// delete one product
export const DeleteProductById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const productId = req.params.productId;

    if (!isValidObjectId(productId))
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.INVALID_ID);

    const result = await Product.deleteOne({ _id: productId });

    if (result.deletedCount === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.DELETED,
    });
  }
);
