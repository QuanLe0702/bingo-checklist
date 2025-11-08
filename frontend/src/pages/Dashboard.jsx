import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useBoardStore from '../store/boardStore';
import useAuthStore from '../store/authStore';
import { Plus, Trash2, Edit, Play } from 'lucide-react';

/**
 * Trang Dashboard - hiển thị danh sách boards của user
 */
const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { boards, loading, fetchBoards, deleteBoard } = useBoardStore();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchBoards();
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            🎯 Bingo Checklist
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Xin chào, {user?.displayName || user?.username}
            </span>
            <button onClick={logout} className="btn btn-secondary text-sm">
              {t('logout')}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">{t('myBoards')}</h1>
          <button onClick={handleCreateNew} className="btn btn-primary flex items-center gap-2">
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
              <div key={board._id} className="card hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{board.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {board.description}
                    </p>
                  </div>
                  <div
                    className="w-8 h-8 rounded"
                    style={{ backgroundColor: board.theme?.primary || '#3b82f6' }}
                  />
                </div>

                <div className="text-xs text-gray-500 mb-4">
                  {board.size.rows}×{board.size.cols} •{' '}
                  {new Date(board.updatedAt).toLocaleDateString('vi-VN')}
                </div>

                <div className="flex gap-2">
                  <Link
                    to={`/board/${board._id}`}
                    className="btn btn-secondary flex-1 flex items-center justify-center gap-1 text-sm py-2"
                  >
                    <Edit size={16} />
                    Sửa
                  </Link>
                  <Link
                    to={`/board/${board._id}/play`}
                    className="btn btn-primary flex-1 flex items-center justify-center gap-1 text-sm py-2"
                  >
                    <Play size={16} />
                    Chơi
                  </Link>
                  <button
                    onClick={() => handleDelete(board._id)}
                    className="btn bg-red-500 text-white hover:bg-red-600 px-3 py-2"
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

export default Dashboard;
