import "express";
import type { Types } from "mongoose";
export interface AuthJwtPayload {
  id: Types.ObjectId;
  role: string;
  iat?: number;
  exp?: number;
}
declare global {
  namespace Express {
    interface Request {
      user?: AuthJwtPayload;
    }
  }
}
