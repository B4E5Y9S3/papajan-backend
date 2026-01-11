import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import { Types } from "mongoose";
import z from "zod";
import { env } from "../../config/env.js";
import { REFRESH_EXPIRY_MS } from "../../constants/constant.js";
import { RefreshModel } from "../../models/refreshToken.model.js";
import { UserModel } from "../../models/user.model.js";
import type { payloadInterface } from "../../types/typesJwt.js";
import { signAccessToken, signRefreshToken } from "../../utils/jwt.js";

const loginSchema = z.object({
  email: z.email("A valid Email is required"),
  password: z
    .string("Password is required")
    .nonempty("Password cannot be empty"),
});

export async function loginController(req: Request, res: Response) {
  try {
    const userData = loginSchema.parse(req.body);
    const findUserData = await UserModel.findOne({
      email: userData.email,
    }).select("+password");

    if (!findUserData)
      return res
        .status(404)
        .json({ message: "User not found.", statusCode: 404 });
    const isPassMatch = await bcrypt.compare(
      userData.password,
      findUserData.password
    );

    if (!isPassMatch)
      return res
        .status(500)
        .json({ message: "Incorrect password.", statusCode: 500 });

    // payload
    const { id, role } = findUserData;
    const payload: payloadInterface = { id, role };
    if (!payload)
      return res.status(403).json({ message: "Invalid payload.", ok: false });
    const tokenId = new Types.ObjectId().toString();
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken({ userId: id, tokenId });
    await RefreshModel.create({
      tokenId,
      userId: id,
      expiresAt: new Date(Date.now() + REFRESH_EXPIRY_MS),
    });
    return res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: env.NODE_ENV === "production" ? "strict" : "lax",
        path: "/auth",
      })
      .status(200)
      .json({
        message: "Access token successfully created",
        ok: true,
        accessToken,
      });
  } catch (err) {
    if (err instanceof z.ZodError)
      return res.status(400).json({
        message: z.prettifyError(err).trim(),
        statusCode: 400,
        error: err,
      });
    res
      .status(400)
      .json({ message: "something went wrong. Please try again", error: err });
  }
}
