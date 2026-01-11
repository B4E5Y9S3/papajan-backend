import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ACCESS_EXPIRY, REFRESH_EXPIRY } from "../constants/constant.js";
import type { RefreshModelType } from "../models/refreshToken.model.js";
import type { payloadInterface } from "../types/typesJwt.js";
export function signAccessToken(payload: payloadInterface) {
  if (!payload) throw new Error("No payload data was provided");

  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: ACCESS_EXPIRY,
  });
}
export function signRefreshToken(payload: { userId: string; tokenId: string }) {
  if (!payload) throw new Error("No payload data was provided");

  return jwt.sign(payload, env.REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRY,
  });
}
export function verifyAccessToken(token: string): payloadInterface {
  if (!token) throw new Error("No token data was provided");

  return jwt.verify(token, env.JWT_SECRET) as payloadInterface;
}
export function verifyRefreshToken(token: string): Omit<
  RefreshModelType,
  "userId"
> & {
  userId: string;
} {
  if (!token) throw new Error("No token data was provided");
  return jwt.verify(token, env.REFRESH_SECRET) as Omit<
    RefreshModelType,
    "userId"
  > & {
    userId: string;
  };
}
