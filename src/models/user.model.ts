import { Schema, model } from "mongoose";
const addressSchema = new Schema({
  street: {
    type: String,
    required: true,
  },
  houseNum: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  postalCode: {
    type: Number,
    required: true,
  },
  fullAddress: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
});

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      index: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      default: "male",
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: { type: String, default: "customer" },
    image: { type: String, default: "" },
    address: [addressSchema],
  },
  {
    timestamps: true,
    query: {
      byEmail(email) {
        return this.where({ email });
      },
    },
  }
);

export const UserModel = model("User", userSchema);
