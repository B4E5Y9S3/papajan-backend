import { Schema, Types, model, type InferSchemaType } from "mongoose";

const refreshSchema = new Schema(
  {
    tokenId: { type: String, required: true, unique: true },
    userId: { type: Types.ObjectId, required: true, ref: "User" },
    revoked: { type: Boolean, default: false, index: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export type RefreshModelType = InferSchemaType<typeof refreshSchema>;

export const RefreshModel = model<RefreshModelType>("Refresh", refreshSchema);
