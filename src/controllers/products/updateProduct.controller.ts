import type { Request, Response } from "express";
import { z } from "zod";
import { zodDeepPartial } from "zod-deep-partial";
import { ProductModel } from "../../models/product.model.js";
import slugify from "../../utils/slugify.js";
import { ProductSchema } from "./productValidation.js";
export async function updateProductController(req: Request, res: Response) {
  const parse = zodDeepPartial(ProductSchema)
    .extend({
      id: z.string(),
    })
    .superRefine((data, ctx) => {
      if (!data.id)
        ctx.addIssue({
          code: "custom",
          message: "id is required to make changes",
          path: [data.id],
        });
    })
    .transform((data) => {
      if (data.name) return { ...data, slug: slugify(data.name) };
      return { ...data };
    })
    .parse(req.body);

  const updatedDoc = await ProductModel.findByIdAndUpdate(
    parse.id,
    { ...parse },
    { new: true },
  );
  res.status(200).json({
    message: `Successfully updated product ''`,
    ok: true,
    updatedDoc,
  });
}
