import { model, Schema } from "mongoose";

const brandSchema = new Schema({
  name: { type: String, required: true },
});

export const BrandModel = model("Brand", brandSchema);
