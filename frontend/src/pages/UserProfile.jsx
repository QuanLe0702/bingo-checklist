import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { ArrowLeft, User, Lock, Save } from 'lucide-react';
import axios from 'axios';

/**
 * Trang User Profile - Quản lý thông tin cá nhân
 */
const UserProfile = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();

  // State cho form đổi tên
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // State cho form đổi mật khẩu
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  /**
   * Xử lý cập nhật tên hiển thị
   */
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    if (!displayName.trim()) {
      alert('❌ Tên hiển thị không được để trống');
      return;
    }

    setIsUpdatingProfile(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/api/auth/update-profile`,
        { displayName: displayName.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Cập nhật user trong store
      updateUser(response.data);
      alert('✅ Cập nhật tên thành công!');
    } catch (error) {
      console.error('Update profile error:', error);
      alert(`❌ ${error.response?.data?.message || 'Có lỗi xảy ra'}`);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  /**
   * Xử lý đổi mật khẩu
   */
  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Validate
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('❌ Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (newPassword.length < 6) {
      alert('❌ Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('❌ Mật khẩu mới và xác nhận không khớp');
      return;
    }

    setIsChangingPassword(true);

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/api/auth/change-password`,
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('✅ Đổi mật khẩu thành công!');
      
      // Reset form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Change password error:', error);
      alert(`❌ ${error.response?.data?.message || 'Có lỗi xảy ra'}`);
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div 
      className="min-h-screen p-8 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50"
      style={{
        backgroundImage: localStorage.getItem('dashboardBg') 
          ? `url(${localStorage.getItem('dashboardBg')})` 
          : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="btn btn-secondary flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Quay lại
          </button>
          <h1 className="text-3xl font-bold text-gray-800">👤 Thông tin cá nhân</h1>
        </div>

        {/* Thông tin User */}
        <div className="card mb-6 bg-white/90 backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user?.displayName?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{user?.displayName}</h2>
              <p className="text-gray-600">@{user?.username}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Form đổi tên */}
        <div className="card mb-6 bg-white/90 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4">
            <User className="text-pink-500" size={24} />
            <h3 className="text-xl font-semibold text-gray-800">Đổi tên hiển thị</h3>
          </div>
          
          <form onSubmit={handleUpdateProfile}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên hiển thị mới
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Nhập tên hiển thị"
                maxLength={50}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none transition-colors"
              />
              <p className="text-xs text-gray-500 mt-1">
                {displayName.length}/50 ký tự
              </p>
            </div>

            <button
              type="submit"
              disabled={isUpdatingProfile || displayName.trim() === user?.displayName}
              className="btn btn-primary w-full flex items-center justify-center gap-2"
            >
              <Save size={18} />
              {isUpdatingProfile ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </form>
        </div>

        {/* Form đổi mật khẩu */}
        <div className="card bg-white/90 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="text-pink-500" size={24} />
            <h3 className="text-xl font-semibold text-gray-800">Đổi mật khẩu</h3>
          </div>

          <form onSubmit={handleChangePassword}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu hiện tại
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Nhập mật khẩu hiện tại"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none transition-colors"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu mới
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none transition-colors"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Xác nhận mật khẩu mới
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu mới"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isChangingPassword}
              className="btn btn-primary w-full flex items-center justify-center gap-2"
            >
              <Lock size={18} />
              {isChangingPassword ? 'Đang đổi mật khẩu...' : 'Đổi mật khẩu'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
