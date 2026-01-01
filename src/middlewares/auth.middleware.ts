import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import type { AuthJwtPayload } from "../types/Express.js";

async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers?.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer"))
      return res.status(401).json({
        message: "Invalid authorization Key",
        ok: false,
      });
    const token = authHeader.replace("Bearer", "").trim();
    const payload = jwt.verify(token, env.JWT_SECRET) as AuthJwtPayload;
    if (!payload)
      return res.status(500).json({ message: "Invalid or Expired Auth key" });
    req.user = payload;
    next();
  } catch (err) {
    console.error("log:", err);
    return res.status(401).json({ ok: false, message: "Invalid token" });
  }
}
export default authMiddleware;
