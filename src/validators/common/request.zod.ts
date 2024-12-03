import { z } from "zod";

export const universalRequestSchema = z.object({
  //headers
  headers: z
    .object({
      "content-type": z
        .string()
        .regex(/^application\/json$/, "Content-Type must be 'application/json'")
        .optional(),
      authorization: z.string().optional(),
    })
    .passthrough()
    .optional(),
  //body
  body: z.record(z.unknown()).optional(),
  //files
  files: z
    .object({
      file: z
        .array(
          z.object({
            originalname: z.string(),
            mimetype: z.string(),
            size: z.number().int().positive(),
          })
        )
        .optional(),
    })
    .optional(),
  //query
  query: z.record(z.string().or(z.number()).or(z.boolean())).optional(),
  //params
  params: z.record(z.string()).optional(),
  //cookies
  cookies: z
    .object({
      sessionId: z
        .string()
        .regex(/^[a-zA-Z0-9-_]+$/, "Invalid session ID format")
        .optional(),
    })
    .passthrough()
    .optional(),
});
