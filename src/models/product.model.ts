import { Schema, model } from "mongoose";

const ProductItemSchema = new Schema({
  price: Number,
  quantity: Number,
  inStock: Number,
  options: {
    type: Map,
    of: String,
  },
});

const ProductSchema = new Schema({
  name: String,
  description: String,
  image: String,
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: "Category",
  },
  items: [ProductItemSchema],
});

export const ProductModel = model("Product", ProductSchema);
