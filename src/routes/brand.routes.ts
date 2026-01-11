import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/getBrands");
router.get("/getBrand");
router.post("/createBrand", authMiddleware);

export default router;
