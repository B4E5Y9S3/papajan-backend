import { Router } from "express";
import {
  createBrandController,
  deleteBrandController,
  getAllBrandsController,
  getBrandController,
} from "../controllers/brand.controller.js";
import { authAdminMiddleware } from "../middlewares/auth.admin.middleware.js";

const router = Router();

router.get("/", getAllBrandsController);
router.post("/", authAdminMiddleware, createBrandController);

router.get("/:id", getBrandController);
router.delete("/:id", authAdminMiddleware, deleteBrandController);

export default router;
