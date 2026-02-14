import Router from "express";
import {
  addToCartController,
  getCartsController,
  removeFromCartController,
  updateCartItemQuantity,
} from "../controllers/cart.controller.js";

const router = Router();

router.get("/", getCartsController);
router.post("/", addToCartController);
router.patch("/:productId", updateCartItemQuantity);
router.delete("/", removeFromCartController);

export default router;
