import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { env } from "../../config/env.js";
import { REFRESH_EXPIRY_MS } from "../../constants/constant.js";
import { RefreshModel } from "../../models/refreshToken.model.js";
import { UserModel } from "../../models/user.model.js";
import type { payloadInterface } from "../../types/typesJwt.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt.js";

export async function refreshController(req: Request, res: Response) {
  const token = req.cookies?.refreshToken;
  try {
    if (!token)
      return res
        .status(401)
        .json({ message: "No refresh token was sent.", ok: false });

    const decodedToken = verifyRefreshToken(token); // if error, will jump to catch block
    const { userId, tokenId } = decodedToken;
    const record = await RefreshModel.findOne({ tokenId, revoked: false });
    if (!record) {
      // for preventing token reuse attack
      await RefreshModel.updateMany({ userId }, { revoked: true });
      return res
        .status(401)
        .json({ message: "Used or Invalid token", ok: false });
    }
    record.revoked = true;
    await record.save();
    const user = await UserModel.findById(userId);
    const payload: payloadInterface = {
      id: userId,
      role: user?.role as string,
    };
    const newTokenId = new Types.ObjectId().toString();
    await RefreshModel.create({
      tokenId: newTokenId,
      userId,
      revoked: false,
      expiresAt: new Date(Date.now() + REFRESH_EXPIRY_MS),
    });

    const newAccessToken = signAccessToken(payload);
    const newRefreshToken = signRefreshToken({ userId, tokenId: newTokenId });
    return res
      .cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: env.NODE_ENV === "production" ? "strict" : "lax",
        path: "/auth",
      })
      .status(200)
      .json({
        message: "Access token successfully created",
        ok: true,
        newAccessToken,
      });
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError)
      return res
        .status(401)
        .json({ message: "Expired token.", ok: false, error: err });
    res
      .status(401)
      .json({ message: "Something went wrong", ok: false, error: err });
  }
}
