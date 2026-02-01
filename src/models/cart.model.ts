import { model, Schema, Types } from "mongoose";

const cartSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      require: true,
      index: true,
    },
    items: [
      {
        productId: { type: Types.ObjectId, require: true, ref: "User" },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  { timestamps: true }
);

export const CartModel = model("Cart", cartSchema);
