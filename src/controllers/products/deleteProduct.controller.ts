import type { Request, Response } from "express";
import z from "zod";
import { ProductModel } from "../../models/product.model.js";
import { AppError } from "../../services/appError.js";
import { objectId } from "./productValidation.js";
export async function deleteProduct(req: Request, res: Response) {
  // this will only be a soft delete not Hard delete
  const { id } = z.object({ id: objectId }).parse(req.body);
  const doc = await ProductModel.findOneAndUpdate(
    { _id: id, isActive: true },
    { isActive: false, deletedAt: new Date() },
    { new: true },
  );
  if (!doc)
    throw new AppError("No active Product was found.!", 404, "INTERNAL ERROR");
  return res.sendStatus(204);
}
