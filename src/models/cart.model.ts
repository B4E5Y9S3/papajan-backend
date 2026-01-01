import { Model, Schema, Types } from "mongoose";

const cartSchema = new Schema({
  userId: {
    type: Types.ObjectId,
    ref: "User",
    require: true,
    index: true,
  },
  items: [
    {
      productId: { type: Types.ObjectId, require: true },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
