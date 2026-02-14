import { model, Schema, Types } from "mongoose";
const cartItemSchema = new Schema({
  productId: { type: Types.ObjectId, required: true, ref: "Product" },
  name: { type: String, required: true },
  sku: { type: String, required: true },
  image: {
    url: { type: String, required: true },
    alt: String,
  },
  price: { type: Number, required: true },
  quantity: {
    type: Number,
    default: 1,
    min: 1,
  },
});

const cartSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [cartItemSchema],
  },
  { timestamps: true },
);
cartSchema.index({ userId: 1 }, { unique: true });

export const CartModel = model("Cart", cartSchema);
