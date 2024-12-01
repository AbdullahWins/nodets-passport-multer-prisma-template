// src/models/game/game.model.ts
import { Schema, model } from "mongoose";
import moment from "moment";
import { IGame, IPrize, IGameDocument, IGameModel } from "../../interfaces";
import { ApiError } from "../../utils";

// Prize schema for embedded array of prizes
const PrizeSchema = new Schema<IPrize>({
  match: {
    type: Number,
    required: true,
    default: 0,
  },
  amount: {
    type: Number,
    required: true,
    default: 0,
  },
});

const GameSchema = new Schema<IGameDocument>({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  totalNumbers: {
    type: Number,
    unique: true,
    required: [true, "TotalNumbers is required."],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    default: 0,
  },
  prize: {
    type: [PrizeSchema],
    required: [true, "Prize is required"],
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

//validate totalNumbers is equal to prize length on save
GameSchema.pre<IGameDocument>("save", function (next) {
  if (this.totalNumbers !== this.prize.length) {
    next(new ApiError(400, "TotalNumbers should be equal to prize length"));
  }
  next();
});

// update updatedAt on every update
GameSchema.pre<IGameDocument>("updateOne", function (next) {
  this.updatedAt = moment().utc().unix();
  next();
});

// checking is game found with the id
GameSchema.statics.isGameExistsById = async function (
  gameId: string,
  select: string
): Promise<IGame | null> {
  const game = await this.findById(gameId).select(select).lean();
  return game;
};

// checking is game found with the email
GameSchema.statics.isGameExistsByEmail = async function (
  email: string,
  select: string
): Promise<IGame | null> {
  const game = await this.findOne({ email }).select(select).lean();
  return game;
};

const Game = model<IGameDocument, IGameModel>("Game", GameSchema);
export default Game;
