import "express";
import type { SortOrder, Types } from "mongoose";
import type { PaginationFiltersInterface } from "./PaginationType.ts";
export interface AuthJwtPayload {
  id: Types.ObjectId;
  role: string;
  iat?: number;
  exp?: number;
}

interface PaginationInterface {
  page: number;
  sort: SortOrder;
  limit: number;
  filters?: PaginationFiltersInterface;
}
declare global {
  namespace Express {
    interface Request {
      user?: AuthJwtPayload;
      pagination?: PaginationInterface;
    }
  }
}
