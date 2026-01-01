import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import z from "zod";
import { SALTROUND } from "../../constants/constant.js";
import { UserModel } from "../../models/user.model.js";

export async function registerController(req: Request, res: Response) {
  try {
    const { passConfirm, ...validateCreds } = registerSchema.parse(req.body);
    const userDataExist = await UserModel.findOne({
      $or: [
        { email: validateCreds?.email },
        { username: validateCreds?.username },
      ],
    }); // This will return the user object
    const conflict = [];
    const isEmailExist =
      userDataExist && userDataExist.email === validateCreds.email;
    const isUsernameExist =
      userDataExist && userDataExist.username === validateCreds.username;

    if (userDataExist && userDataExist.email === validateCreds.email)
      conflict.push("Email");
    if (userDataExist && userDataExist.username === validateCreds.username)
      conflict.push("Username");

    if (isEmailExist || isUsernameExist)
      return res.status(422).json({
        ok: false,
        statusCode: 422,
        message: `User ${conflict.length ? conflict.join(" and ") : ""} already exist.`,
      });

    if (!isEmailExist && !isUsernameExist) {
      const newUserObj = {
        ...validateCreds,
        password: await bcrypt.hash(validateCreds.password, SALTROUND),
      };
      const newUser = await UserModel.create(newUserObj);
      return res.status(201).json({
        ok: true,
        statusCode: 201,
        message: "User account created successfully.",
        newUser,
      });
    }
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        ok: false,
        message: err.message,
        error: err,
      });
    }
    return res.status(500).json({
      ok: false,
      message: "Something went wrong while creating account",
      error: err,
    });
  }
}

const registerSchema = z
  .object({
    email: z.email(),
    username: z
      .string()
      .trim()
      .min(3)
      .transform((str) => str.toLowerCase()),
    image: z.string().trim().default(""),
    firstName: z.string().trim(),
    lastName: z.string().trim().nullable(),
    gender: z.enum(["male", "female"]),
    password: z.string().trim().min(6),
    passConfirm: z.string(),
  })
  .refine(
    (data) => {
      if (data.password !== data?.passConfirm) return false;
      return true;
    },
    { error: "Validation error. provide correct information" }
  );
