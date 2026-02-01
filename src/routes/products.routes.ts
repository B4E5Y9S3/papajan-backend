import { Router } from "express";

import { CreateProductController } from "../controllers/products/createProduct.controller.js";
import { deleteProduct } from "../controllers/products/deleteProduct.controller.js";
import { updateProductController } from "../controllers/products/updateProduct.controller.js";
import { authAdminMiddleware } from "../middlewares/auth.admin.middleware.js";

const router = Router();

router.post("/productNew", authAdminMiddleware, CreateProductController);
router.put("/productUpdate", authAdminMiddleware, updateProductController);
router.delete("/productDelete", authAdminMiddleware, deleteProduct);
export default router;
