import { Schema, model } from "mongoose";

const categorySchema = new Schema({
  name: {
    type: String,
    require: true,
  },
});

export const CategoryModel = model("Category", categorySchema);
