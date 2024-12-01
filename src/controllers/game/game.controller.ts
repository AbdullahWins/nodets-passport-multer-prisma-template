// src/controllers/game/game.controller.ts
import httpStatus from "http-status";
import { isValidObjectId } from "mongoose";
import { Request, RequestHandler, Response } from "express";
import { Game } from "../../models";
import {
  ApiError,
  catchAsync,
  staticProps,
  sendResponse,
  paginate,
  parseQueryData,
} from "../../utils";
import {
  GameResponseDto,
  GameAddDtoZodSchema,
  GameUpdateDtoZodSchema,
} from "../../dtos";
import { validateZodSchema } from "../../services";
import { IGameAdd, IGameUpdate } from "../../interfaces";

// get all games with pagination
export const GetAllGames: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { page, limit } = parseQueryData(req.query);

    const paginatedResult = await paginate(Game.find(), { page, limit });

    const gamesFromDto = paginatedResult.data.map(
      (game) => new GameResponseDto(game.toObject())
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.RETRIEVED,
      data: gamesFromDto,
      meta: paginatedResult.meta,
    });
  }
);

// get one game
export const GetGameById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { gameId } = req.params;

    // Validate ID format
    if (!isValidObjectId(gameId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.INVALID_ID);
    }

    const game = await Game.findById(gameId);

    if (!game) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }

    const gameFromDto = new GameResponseDto(game);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.RETRIEVED,
      data: gameFromDto,
    });
  }
);

// create one game
export const AddOneGame: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    // Parsing data
    const parsedData = req.body;

    // validate data with zod schema
    validateZodSchema(GameAddDtoZodSchema, parsedData);

    const { name, totalNumbers, price, prize } = parsedData as IGameAdd;

    const constructedData = {
      name,
      totalNumbers,
      price,
      prize,
    };

    // Create new game
    const gameData = await Game.create(constructedData);

    if (!gameData) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }

    const gameFromDto = new GameResponseDto(gameData);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      message: staticProps.common.CREATED,
      data: gameFromDto,
    });
  }
);

// update one game
export const UpdateGameById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    // parsing data and params
    const { gameId } = req.params;
    const parsedData = req.body;

    //get parsed data
    const { name, totalNumbers, price, prize } = parsedData as IGameUpdate;

    if (!isValidObjectId(gameId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.INVALID_ID);
    }

    validateZodSchema(GameUpdateDtoZodSchema, parsedData);

    // Check if a game exists or not
    const existsGame = await Game.findById(gameId);
    if (!existsGame)
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);

    //construct data
    let constructedData = {
      name,
      totalNumbers,
      price,
      prize,
    };

    // updating role info
    const gameData = await Game.findOneAndUpdate(
      { _id: gameId },
      {
        $set: constructedData,
      },
      { new: true, runValidators: true }
    );

    //process the game data
    if (!gameData) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }
    const gameFromDto = new GameResponseDto(gameData);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.UPDATED,
      data: gameFromDto,
    });
  }
);

// delete one game
export const DeleteGameById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { gameId } = req.params;

    if (!isValidObjectId(gameId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.INVALID_ID);
    }

    const result = await Game.deleteOne({ _id: gameId });

    if (result.deletedCount === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.DELETED,
    });
  }
);
