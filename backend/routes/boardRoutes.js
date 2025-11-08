import express from "express";
import {
  createBoard,
  getBoards,
  getBoard,
  updateBoard,
  deleteBoard,
  checkCell,
  shareBoard,
  getPublicBoard,
} from "../controllers/boardController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route
router.get("/public/:slug", getPublicBoard);

// Protected routes
router.post("/", protect, createBoard);
router.get("/", protect, getBoards);
router.get("/:id", protect, getBoard);
router.put("/:id", protect, updateBoard);
router.delete("/:id", protect, deleteBoard);
router.post("/:id/check", protect, checkCell);
router.post("/:id/share", protect, shareBoard);

export default router;
