import { Router } from "express";

import authRoutes from "./auth.routes.js";
import brandRoutes from "./brand.routes.js";
import productRoutes from "./products.routes.js";
import userRoutes from "./user.routes.js";
const router = Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/product", productRoutes);
router.use("/brands", brandRoutes);
export default router;
