import { Router } from "express";

import authMiddleware from "../middlewares/auth.middleware.js";
import authRoutes from "./auth.routes.js";
import brandRoutes from "./brand.routes.js";
import cartRoute from "./cart.routes.js";
import productRoutes from "./products.routes.js";
import userRoutes from "./user.routes.js";
const router = Router();

router.use("/auth", authRoutes);
router.use("/user", authMiddleware, userRoutes);
router.use("/product", productRoutes);
router.use("/brands", brandRoutes);
router.use("/cart", authMiddleware, cartRoute);
export default router;
