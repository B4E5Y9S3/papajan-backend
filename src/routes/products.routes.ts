import { Router } from "express";

import { CreateProductController } from "../controllers/products/createProduct.controller.js";
import { deleteProduct } from "../controllers/products/deleteProduct.controller.js";
import { updateProductController } from "../controllers/products/updateProduct.controller.js";
import { authAdminMiddleware } from "../middlewares/auth.admin.middleware.js";
import PaginationMiddleware from "../middlewares/pagination.middleware.js";
import { getProducts } from "../controllers/products/getProduct.controller.js";

const router = Router();

router.get("/", PaginationMiddleware, getProducts);
router.post("/", authAdminMiddleware, CreateProductController);
router.put("/", authAdminMiddleware, updateProductController);
router.delete("/:id", authAdminMiddleware, deleteProduct);
export default router;
