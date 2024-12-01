// src/dtos/game/game.zod.ts
import { z } from "zod";

const GameDtoZodSchema = z.object({
  name: z.string().min(1),
  totalNumbers: z.number().min(1),
  price: z.number().min(0),
  prize: z.array(
    z.object({
      match: z.number().min(1),
      amount: z.number().min(0),
    })
  ),
});
// Extended Store DTO schema for full store details
export const GameAddDtoZodSchema = GameDtoZodSchema.pick({
  name: true,
  totalNumbers: true,
  price: true,
  prize: true,
});

export const GameUpdateDtoZodSchema = GameDtoZodSchema.partial();
