// src/utils/errors/prisma.error.ts
import { Prisma } from "@prisma/client"; // Use Prisma types from the '@prisma/client' package

// Common error response structure
interface ErrorResponse {
  statusCode: number;
  message: string;
  errorMessages: Array<{ path: string; message: string }>;
  success: boolean;
  data: null;
  meta: null;
}

// Handle Prisma validation error
const handlePrismaValidationError = (
  error: Prisma.PrismaClientValidationError
): ErrorResponse => {
  const errors = error.message
    ? [{ path: "unknown", message: error.message }]
    : [];
  return {
    statusCode: 400,
    message: error.message,
    errorMessages: errors,
    success: false,
    data: null,
    meta: null,
  };
};

// Handle Prisma unique constraint violation error
const handlePrismaUniqueConstraintError = (
  error: Prisma.PrismaClientKnownRequestError
): ErrorResponse => {
  return {
    statusCode: 400,
    message: error.message,
    errorMessages: error.meta?.cause
      ? [{ path: "unknown", message: String(error.meta.cause) }]
      : [],
    success: false,
    data: null,
    meta: null,
  };
};

// Handle Prisma record not found or cast error (e.g., invalid type)
const handlePrismaCastError = (
  error: Prisma.PrismaClientUnknownRequestError
): ErrorResponse => {
  const errors = [
    { path: error.message, message: "Invalid type or missing record" },
  ];
  return {
    statusCode: 400,
    message: "Cast error",
    errorMessages: errors,
    success: false,
    data: null,
    meta: null,
  };
};

// Handle Prisma generic error
const handlePrismaGenericError = (error: any): ErrorResponse => {
  return {
    statusCode: error?.statusCode || 500,
    message: error?.message || "Something went wrong",
    errorMessages: error?.meta?.cause
      ? [{ path: "unknown", message: error.meta.cause }]
      : [],
    success: false,
    data: null,
    meta: null,
  };
};

// Main handler function
export const handlePrismaError = (error: any): ErrorResponse => {
  if (error instanceof Prisma.PrismaClientValidationError) {
    return handlePrismaValidationError(error);
  } else if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    // P2002 is the unique constraint violation code in Prisma
    return handlePrismaUniqueConstraintError(error);
  } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    return handlePrismaCastError(error);
  } else {
    return handlePrismaGenericError(error);
  }
};
