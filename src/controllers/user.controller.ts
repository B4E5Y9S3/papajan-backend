import type { Request, Response } from "express";
import { UserModel } from "../models/user.model.js";

export async function getUserProfile(req: Request, res: Response) {
  const userPayload = req.user;
  try {
    if (!userPayload)
      return res
        .status(404)
        .json({ message: "No user Payload was sent", ok: false });
    const { id } = userPayload;
    const user = await UserModel.findById(id);
    if (!user)
      return res.status(404).json({ message: "No user found.", ok: false });

    if (user) return res.status(200).json({ ok: true, user });
  } catch (err) {
    res
      .status(400)
      .json({ message: "something went wrong.", ok: false, error: err });
  }
}
