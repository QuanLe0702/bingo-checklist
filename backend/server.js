import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import boardRoutes from "./routes/boardRoutes.js";
import templateRoutes from "./routes/templateRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(morgan("dev")); // Logging
app.use(express.json({ limit: '10mb' })); // Parse JSON with 10MB limit
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded
app.use(cookieParser()); // Parse cookies

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true, // Allow cookies
  })
);

// Routes
app.get("/", (req, res) => {
  res.json({ message: "🎯 Bingo Checklist API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/templates", templateRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
});
