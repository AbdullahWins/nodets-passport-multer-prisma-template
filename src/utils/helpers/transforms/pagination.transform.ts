// src/utils/helpers/transforms/pagination.transform.ts
import {
  IPaginationOptions,
  IPaginationOptionsResult,
} from "../../../interfaces";

export const calculatePagination = (
  options: IPaginationOptions
): IPaginationOptionsResult => {
  const page = Number(options.page || 1);
  const limit = Number(options.limit);
  const skip = (page - 1) * limit;

  const sortBy = options.sortBy || "createdAt";
  const sortOrder = options.sortOrder || "desc";

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};
