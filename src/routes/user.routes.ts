import { Router } from "express";
import { loginController } from "../controllers/auth/login.controller.js";
import { registerController } from "../controllers/auth/register.controller.js";
import { getUserProfile } from "../controllers/auth/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);

router.get("/profile", authMiddleware, getUserProfile);

export default router;
