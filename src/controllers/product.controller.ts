import type { Request, Response } from "express";
import z from "zod";
import { ProductModel } from "../models/product.model.js";

const ImageSchema = z.object({
  url: z.url(),
  alt: z.string().optional(),
});
const ProductItemSchema = z.object({
  sku: z.string().min(1),

  price: z.number().positive(),
  inStock: z.number().int().nonnegative(),

  options: z.record(z.string().min(1), z.string().min(1)),

  images: z.array(ImageSchema).optional(),
});

const ProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  brand: z.string().optional(),

  rating: z
    .object({
      avg: z.number().min(0).max(5),
      count: z.number().int().nonnegative(),
    })
    .optional(),

  images: z.array(ImageSchema).optional(),

  items: z.array(ProductItemSchema).min(1),
});

export async function CreateProductController(req: Request, res: Response) {
  try {
    const { ...validated } = ProductSchema.parse(req.body);
    const createdObj = await ProductModel.create(validated);
    res.json({
      message: "Product successfully created.",
      ok: true,
      product: createdObj,
    });
  } catch (err) {
    if (err instanceof z.ZodError)
      return res
        .status(400)
        .json({ message: `Validation error. ${z.prettifyError(err)}` });
    res
      .status(400)
      .json({ message: "something went wrong.", ok: false, error: err });
  }
}

export async function updateProductController(req: Request, res: Response) {
  try {
  } catch (err) {
    if (err instanceof z.ZodError)
      return res
        .status(400)
        .json({ message: `Validation error. ${z.prettifyError(err)}` });
    res
      .status(400)
      .json({ message: "something went wrong.", ok: false, error: err });
  }
}
