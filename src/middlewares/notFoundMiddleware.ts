import type { NextFunction, Request, Response } from "express";

export function notFoundMiddleware(
  _: Request,
  res: Response,
  next: NextFunction
) {
  res.status(404).json({
    ok: false,
    statusCode: 404,
    message: "404! That page does not exist.! :(",
  });
  next();
}
