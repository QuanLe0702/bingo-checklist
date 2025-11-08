import mongoose from "mongoose";

/**
 * Kết nối đến MongoDB Atlas
 */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      // Các options mặc định đã được mongoose 6+ tự động bật
    });
    console.log("✅ MongoDB Atlas connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

export default connectDB;
