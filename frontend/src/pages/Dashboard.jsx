import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useBoardStore from '../store/boardStore';
import useAuthStore from '../store/authStore';
import { Plus, Trash2, Edit, Play, Settings, Upload, X } from 'lucide-react';
import axios from 'axios';

/**
 * Trang Dashboard - hiển thị danh sách boards của user
 */
const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuthStore();
  const { boards, loading, fetchBoards, deleteBoard } = useBoardStore();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [dashboardBg, setDashboardBg] = useState(user?.dashboardBg || '');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchBoards();
    setDashboardBg(user.dashboardBg || '');
  }, [user]);

  const handleCreateNew = () => {
    setShowCreateDialog(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa bảng Bingo này?')) {
      try {
        await deleteBoard(id);
      } catch (error) {
        alert('Có lỗi khi xóa board');
      }
    }
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 relative"
      style={{
        backgroundImage: dashboardBg ? `url(${dashboardBg})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b-2 border-pink-200 relative z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent flex items-center gap-2">
            🎯 Bingo Checklist
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowSettingsDialog(true)}
              className="btn btn-secondary flex items-center gap-2"
              title="Cài đặt giao diện"
            >
              <Settings size={18} />
            </button>
            <Link
              to="/profile"
              className="text-sm text-gray-600 bg-white px-3 py-1.5 rounded-full shadow-sm hover:shadow-md hover:bg-pink-50 transition-all cursor-pointer"
              title="Xem thông tin cá nhân"
            >
              👋 {user?.displayName || user?.username}
            </Link>
            <button onClick={logout} className="btn btn-secondary text-sm">
              {t('logout')}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            ✨ {t('myBoards')}
          </h1>
          <button onClick={handleCreateNew} className="btn btn-primary flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow">
            <Plus size={20} />
            {t('createBoard')}
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">Đang tải...</div>
        ) : boards.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-xl text-gray-600 mb-4">{t('noBoards')}</p>
            <button onClick={handleCreateNew} className="btn btn-primary">
              {t('createBoard')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {boards.map((board) => (
              <div key={board._id} className="card hover:shadow-2xl transition-all hover:-translate-y-1 border-2 border-transparent hover:border-pink-300 bg-white/80 backdrop-blur-sm">
                <div className="mb-3">
                  <h3 className="text-lg font-semibold mb-1 text-gray-800">{board.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {board.description}
                  </p>
                </div>

                <div className="text-xs text-gray-500 mb-4 flex items-center gap-2">
                  <span className="bg-pink-100 text-pink-700 px-2 py-1 rounded-full font-medium">
                    {board.size.rows}×{board.size.cols}
                  </span>
                  <span>•</span>
                  <span>
                    {board.startDate && board.endDate ? (
                      `Start(${new Date(board.startDate).toLocaleDateString('en-GB')}) - End(${new Date(board.endDate).toLocaleDateString('en-GB')})`
                    ) : board.startDate ? (
                      `Start(${new Date(board.startDate).toLocaleDateString('en-GB')})`
                    ) : board.endDate ? (
                      `End(${new Date(board.endDate).toLocaleDateString('en-GB')})`
                    ) : (
                      new Date(board.updatedAt).toLocaleDateString('vi-VN')
                    )}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Link
                    to={`/board/${board._id}`}
                    className="btn btn-secondary flex-1 flex items-center justify-center gap-1 text-sm py-2 hover:bg-gray-100"
                  >
                    <Edit size={16} />
                    Sửa
                  </Link>
                  <Link
                    to={`/board/${board._id}/play`}
                    className="btn btn-primary flex-1 flex items-center justify-center gap-1 text-sm py-2 shadow-md"
                  >
                    <Play size={16} />
                    Chơi
                  </Link>
                  <button
                    onClick={() => handleDelete(board._id)}
                    className="btn bg-red-500 text-white hover:bg-red-600 px-3 py-2 shadow-md"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Dialog */}
      {showCreateDialog && (
        <CreateBoardDialog onClose={() => setShowCreateDialog(false)} />
      )}

      {/* Settings Dialog */}
      {showSettingsDialog && (
        <DashboardSettingsDialog
          currentBg={dashboardBg}
          onSave={async (newBg) => {
            try {
              const token = localStorage.getItem('token');
              const response = await axios.put(
                `${API_URL}/api/auth/update-dashboard-bg`,
                { dashboardBg: newBg },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              
              // Cập nhật user trong store
              updateUser(response.data);
              setDashboardBg(newBg);
              setShowSettingsDialog(false);
              alert('✅ Đã lưu ảnh nền Dashboard!');
            } catch (error) {
              console.error('Update dashboard bg error:', error);
              alert('❌ Có lỗi khi lưu ảnh nền');
            }
          }}
          onClose={() => setShowSettingsDialog(false)}
        />
      )}
    </div>
  );
};

/**
 * Dialog tạo board mới
 */
const CreateBoardDialog = ({ onClose }) => {
  const navigate = useNavigate();
  const { createBoard } = useBoardStore();
  const [title, setTitle] = useState('');
  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(5);

  const handleCreate = async () => {
    if (!title.trim()) {
      alert('Vui lòng nhập tên board');
      return;
    }

    try {
      const newBoard = await createBoard({
        title,
        size: { rows, cols },
      });
      navigate(`/board/${newBoard._id}`);
    } catch (error) {
      alert('Có lỗi khi tạo board');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <h3 className="text-xl font-semibold mb-4">Tạo Bingo Board mới</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tên Board *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My Bingo Board"
              className="input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Số hàng</label>
              <input
                type="number"
                value={rows}
                onChange={(e) => setRows(Math.min(10, Math.max(2, +e.target.value)))}
                min={2}
                max={10}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Số cột</label>
              <input
                type="number"
                value={cols}
                onChange={(e) => setCols(Math.min(10, Math.max(2, +e.target.value)))}
                min={2}
                max={10}
                className="input"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <button onClick={handleCreate} className="btn btn-primary flex-1">
              Tạo
            </button>
            <button onClick={onClose} className="btn btn-secondary flex-1">
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Dialog cài đặt Dashboard
 */
const DashboardSettingsDialog = ({ currentBg, onSave, onClose }) => {
  const [bgImage, setBgImage] = useState(currentBg);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Ảnh quá lớn! Vui lòng chọn ảnh nhỏ hơn 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          const maxWidth = 1920;
          const maxHeight = 1080;
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
          setBgImage(compressedBase64);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-white to-pink-50 rounded-2xl shadow-2xl max-w-md w-full p-6 border-2 border-pink-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
            <Settings size={24} />
            ⚙️ Cài đặt Dashboard
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-pink-600 transition-colors hover:bg-pink-100 rounded-full p-1"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 flex items-center gap-2">
              <Upload size={16} />
              🖼️ Ảnh nền Dashboard
            </label>
            
            {bgImage ? (
              <div className="relative">
                <img
                  src={bgImage}
                  alt="Dashboard background"
                  className="w-full h-48 object-cover rounded-lg border-2 border-pink-300 shadow-md"
                />
                <button
                  onClick={() => setBgImage('')}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                  title="Xóa ảnh nền"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-pink-300 rounded-lg cursor-pointer hover:border-pink-400 hover:bg-pink-50 transition-all shadow-sm">
                <div className="flex flex-col items-center justify-center">
                  <Upload className="w-12 h-12 mb-3 text-pink-400" />
                  <p className="mb-2 text-sm text-gray-600">
                    <span className="font-semibold">✨ Click để chọn ảnh nền</span>
                  </p>
                  <p className="text-xs text-gray-400">PNG, JPG, GIF (Tối ưu: 1920×1080)</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            )}

            <p className="text-xs text-gray-500 mt-2">
              💡 Mẹo: Chọn ảnh sáng màu, có độ tương phản thấp để card dễ đọc
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <button
              onClick={() => onSave(bgImage)}
              className="btn btn-primary flex-1 shadow-lg"
            >
              💾 Lưu
            </button>
            <button onClick={onClose} className="btn btn-secondary flex-1">
              ❌ Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
