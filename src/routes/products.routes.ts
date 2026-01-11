import { Router } from "express";
import {
  CreateProductController,
  updateProductController,
} from "../controllers/product.controller.js";

const router = Router();

router.post("/productNew", CreateProductController);
router.put("/productUpdate", updateProductController);
export default router;
