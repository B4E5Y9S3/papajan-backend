/* ------------------ Shared ------------------ */

import z from "zod";

export const objectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

const ImageSchema = z.object({
  url: z.url(),
  alt: z.string().optional().default(""),
});

/* ------------------ Product Item ------------------ */

const ProductItemSchema = z.object({
  sku: z.string().min(4),

  price: z.number().positive(),
  inStock: z.number().int().nonnegative(),

  options: z.record(z.string().min(1), z.string().min(1)),

  images: z.array(ImageSchema).min(1),
});

/* ------------------ Product ------------------ */

export const ProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),

  brand: objectId,
  categoryId: objectId,

  coupon: z.string().nullable().optional(),

  discountPercentage: z.number().min(0).max(100).default(0),

  rating: z
    .object({
      avg: z.number().min(0).max(5).default(0),
      count: z.number().int().nonnegative().default(0),
    })
    .optional(),

  images: z.array(ImageSchema).min(1),

  items: z.array(ProductItemSchema).min(1),
});
