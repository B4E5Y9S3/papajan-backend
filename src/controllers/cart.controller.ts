import type { Request, Response } from "express";
import { mongo, Types } from "mongoose";
import z from "zod";
import { CartModel } from "../models/cart.model.js";
import { ProductModel } from "../models/product.model.js";
import { AppError } from "../services/appError.js";
import { objectId } from "./products/productValidation.js";

const cartZodSchema = z.object({
  item: z.object({
    productId: objectId,
    sku: z.string("Invalid sku").min(3),
    quantity: z.number().optional().default(1),
  }),
});

export async function getCartsController(req: Request, res: Response) {
  const userId = req.user?.id;
  if (!userId)
    return res
      .status(401)
      .json({ message: "user is not authorized", ok: false });
  const page = req.pagination?.page ?? 1;
  const limit = req.pagination?.limit ?? 10;
  const offset = (page - 1) * limit;
  // if no filtering better use this
  // const userCartDoc = await CartModel.findOne({ userId }).select({
  //   items: { $slice: [offset, limit] },
  // });

  // Aggregation pipeline and Filter
  const pipeline: any[] = [
    { $match: { userId: new Types.ObjectId(userId) } },

    { $unwind: "$items" },
  ];

  const paginationPrice = req.pagination?.filters?.price;
  if (paginationPrice)
    pipeline.push({
      $match: {
        "items.price": {
          ...paginationPrice,
        },
      },
    });
  const paginationSearch = req.pagination?.filters?.name;
  if (paginationSearch)
    pipeline.push({
      $match: {
        "items.name": paginationSearch,
      },
    });
  // disassemble
  pipeline.push(
    {
      $facet: {
        paginatedItems: [
          { $unwind: "$items" },
          { $skip: offset },
          { $limit: limit },
          {
            $group: {
              _id: "$_id",
              items: { $push: "$items" },
            },
          },
        ],
        cartMeta: [{ $limit: 1 }], // checks if user cart exist
      },
    },
    // Reassemble or output data structure
    {
      $project: {
        _id: { $arrayElemAt: ["$cartMeta._id", 0] },
        userId,
        items: {
          $ifNull: [{ $arrayElemAt: ["$paginatedItems.items", 0] }, []], // if null return empty Array
        },
      },
    },
  );

  const result = await CartModel.aggregate(pipeline);

  if (!result)
    return res.json({
      message: "User don't have any cart entry in Database",
      ok: false,
    });
  return res
    .status(200)
    .json({ message: "user cart retrived", ok: true, cart: result[0] });
}

export async function addToCartController(req: Request, res: Response) {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized",
      ok: false,
    });
  }

  const {
    item: { sku, productId, quantity },
  } = cartZodSchema.parse(req.body);

  // will only return matched item object from items[]
  const productDoc = await ProductModel.findOne(
    { _id: productId, "items.sku": sku },
    { "items.$": 1, name: 1, images: 1 },
  );

  if (!productDoc || !productDoc.items[0])
    throw new AppError("product variant not found", 404, "NOT_FOUND");

  const variant = productDoc.items[0];

  if (variant.stock < quantity)
    throw new AppError("insufficient stock", 400, "INSUFFICIENT_STOCK");

  const image = variant.images?.[0] ?? productDoc.images?.[0];

  const newCartItem = {
    productId,
    sku,
    quantity,
    name: productDoc.name,
    price: variant.price,
    image,
  };
  try {
    // if productId $not in items array then push new one else global error will handle duplicate
    const updated = await CartModel.findOneAndUpdate(
      {
        userId,
        items: { $not: { $elemMatch: { productId, sku } } },
      },
      {
        $push: { items: newCartItem },
      },
      {
        new: true,
        upsert: true,
      },
    );
    return res.json({
      message: "Successfully added to cart",
      ok: true,
      items: updated.items,
    });
  } catch (err) {
    if (err instanceof mongo.MongoError && err.code === 11000)
      return res
        .status(409)
        .json({ message: "item already exists in cart", ok: false });
    throw err;
  }
}
export async function updateCartItemQuantity(req: Request, res: Response) {
  const userId = req.user?.id;
  const productId = req.params?.productId;

  const { quantity } = z
    .object({ quantity: z.number().int().min(1) })
    .parse(req.body);

  if (!userId || !productId)
    throw new AppError("Unauthorized action.", 401, "UNAUTHORIZED");

  const cartDoc = await CartModel.findOneAndUpdate(
    {
      userId,
      "items.productId": productId,
    },
    {
      $set: { "items.$.quantity": quantity },
    },
    { new: true },
  );

  if (!cartDoc) {
    throw new AppError("Cart item not found.", 404, "NOT_FOUND");
  }

  return res.status(200).json({
    message: "Quantity updated",
    ok: true,
    cart: cartDoc,
  });
}

export async function removeFromCartController(req: Request, res: Response) {
  const { userId, itemId } = z
    .object({ userId: objectId, itemId: objectId })
    .parse(req.body);

  const doc = await CartModel.findOneAndUpdate(
    { userId },
    { $pull: { items: { _id: itemId } } },
  );
  if (!doc?.items || doc.items.length === 0)
    throw new AppError("item is not on the cart", 404, "NOT_FOUND");

  return res
    .status(200)
    .json({ message: "Item removed from the cart", ok: true, item: doc });
}
