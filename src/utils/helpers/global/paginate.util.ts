// src/utils/pagination.utils.ts
import { Document, Query } from "mongoose";
import { PaginatedResponse, PaginationOptions } from "../../../interfaces";

// Centralizing pagination logic
export const paginate = async <T extends Document>(
  query: Query<T[], T>,
  options: PaginationOptions
): Promise<PaginatedResponse<T>> => {
  const { page = 1, limit = 10 } = options;
  const skip = (page - 1) * limit;

  const [data, totalItems] = await Promise.all([
    query.skip(skip).limit(limit),
    query.model.countDocuments(),
  ]);

  const totalPages = Math.ceil(totalItems / limit);

  return {
    data,
    meta: {
      totalItems,
      totalPages,
      currentPage: page,
      pageSize: limit,
    },
  };
};
