import { Router } from "express";

import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import productRoutes from "./products.routes.js";
const router = Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/product", productRoutes);
export default router;
