import { Schema, model } from "mongoose";

const categorySchema = new Schema({
  name: {
    type: String,
    require: true,
    index: 1,
  },
  slug: { type: String, index: 1 },
});

export const CategoryModel = model("Category", categorySchema);
