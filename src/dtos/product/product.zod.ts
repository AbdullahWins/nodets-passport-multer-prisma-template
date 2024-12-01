// src/dtos/product/product.zod.ts
import { z } from "zod";

const ProductDtoZodSchema = z.object({
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
export const ProductAddDtoZodSchema = ProductDtoZodSchema.pick({
  name: true,
  totalNumbers: true,
  price: true,
  prize: true,
});

// Extended Store DTO schema for partial store details
export const ProductUpdateDtoZodSchema = ProductDtoZodSchema.partial();
