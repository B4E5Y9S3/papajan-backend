import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import z from "zod";
import { UserModel } from "../../models/user.model.js";
import { env } from "../../config/env.js";

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
    const { email, id, username } = findUserData;
    const payload = { email, id, username };
    if (payload) {
      const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: "24h" });
      // const token =
      //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Inh4ZnNhZGZhYXNkQGdtYWlsLmNvbSIsImlkIjoiNjk1MjE2MTI1YWE0MDY1MjNjZTViMzliIiwidXNlcm5hbWUiOiJ4eGFzYWYiLCJpYXQiOjE3NjcwOTY2MDUsImV4cCI6MTc2NzA5NjkwNX0.UJQXcW4VHYmDDulWeO8BshhBw7qf6q46S_bYaXKGWvg";
      return res
        .status(200)
        .json({ message: "Authenticaton token successfully created", token });
    }
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

const loginSchema = z.object({
  email: z.email("A valid Email is required"),
  password: z
    .string("Password is required")
    .nonempty("Password cannot be empty"),
});
