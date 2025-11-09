import User from "../models/User.js";
import OTP from "../models/OTP.js";
import { generateToken, setCookie } from "../utils/jwt.js";
import { registerSchema, loginSchema } from "../utils/validation.js";
import { generateOTP, sendOTPEmail } from "../utils/emailService.js";

/**
 * @route   POST /api/auth/register
 * @desc    Đăng ký user mới
 * @access  Public
 */
export const register = async (req, res) => {
  try {
    // Validate input
    const validatedData = registerSchema.parse(req.body);
    const { username, email, password, displayName } = validatedData;

    // Kiểm tra user đã tồn tại
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email hoặc username đã được sử dụng",
      });
    }

    // Tạo user mới
    const user = await User.create({
      username,
      email,
      password,
      displayName: displayName || username,
    });

    // Tạo token và set cookie
    const token = generateToken(user._id);
    setCookie(res, token);

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      displayName: user.displayName,
      dashboardBg: user.dashboardBg || "",
      token,
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        message: "Dữ liệu không hợp lệ",
        errors: error.errors,
      });
    }
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Đăng nhập
 * @access  Public
 */
export const login = async (req, res) => {
  try {
    // Validate input
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;

    // Tìm user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Email hoặc password không đúng" });
    }

    // Kiểm tra password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Email hoặc password không đúng" });
    }

    // Tạo token và set cookie
    const token = generateToken(user._id);
    setCookie(res, token);

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      displayName: user.displayName,
      dashboardBg: user.dashboardBg || "",
      token,
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        message: "Dữ liệu không hợp lệ",
        errors: error.errors,
      });
    }
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Lấy thông tin user hiện tại
 * @access  Private
 */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   POST /api/auth/logout
 * @desc    Đăng xuất
 * @access  Private
 */
export const logout = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    res.json({ message: "Đăng xuất thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   PUT /api/auth/update-profile
 * @desc    Cập nhật thông tin user (displayName)
 * @access  Private
 */
export const updateProfile = async (req, res) => {
  try {
    const { displayName } = req.body;

    if (!displayName || displayName.trim().length === 0) {
      return res.status(400).json({ message: "Tên hiển thị không được để trống" });
    }

    if (displayName.length > 50) {
      return res.status(400).json({ message: "Tên hiển thị không được quá 50 ký tự" });
    }

    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: "User không tồn tại" });
    }

    user.displayName = displayName.trim();
    await user.save();

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      displayName: user.displayName,
      message: "Cập nhật thông tin thành công"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   PUT /api/auth/update-dashboard-bg
 * @desc    Cập nhật ảnh nền Dashboard
 * @access  Private
 */
export const updateDashboardBg = async (req, res) => {
  try {
    const { dashboardBg } = req.body;

    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: "User không tồn tại" });
    }

    user.dashboardBg = dashboardBg || "";
    await user.save();

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      displayName: user.displayName,
      dashboardBg: user.dashboardBg,
      message: "Cập nhật ảnh nền thành công"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   PUT /api/auth/change-password
 * @desc    Đổi mật khẩu
 * @access  Private
 */
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Mật khẩu mới phải có ít nhất 6 ký tự" });
    }

    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: "User không tồn tại" });
    }

    // Kiểm tra mật khẩu hiện tại
    const isMatch = await user.comparePassword(currentPassword);
    
    if (!isMatch) {
      return res.status(401).json({ message: "Mật khẩu hiện tại không đúng" });
    }

    // Cập nhật mật khẩu mới
    user.password = newPassword;
    await user.save();

    res.json({ message: "Đổi mật khẩu thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Gửi mã OTP về email để reset password
 * @access  Public
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Vui lòng nhập email" });
    }

    // Kiểm tra user có tồn tại không
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({ message: "Email không tồn tại trong hệ thống" });
    }

    // Tạo mã OTP 6 số
    const otp = generateOTP();

    // Xóa các OTP cũ của email này (nếu có)
    await OTP.deleteMany({ email: email.toLowerCase() });

    // Lưu OTP mới vào database
    await OTP.create({
      email: email.toLowerCase(),
      otp: otp,
    });

    // Gửi email
    await sendOTPEmail(email, otp);

    res.json({ 
      message: "Mã OTP đã được gửi về email của bạn. Vui lòng kiểm tra hộp thư.",
      email: email 
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: error.message || "Có lỗi xảy ra" });
  }
};

/**
 * @route   POST /api/auth/verify-otp
 * @desc    Xác thực mã OTP
 * @access  Public
 */
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
    }

    // Tìm OTP trong database
    const otpRecord = await OTP.findOne({ 
      email: email.toLowerCase(),
      otp: otp.trim(),
    }).sort({ createdAt: -1 }); // Lấy OTP mới nhất

    if (!otpRecord) {
      return res.status(400).json({ message: "Mã OTP không đúng hoặc đã hết hạn" });
    }

    // Đánh dấu OTP đã được verify
    otpRecord.verified = true;
    await otpRecord.save();

    res.json({ 
      message: "Xác thực thành công. Vui lòng nhập mật khẩu mới.",
      verified: true 
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: error.message || "Có lỗi xảy ra" });
  }
};

/**
 * @route   POST /api/auth/reset-password
 * @desc    Đặt lại mật khẩu mới sau khi verify OTP
 * @access  Public
 */
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Mật khẩu mới phải có ít nhất 6 ký tự" });
    }

    // Kiểm tra OTP đã được verify chưa
    const otpRecord = await OTP.findOne({
      email: email.toLowerCase(),
      otp: otp.trim(),
      verified: true,
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).json({ message: "Mã OTP không hợp lệ hoặc chưa được xác thực" });
    }

    // Tìm user và cập nhật mật khẩu
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({ message: "User không tồn tại" });
    }

    user.password = newPassword;
    await user.save();

    // Xóa OTP sau khi đã sử dụng
    await OTP.deleteMany({ email: email.toLowerCase() });

    res.json({ message: "Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay." });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: error.message || "Có lỗi xảy ra" });
  }
};
