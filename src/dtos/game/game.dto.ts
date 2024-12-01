// src/dtos/game/game.dto.ts
import { Types } from "mongoose";
import { IGame, IPrize } from "../../interfaces";

// Base Game DTO
export class GameDto implements Partial<IGame> {
  _id: Types.ObjectId;
  name: string;
  totalNumbers: number;
  price: number;
  prize: IPrize[];

  constructor(game: IGame) {
    this._id = game._id!;
    this.name = game.name;
    this.totalNumbers = game.totalNumbers;
    this.price = game.price;
    this.prize = game.prize;
  }
}

// DTO for game response after signup/signin
export class GameResponseDto extends GameDto {
  constructor(game: IGame) {
    super(game);
  }
}
