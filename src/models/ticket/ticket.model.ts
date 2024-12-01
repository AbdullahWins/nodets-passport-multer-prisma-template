// src/models/ticket/ticket.model.ts
import mongoose, { Schema, model } from "mongoose";
import moment from "moment";
import { ITicket, ITicketDocument, ITicketModel } from "../../interfaces";
import { ENUM_GAME_TYPES } from "../../utils";

const TicketSchema = new Schema<ITicketDocument>({
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
    required: [true, "ShopId is required"],
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "ProductId is required"],
  },
  gameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Game",
    required: [true, "GameId is required"],
  },
  ticketNumber: {
    type: String,
    required: [true, "Ticket number is required"],
  },
  gameType: {
    type: String,
    enum: ENUM_GAME_TYPES,
    required: [
      true,
      "Game type is required and only can be one of these values: straight, chance, random",
    ],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    default: 0,
  },
  //only the date, not time (to sort the tickets by sold date)
  sellingDate: {
    type: String,
    required: [true, "Selling date is required"],
    // Ensure date is in UTC to avoid time zone issues
    default: () => moment().utc().format("YYYY-MM-DD"),
  },
  createdAt: {
    type: Number,
    default: () => moment().utc().unix(),
  },
  updatedAt: {
    type: Number,
    default: () => moment().utc().unix(),
  },
});

// update updatedAt on every update
TicketSchema.pre<ITicketDocument>("updateOne", function (next) {
  this.updatedAt = moment().utc().unix();
  next();
});

// checking is ticket found with the id
TicketSchema.statics.isTicketExistsById = async function (
  ticketId: string,
  select: string
): Promise<ITicket | null> {
  const ticket = await this.findById(ticketId).select(select).lean();
  return ticket;
};

// checking is ticket found with the email
TicketSchema.statics.isTicketExistsByEmail = async function (
  email: string,
  select: string
): Promise<ITicket | null> {
  const ticket = await this.findOne({ email }).select(select).lean();
  return ticket;
};

const Ticket = model<ITicketDocument, ITicketModel>("Ticket", TicketSchema);

export default Ticket;
