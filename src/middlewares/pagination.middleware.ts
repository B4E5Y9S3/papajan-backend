import type { NextFunction, Request, Response } from "express";
import z from "zod";
import { PAGINATION_LIMIT_MAX } from "../constants/constant.js";
import type { PaginationFiltersInterface } from "../types/PaginationType.js";
import type { SortOrder } from "mongoose";

const zodPaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(PAGINATION_LIMIT_MAX).default(10),

  sort: z
    .union([
      z.literal(1),
      z.literal(-1),
      z.literal("asc"),
      z.literal("ascending"),
      z.literal("desc"),
      z.literal("descending"),
    ])
    .default(1),

  search: z.string().min(3).optional(),

  category: z.string().min(1).optional(),

  minPrice: z.coerce.number().min(0).optional(),

  maxPrice: z.coerce.number().min(0).optional(),

  brand: z.string().min(3).optional(),
});

export default async function PaginationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const queryData = zodPaginationSchema
    .refine(
      (data) =>
        data.minPrice === undefined ||
        data.maxPrice === undefined ||
        data.minPrice < data.maxPrice,
      {
        message: "minPrice cannot be greater than maxPrice",
        path: ["minPrice"],
      },
    )

    .parse(req.query);
  const { page, sort, limit } = queryData;
  const filters: PaginationFiltersInterface = {};

  if (queryData.category) filters.category = queryData.category;

  if (queryData.brand) filters.brand = queryData.brand;

  if (queryData.search)
    filters.name = { $regex: queryData.search, $options: "i" };

  if (queryData.minPrice !== undefined || queryData.maxPrice !== undefined) {
    filters.price = {};
    if (queryData.minPrice !== undefined)
      filters.price.$gte = queryData.minPrice;
    if (queryData.maxPrice !== undefined)
      filters.price.$lte = queryData.maxPrice;
  }

  req.pagination = {
    page,
    sort,
    limit,
    filters,
  };

  next();
}
