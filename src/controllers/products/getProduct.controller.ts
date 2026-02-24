import type { Request, Response } from "express";
import { ProductModel } from "../../models/product.model.js";
import { AppError } from "../../services/appError.js";
export async function getProducts(req: Request, res: Response) {
  const pagination = req?.pagination;
  if (!pagination)
    throw new AppError("pagination error", 504, "INTERNAL_ERROR");
  const { page = 1, sort, limit = 10 } = pagination;

  const productDoc = await ProductModel.find({ ...req.pagination?.filters })
    .skip((page - 1) * limit)
    .limit(limit)
    .sort(sort ?? 1);

  res.status(200).json({
    message: "Product successfully fetched.",
    ok: true,
    totalProduct: productDoc.length,
    products: productDoc,
  });
}
