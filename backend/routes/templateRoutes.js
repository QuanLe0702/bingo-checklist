import express from "express";
import {
  getTemplates,
  getTemplate,
  createTemplate,
} from "../controllers/templateController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getTemplates);
router.get("/:id", getTemplate);

// Protected route (có thể thêm admin check)
router.post("/", protect, createTemplate);

export default router;
