// src/interfaces/pagination/pagination.interface.ts
import { SortOrder } from "mongoose";

export interface IPaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
}

export interface IPaginationOptionsResult {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: SortOrder;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
}
