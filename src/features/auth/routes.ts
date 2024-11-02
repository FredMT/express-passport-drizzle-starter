import { Router } from "express";
import { authController } from "./controllers/authController";
import { requireAuth } from "../../shared/middleware/auth";

export const authRoutes = Router();

authRoutes.post("/register", authController.register);
authRoutes.get("/verify-email/:token", authController.verifyEmail);
authRoutes.post("/login", authController.login);
authRoutes.post("/forgot-password", authController.forgotPassword);
authRoutes.post("/reset-password/:token", authController.resetPassword);

export default authRoutes;
