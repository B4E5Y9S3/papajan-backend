import type { Request, Response } from "express";
import { BrandModel } from "../models/brand.model.js";
import z from "zod";

export async function getAllBrandsController(req: Request, res: Response) {
  try {
    const brands = await BrandModel.find({});

    if (!brands)
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
  try {
    const brands = await BrandModel.find({});

    if (!brands)
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
