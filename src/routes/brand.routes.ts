import { Router } from "express";
import {
  createBrandController,
  deleteBrandController,
  getAllBrandsController,
  getBrandController,
} from "../controllers/brand.controller.js";
import { authAdminMiddleware } from "../middlewares/auth.admin.middleware.js";

const router = Router();

router.get("/getBrands", getAllBrandsController);
router.get("/getBrand", getBrandController);
router.post("/brandNew", authAdminMiddleware, createBrandController);
router.delete("/brandDelete", authAdminMiddleware, deleteBrandController);

export default router;
