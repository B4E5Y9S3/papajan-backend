import type { Request, Response } from "express";
import { ProductSchema } from "./productValidation.js";
import { ProductModel } from "../../models/product.model.js";
import slugify from "../../utils/slugify.js";

export async function CreateProductController(req: Request, res: Response) {
  const validated = ProductSchema.parse(req.body);
  try {
    // Ignore the warning, any error will be catched anyway
    // @ts-ignore
    const createdObj = await ProductModel.create({
      ...validated,
      slug: slugify(validated.name),
    });
    res.json({
      message: "Product successfully created.",
      ok: true,
      product: createdObj,
    });
  } catch (err) {
    throw err;
  }
}
