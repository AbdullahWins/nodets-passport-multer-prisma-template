// src/interfaces/ticket/ticket.interface.ts
import { Model, Types } from "mongoose";
import { ICommonSchema } from "../common/common.interface";
import { ENUM_GAME_TYPES } from "../../utils";

// ticket interface
export interface ITicket extends ICommonSchema {
  shopId: Types.ObjectId;
  productId: Types.ObjectId;
  gameId: Types.ObjectId;
  ticketNumber: string; // Lowercase string for the ticket number
  gameType: ENUM_GAME_TYPES; // Enum for game type
  price: number;
  sellingDate: string; // Date as string in "YYYY-MM-DD" format
}

// ticket add interface
export interface ITicketAdd {
  shopId: string;
  productId: string;
  gameId: string;
  ticketNumber: string;
  gameType: ENUM_GAME_TYPES;
  price: number;
  sellingDate: string;
}

// ticket update interface
export interface ITicketUpdate {
  shopId?: string;
  productId?: string;
  gameId?: string;
  ticketNumber?: string;
  gameType?: ENUM_GAME_TYPES;
  price?: number;
  sellingDate?: string;
}

// ticket schema methods
export interface ITicketModel extends Model<ITicket> {
  isTicketExistsById(
    ticketId: string,
    select?: string
  ): Promise<ITicket | null>;
}

export interface ITicketDocument extends ITicket, Document {}
