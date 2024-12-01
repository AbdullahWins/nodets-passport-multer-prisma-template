// src/dtos/ticket/ticket.zod.ts
import { z } from "zod";

const TicketDtoZodSchema = z.object({
  shopId: z.string().min(1),
  productId: z.string().min(1),
  gameId: z.string().min(1),
  ticketNumber: z.string().min(1),
  gameType: z.enum(["straight", "chance", "random"], {
    errorMap: () => ({
      message:
        "Game type is required and must be one of: straight, chance, random",
    }),
  }),
  price: z.number().min(0),
  sellingDate: z.date().optional(),
});

// Extended Store DTO schema for adding a ticket
export const TicketAddDtoZodSchema = TicketDtoZodSchema.pick({
  shopId: true,
  productId: true,
  gameId: true,
  ticketNumber: true,
  gameType: true,
  price: true,
});

// Extended Store DTO schema for updating a ticket
export const TicketUpdateDtoZodSchema = TicketDtoZodSchema.partial();

// Schema for validating multiple tickets
export const TicketAddManyDtoZodSchema = z
  .array(TicketAddDtoZodSchema)
  .nonempty({
    message: "At least one ticket must be provided",
  });
