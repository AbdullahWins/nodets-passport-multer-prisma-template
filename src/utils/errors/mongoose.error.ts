// src/utils/errors/mongoose.error.ts
export const handleMongooseServerError = (error: any) => {
  const errors = [{ path: "unknown", message: error.message }];
  return {
    statusCode: 400,
    message: error.message,
    errorMessages: errors,
    success: false,
    data: null,
    meta: null,
  };
};

const handleMongooseValidationError = (error: any) => {
  const errors = Object.values(error.errors).map((el: any) => {
    return { path: el.path, message: el.message };
  });

  return {
    statusCode: 400,
    message: error.message,
    errorMessages: errors,
    success: false,
    data: null,
    meta: null,
  };
};

const handleMongooseDuplicateKeyError = (error: any) => {
  return {
    statusCode: 400,
    message: error.message,
    errorMessages: error.errors || [],
    success: false,
    data: null,
    meta: null,
  };
};

const handleMongooseCastError = (error: any) => {
  const errors = [{ path: error.path, message: "Invalid ID" }];
  return {
    statusCode: 400,
    message: "Cast error",
    errorMessages: errors,
    success: false,
    data: null,
    meta: null,
  };
};

const handleMongooseGenericError = (error: any) => {
  return {
    statusCode: error?.statusCode || 500,
    message: error?.message || "Something went wrong",
    errorMessages: error.errors || [],
    success: false,
    data: null,
    meta: null,
  };
};

export const handleMongooseError = (error: any) => {
  if (error.name === "ValidationError") {
    return handleMongooseValidationError(error);
  } else if (error.name === "CastError") {
    return handleMongooseCastError(error);
  } else if (error.code === 11000) {
    return handleMongooseDuplicateKeyError(error);
  } else {
    return handleMongooseGenericError(error);
  }
};
