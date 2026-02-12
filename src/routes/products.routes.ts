import { Router } from "express";

import { CreateProductController } from "../controllers/products/createProduct.controller.js";
import { deleteProduct } from "../controllers/products/deleteProduct.controller.js";
import { updateProductController } from "../controllers/products/updateProduct.controller.js";
import { authAdminMiddleware } from "../middlewares/auth.admin.middleware.js";

const router = Router();

router.post("/", authAdminMiddleware, CreateProductController);
router.put("/", authAdminMiddleware, updateProductController);
router.delete("/:id", authAdminMiddleware, deleteProduct);
export default router;
