// src/services/validation/validation.service.ts
import { ZodSchema } from "zod";
import httpStatus from "http-status";
import { ApiError } from "../../utils";

export const validateZodSchema = <T>(
  schema: ZodSchema<T>,
  data: unknown
): void => {
  const result = schema.safeParse(data);

  if (result.success) return;

  // Collecting error messages from Zod validation
  const errorMessages = result.error.errors
    .map((err) => `${err.path.join(".")}: ${err.message}`)
    .join(", ");

  // Throwing a custom ApiError
  throw new ApiError(httpStatus.BAD_REQUEST, errorMessages);
};
