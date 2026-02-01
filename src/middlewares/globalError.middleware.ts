import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { mongo } from "mongoose";
import z from "zod";
import { AppError } from "../services/appError.js";

export function globalErrorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof z.ZodError)
    return res.status(400).json({
      message: `Validation Error. ${z.prettifyError(err)}`,
      ok: false,
    });

  if (err instanceof mongo.MongoServerError) {
    if (err.code === 11000)
      return res.status(409).json({
        message: `Duplicate ${Object.keys(err.errorResponse?.keyPattern)} value.`,
        ok: false,
      });

    return res.status(400).json({
      message: `Database returned with error code ${err.code}`,
      ok: false,
    });
  }
  if (err instanceof jwt.TokenExpiredError)
    return res.status(401).json({ message: "Expired Token", ok: false });
  if (err instanceof jwt.JsonWebTokenError)
    return res.status(401).json({ message: "Invalid Token", ok: false });

  if (err instanceof AppError)
    return res
      .status(err.statusCode)
      .json({ message: err.message, ok: false, code: err.code, error: err });

  if (err instanceof Error)
    return res.status(400).json({ message: err.message, ok: false });

  return res.status(500).json({
    ok: false,
    message: "Internal Server Error",
  });
}
