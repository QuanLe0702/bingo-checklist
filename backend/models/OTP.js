import mongoose from 'mongoose';

/**
 * Schema cho OTP (One-Time Password)
 * Lưu mã OTP tạm thời để reset password
 */
const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // Tự động xóa sau 10 phút (600 giây)
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

// Index để tăng tốc độ query
otpSchema.index({ email: 1, createdAt: -1 });

const OTP = mongoose.model('OTP', otpSchema);

export default OTP;
