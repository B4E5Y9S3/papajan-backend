import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import type { AuthJwtPayload } from "../types/Express.js";
import { UserModel } from "../models/user.model.js";
import { AppError } from "../services/appError.js";

export async function authAdminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const adminAuthHeader = req.headers?.authorization;
  if (!adminAuthHeader || !adminAuthHeader.startsWith("Bearer"))
    throw new AppError("Invalid auth key", 400, "INVALID KEY");

  const token = adminAuthHeader.replace("Bearer", "").trim();
  const payload = jwt.verify(token, env.JWT_SECRET) as AuthJwtPayload;
  if (!payload) throw payload;
  const userDoc = await UserModel.findById(payload.id);
  if (!userDoc?.role || userDoc.role !== "admin")
    throw new AppError(
      "You do not have permission to perform this operation",
      403,
      "PERMISSION DENIED",
    );

  if (userDoc.role === "admin") {
    req.user = payload;
    next();
  }
}
