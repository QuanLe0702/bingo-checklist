import express from "express";
import {
  register,
  login,
  getMe,
  logout,
  updateProfile,
  updateDashboardBg,
  changePassword,
  forgotPassword,
  verifyOTP,
  resetPassword,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/logout", protect, logout);
router.put("/update-profile", protect, updateProfile);
router.put("/update-dashboard-bg", protect, updateDashboardBg);
router.put("/change-password", protect, changePassword);

// Forgot password flow (public routes)
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

export default router;
