import { Schema, model, Types } from "mongoose";

const ProductItemSchema = new Schema(
  {
    sku: { type: String, required: true },

    price: { type: Number, required: true },
    inStock: { type: Number, required: true },

    options: {
      type: Map,
      of: String,
      required: true,
    },

    images: [
      {
        url: { type: String, required: true },
        alt: String,
      },
    ],
  },
  { _id: true }
);

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },

    brand: { type: Types.ObjectId, ref: "Brand", required: true },
    categoryId: { type: Types.ObjectId, ref: "Category", required: true },

    coupon: String,
    discountPercentage: { type: Number, default: 0 },

    rating: {
      avg: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },

    images: [
      {
        url: { type: String, required: true },
        alt: String,
      },
    ],

    items: {
      type: [ProductItemSchema],
      required: true,
    },
  },
  { timestamps: true }
);

ProductSchema.index({ name: 1 });
ProductSchema.index({ brand: 1 });
ProductSchema.index({ categoryId: 1 });
ProductSchema.index({ "items.sku": 1 });

export const ProductModel = model("Product", ProductSchema);
