import Router from "express";
import {
  addToCartController,
  getCartsController,
  removeFromCartController,
  updateCartItemQuantity,
} from "../controllers/cart.controller.js";
import PaginationMiddleware from "../middlewares/pagination.middleware.js";

const router = Router();

router.get("/", PaginationMiddleware, getCartsController);
router.post("/", addToCartController);
router.patch("/:productId", updateCartItemQuantity);
router.delete("/", removeFromCartController);

export default router;
