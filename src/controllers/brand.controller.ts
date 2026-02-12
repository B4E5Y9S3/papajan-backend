import type { Request, Response } from "express";
import { mongo } from "mongoose";
import z from "zod";
import { BrandModel } from "../models/brand.model.js";
import { objectId } from "./products/productValidation.js";

export async function getAllBrandsController(req: Request, res: Response) {
  try {
    const brands = await BrandModel.find({});

    if (!brands || brands.length < 1)
      return res.status(400).json({ message: "No brands found", ok: false });

    if (brands)
      return res.status(200).json({
        brands,
        ok: true,
        message: `${brands?.length} brands available.`,
      });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Something went wrong.", ok: false, error: err });
  }
}

export async function getBrandController(req: Request, res: Response) {
  const body = z
    .object({
      id: objectId,
    })
    .parse(req.params);
  const brandId = body.id;

  const brand = await BrandModel.findById(brandId);
  if (!brand)
    return res.status(400).json({ message: "No brand found", ok: false });

  if (brand)
    return res.status(200).json({
      brand,
      ok: true,
      message: `Brand successfully fetched.`,
    });
}

export async function createBrandController(req: Request, res: Response) {
  const body = z
    .object({ name: z.string().toLowerCase().nonempty().min(2) })
    .parse(req.body);
  const { name: brandName } = body;
  const newBrand = await BrandModel.create({ name: brandName }); // must be unque else will catch in catch block
  if (newBrand) {
    return res.status(200).json({
      message: "New Brand successfully added.",
      ok: true,
      brand: newBrand,
    });
  }
}

export async function deleteBrandController(req: Request, res: Response) {
  const body = z
    .object({
      name: z.string().optional(),
      id: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      const hasName = !!data.name;
      const hasId = !!data.id;

      if (hasName && hasId) {
        ctx.addIssue({
          code: "custom",
          message: "Provide either name or id, but not both",
          path: [],
        });
      }
    })
    .parse(req.body);
  let brandData;
  if (body.id) brandData = await BrandModel.findByIdAndDelete(body.id);
  if (body.name)
    brandData = await BrandModel.findOneAndDelete({ name: body.name });
  if (!brandData) throw new Error("No brand data was found.!");
  return res.status(200).json({
    message: `${brandData.name} Successfully deleted`,
    ok: true,
    brand: brandData,
  });
}
