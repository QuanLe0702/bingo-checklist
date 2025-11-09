import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, KeyRound } from 'lucide-react';
import axios from 'axios';

/**
 * Trang quên mật khẩu với 3 bước:
 * 1. Nhập email
 * 2. Nhập mã OTP (6 số)
 * 3. Nhập mật khẩu mới
 */
const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState('');
  const [otp, setOTP] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  /**
   * Bước 1: Gửi email để nhận OTP
   */
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Vui lòng nhập email hợp lệ');
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${API_URL}/api/auth/forgot-password`, { email });
      alert('✅ Mã OTP đã được gửi về email của bạn!');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Bước 2: Xác thực mã OTP
   */
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');

    if (!otp || otp.length !== 6) {
      setError('Vui lòng nhập mã OTP 6 số');
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${API_URL}/api/auth/verify-otp`, { email, otp });
      alert('✅ Xác thực thành công!');
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Mã OTP không đúng');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Bước 3: Đặt lại mật khẩu mới
   */
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (!newPassword || newPassword.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${API_URL}/api/auth/reset-password`, {
        email,
        otp,
        newPassword,
      });
      alert('✅ Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
        >
          <ArrowLeft size={20} />
          Quay lại đăng nhập
        </Link>

        {/* Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border-2 border-pink-200">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-2">
              🔐 Quên mật khẩu
            </h1>
            <p className="text-gray-600 text-sm">
              {step === 1 && 'Nhập email để nhận mã xác nhận'}
              {step === 2 && 'Nhập mã OTP đã gửi về email'}
              {step === 3 && 'Tạo mật khẩu mới'}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center gap-2 mb-8">
            <div className={`w-12 h-1 rounded-full ${step >= 1 ? 'bg-pink-500' : 'bg-gray-300'}`} />
            <div className={`w-12 h-1 rounded-full ${step >= 2 ? 'bg-pink-500' : 'bg-gray-300'}`} />
            <div className={`w-12 h-1 rounded-full ${step >= 3 ? 'bg-pink-500' : 'bg-gray-300'}`} />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
              ⚠️ {error}
            </div>
          )}

          {/* Step 1: Email */}
          {step === 1 && (
            <form onSubmit={handleSendOTP}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail size={16} className="inline mr-1" />
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none transition-colors"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full py-3 text-lg"
              >
                {loading ? 'Đang gửi...' : 'Gửi mã OTP'}
              </button>
            </form>
          )}

          {/* Step 2: OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyOTP}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <KeyRound size={16} className="inline mr-1" />
                  Mã OTP (6 số)
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOTP(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  maxLength={6}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none transition-colors text-center text-2xl tracking-widest font-mono"
                  required
                />
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Mã OTP đã được gửi về email: <strong>{email}</strong>
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full py-3 text-lg"
              >
                {loading ? 'Đang xác thực...' : 'Xác thực OTP'}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn btn-secondary w-full py-2 text-sm mt-3"
              >
                Gửi lại mã
              </button>
            </form>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <form onSubmit={handleResetPassword}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Lock size={16} className="inline mr-1" />
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Ít nhất 6 ký tự"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none transition-colors"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Lock size={16} className="inline mr-1" />
                  Xác nhận mật khẩu
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none transition-colors"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full py-3 text-lg"
              >
                {loading ? 'Đang cập nhật...' : 'Đặt lại mật khẩu'}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Nhớ mật khẩu rồi?{' '}
          <Link to="/login" className="text-pink-600 hover:text-pink-700 font-semibold">
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
