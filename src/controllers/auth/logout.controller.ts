import type { Request, Response } from "express";
import { verifyRefreshToken } from "../../utils/jwt.js";
import { RefreshModel } from "../../models/refreshToken.model.js";
import { env } from "../../config/env.js";

export async function logoutController(req: Request, res: Response) {
  const token = req.cookies?.refreshToken;
  try {
    if (!token)
      return res
        .status(401)
        .json({ message: "Unauthorized. no token provided", ok: false });
    const { tokenId } = verifyRefreshToken(token);
    await RefreshModel.updateOne({ tokenId }, { revoked: true });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "something went wrong.", ok: false, error: err });
  }
  res
    .clearCookie("refreshToken", {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: env.NODE_ENV === "production" ? "strict" : "lax",
      path: "/auth",
    })
    .sendStatus(204);
}
