// src/controllers/ticket/ticket.controller.ts
// import { z } from "zod";
import httpStatus from "http-status";
import { isValidObjectId } from "mongoose";
import { Request, RequestHandler, Response } from "express";
import { Ticket } from "../../models";
import {
  ApiError,
  catchAsync,
  staticProps,
  sendResponse,
  paginate,
  parseQueryData,
} from "../../utils";
import {
  TicketAddDtoZodSchema,
  TicketAddManyDtoZodSchema,
  TicketResponseDto,
  TicketUpdateDtoZodSchema,
} from "../../dtos";
import { generateQRCode, validateZodSchema } from "../../services";
import { ITicketAdd, ITicketUpdate } from "../../interfaces";

// get all tickets with pagination
export const GetAllTickets: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { page, limit } = parseQueryData(req.query);

    const paginatedResult = await paginate(Ticket.find(), { page, limit });

    const ticketsFromDto = paginatedResult.data.map(
      (ticket) => new TicketResponseDto(ticket.toObject())
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.RETRIEVED,
      data: ticketsFromDto,
      meta: paginatedResult.meta,
    });
  }
);

// get one ticket
export const GetTicketById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ticketId } = req.params;

    // Validate ID format
    if (!isValidObjectId(ticketId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.INVALID_ID);
    }

    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }

    const ticketFromDto = new TicketResponseDto(ticket);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.RETRIEVED,
      data: ticketFromDto,
    });
  }
);

// create one ticket
export const AddOneTicket: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    // Parsing data
    const parsedData = req.body;

    const {
      shopId,
      productId,
      gameId,
      ticketNumber,
      gameType,
      price,
      sellingDate,
    } = parsedData as ITicketAdd;

    // validate data with zod schema
    validateZodSchema(TicketAddDtoZodSchema, parsedData);

    const constructedData = {
      shopId,
      productId,
      gameId,
      ticketNumber,
      gameType,
      price,
      sellingDate,
    };

    // Create new ticket
    const ticketData = await Ticket.create(constructedData);

    if (!ticketData) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }

    const ticketFromDto = new TicketResponseDto(ticketData);

    //create a qr code and attach it to the ticket data
    const qrCode = await generateQRCode(ticketFromDto._id);
    const updatedData = {
      ...ticketFromDto,
      qrCode,
    };

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      message: staticProps.common.CREATED,
      data: updatedData,
    });
  }
);

// create many tickets
export const AddManyTickets: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    // Parse request data
    const parsedData = req.body;

    // Ensure the data is an array
    if (!Array.isArray(parsedData)) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        staticProps.common.INVALID_DATA
      );
    }

    // validate data with zod schema
    validateZodSchema(TicketAddManyDtoZodSchema, parsedData);

    // Insert tickets into the database
    const insertedTickets = await Ticket.insertMany(parsedData, {
      ordered: true, // Ensures insertion stops on first error
    });

    if (!insertedTickets || insertedTickets.length === 0) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        staticProps.common.FAILED_TO_CREATE
      );
    }

    // Generate QR codes for each ticket and transform into response DTOs
    const ticketDtosWithQrCodes = await Promise.all(
      insertedTickets.map(async (ticket) => {
        const qrCode = await generateQRCode(ticket._id);
        const ticketDto = new TicketResponseDto(ticket);
        return {
          ...ticketDto,
          qrCode,
        };
      })
    );
    // Send response
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      message: staticProps.common.CREATED,
      data: ticketDtosWithQrCodes,
    });
  }
);

// update one ticket
export const UpdateTicketById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    // parsing data and params
    const { ticketId } = req.params;
    const parsedData = req.body;

    //get parsed data
    const {
      shopId,
      productId,
      gameId,
      ticketNumber,
      gameType,
      price,
      sellingDate,
    } = parsedData as ITicketUpdate;

    if (!isValidObjectId(ticketId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.INVALID_ID);
    }

    //validate data with zod schema
    validateZodSchema(TicketUpdateDtoZodSchema, parsedData);

    // Check if a ticket exists or not
    const existsTicket = await Ticket.findById(ticketId);
    if (!existsTicket)
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.NOT_FOUND);

    //construct data
    let constructedData = {
      shopId,
      productId,
      gameId,
      ticketNumber,
      gameType,
      price,
      sellingDate,
    };

    // updating role info
    const ticketData = await Ticket.findOneAndUpdate(
      { _id: ticketId },
      {
        $set: constructedData,
      },
      { new: true, runValidators: true }
    );

    //process the ticket data
    if (!ticketData) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }
    const ticketFromDto = new TicketResponseDto(ticketData);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.UPDATED,
      data: ticketFromDto,
    });
  }
);

// delete one ticket
export const DeleteTicketById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ticketId } = req.params;

    if (!ticketId)
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.INVALID_ID);

    const result = await Ticket.deleteOne({ _id: ticketId });

    if (result.deletedCount === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.DELETED,
    });
  }
);
