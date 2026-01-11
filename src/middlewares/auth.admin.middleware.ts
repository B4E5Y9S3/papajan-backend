import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import type { AuthJwtPayload } from "../types/Express.js";

export async function authAdminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const adminAuthHeader = req.headers.authorization;
    if (!adminAuthHeader || !adminAuthHeader.startsWith("Bearer"))
      return res.status(401).json({
        message: "Invalid authorization Key",
        ok: false,
      });

    const token = adminAuthHeader.replace("Bearer", "").trim();
    const payload = jwt.verify(token, env.JWT_SECRET) as AuthJwtPayload;
    if (!payload)
      return res.status(500).json({ message: "Invalid or Expired Auth key" });
    next();
  } catch (err) {}
}
