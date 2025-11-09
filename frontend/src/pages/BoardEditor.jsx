import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import useBoardStore from '../store/boardStore';
import CellEditor from '../components/CellEditor';
import ThemePicker from '../components/ThemePicker';
import ShareDialog from '../components/ShareDialog';
import { ArrowLeft, Save, Share2, Settings, Play } from 'lucide-react';

/**
 * Trang chỉnh sửa Board (BoardEditor)
 */
const BoardEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentBoard, fetchBoard, updateBoard } = useBoardStore();

  const [board, setBoard] = useState(null);
  const [editingCell, setEditingCell] = useState(null);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  /**
   * Lấy border-radius dựa vào cellShape
   */
  const getCellBorderRadius = (shape) => {
    const shapes = {
      square: '0.5rem',
      circle: '50%',
      heart: '50% 50% 0 0',
      oval: '50%',
      diamond: '0.5rem',
      hexagon: '0.5rem',
      rounded: '1.5rem',
    };
    return shapes[shape] || '0.5rem';
  };

  /**
   * Lấy clip-path cho hình dạng đặc biệt
   */
  const getCellClipPath = (shape) => {
    const shapes = {
      heart: 'path("M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z")',
      diamond: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
      hexagon: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
    };
    return shapes[shape] || 'none';
  };

  /**
   * Render emoji với layout thông minh
   * 1-3 emoji: 1 hàng
   * 4 emoji: 2x2 grid
   * 5-6 emoji: 3 trên, 2-3 dưới
   */
  const renderEmoji = (emoji) => {
    if (!emoji) return null;
    
    const emojis = [...emoji]; // Tách thành mảng emoji
    const count = emojis.length;
    
    if (count <= 3) {
      // 1-3 emoji: hiển thị 1 hàng
      return (
        <div className="flex justify-center gap-1 mb-2">
          {emojis.map((e, i) => (
            <span key={i} className="text-2xl">{e}</span>
          ))}
        </div>
      );
    } else if (count === 4) {
      // 4 emoji: 2x2 grid
      return (
        <div className="flex flex-col items-center gap-1 mb-2">
          <div className="flex gap-1">
            {emojis.slice(0, 2).map((e, i) => (
              <span key={i} className="text-2xl">{e}</span>
            ))}
          </div>
          <div className="flex gap-1">
            {emojis.slice(2, 4).map((e, i) => (
              <span key={i} className="text-2xl">{e}</span>
            ))}
          </div>
        </div>
      );
    } else {
      // 5-6 emoji: 3 trên, 2-3 dưới
      return (
        <div className="flex flex-col items-center gap-1 mb-2">
          <div className="flex gap-1">
            {emojis.slice(0, 3).map((e, i) => (
              <span key={i} className="text-2xl">{e}</span>
            ))}
          </div>
          <div className="flex gap-1">
            {emojis.slice(3).map((e, i) => (
              <span key={i} className="text-2xl">{e}</span>
            ))}
          </div>
        </div>
      );
    }
  };

  useEffect(() => {
    fetchBoard(id);
  }, [id]);

  useEffect(() => {
    if (currentBoard) {
      setBoard(currentBoard);
    }
  }, [currentBoard]);

  const handleCellClick = (cell) => {
    setEditingCell(cell);
  };

  const handleSaveCell = (updatedCell) => {
    const newCells = board.cells.map((c) =>
      c.id === updatedCell.id ? updatedCell : c
    );
    const updatedBoard = { ...board, cells: newCells };
    setBoard(updatedBoard);
    console.log('Updated cell:', updatedCell);
    console.log('Board after cell update:', updatedBoard);
  };

  const handleThemeChange = (newTheme) => {
    const updatedBoard = { ...board, theme: newTheme };
    setBoard(updatedBoard);
  };

  const handleSave = async () => {
    try {
      console.log('Saving board:', board);
      const savedBoard = await updateBoard(id, {
        title: board.title,
        description: board.description,
        startDate: board.startDate,
        endDate: board.endDate,
        cells: board.cells,
        theme: board.theme,
      });
      // Cập nhật state với dữ liệu vừa lưu (giữ nguyên dữ liệu local)
      // Không fetch lại để tránh mất ảnh
      console.log('Save successful');
      alert('✅ Đã lưu!');
    } catch (error) {
      console.error('Save error:', error);
      if (error.response?.data?.message) {
        alert(`❌ Lỗi: ${error.response.data.message}`);
      } else {
        alert('❌ Có lỗi khi lưu. Ảnh có thể quá lớn, vui lòng thử ảnh nhỏ hơn.');
      }
    }
  };

  const handleShare = async () => {
    try {
      const { shareUrl } = await useBoardStore.getState().shareBoard(id);
      setShareUrl(shareUrl);
      setShowShareDialog(true);
    } catch (error) {
      alert('Có lỗi khi tạo link chia sẻ');
    }
  };

  if (!board) {
    return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10 border-b-2 border-pink-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link to="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-pink-600 transition-colors font-medium">
              <ArrowLeft size={20} />
              Quay lại
            </Link>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowThemePicker(!showThemePicker)}
                className={`btn ${showThemePicker ? 'bg-pink-500 text-white hover:bg-pink-600' : 'btn-secondary'} flex items-center gap-2 shadow-md`}
                title="Tùy chỉnh giao diện & hình nền"
              >
                <Settings size={18} />
                Giao diện
              </button>
              <button onClick={handleShare} className="btn btn-secondary flex items-center gap-2 shadow-md">
                <Share2 size={18} />
                Chia sẻ
              </button>
              <button onClick={handleSave} className="btn btn-primary flex items-center gap-2 shadow-md">
                <Save size={18} />
                Lưu
              </button>
              <Link to={`/board/${id}/play`} className="btn bg-green-600 text-white hover:bg-green-700 flex items-center gap-2 shadow-md">
                <Play size={18} />
                Chơi
              </Link>
            </div>
          </div>

          {/* Board Info */}
          <div className="space-y-2">
            <input
              type="text"
              value={board.title}
              onChange={(e) => setBoard({ ...board, title: e.target.value })}
              className="text-2xl font-bold border-b-2 border-transparent hover:border-pink-300 focus:border-pink-500 outline-none px-2 py-1 w-full bg-transparent"
              placeholder="Tên board"
            />
            <input
              type="text"
              value={board.description}
              onChange={(e) => setBoard({ ...board, description: e.target.value })}
              className="text-gray-600 border-b-2 border-transparent hover:border-pink-300 focus:border-pink-500 outline-none px-2 py-1 w-full bg-transparent"
              placeholder="Mô tả (không bắt buộc)"
            />
            
            {/* Date Range */}
            <div className="flex gap-4 mt-3">
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">📅 Ngày bắt đầu</label>
                <input
                  type="date"
                  value={board.startDate ? (typeof board.startDate === 'string' ? board.startDate.split('T')[0] : new Date(board.startDate).toISOString().split('T')[0]) : ''}
                  onChange={(e) => setBoard({ ...board, startDate: e.target.value || null })}
                  className="text-sm border-2 border-gray-200 hover:border-pink-300 focus:border-pink-500 outline-none px-3 py-2 rounded-lg w-full bg-white"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">🏁 Ngày kết thúc</label>
                <input
                  type="date"
                  value={board.endDate ? (typeof board.endDate === 'string' ? board.endDate.split('T')[0] : new Date(board.endDate).toISOString().split('T')[0]) : ''}
                  onChange={(e) => setBoard({ ...board, endDate: e.target.value || null })}
                  className="text-sm border-2 border-gray-200 hover:border-pink-300 focus:border-pink-500 outline-none px-3 py-2 rounded-lg w-full bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Board Grid */}
          <div className={`${showThemePicker ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
            <div className="flex justify-center">
              <div
                className="grid gap-3 p-6 rounded-xl bg-white/80 backdrop-blur-sm shadow-xl border-2 border-pink-200 relative overflow-hidden"
                style={{
                  gridTemplateColumns: `repeat(${board.size.cols}, minmax(0, 1fr))`,
                  maxWidth: '800px',
                }}
              >
                {/* Board background image */}
                {board.theme?.bgImage && (
                  <div
                    className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{
                      backgroundImage: `url(${board.theme.bgImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                    }}
                  />
                )}

                {board.cells.map((cell) => (
                  <div
                    key={cell.id}
                    onClick={() => handleCellClick(cell)}
                    className="aspect-square flex flex-col items-center justify-center border-2 p-3 cursor-pointer hover:scale-105 transition-all relative overflow-hidden z-10"
                    style={{
                      borderColor: board.theme?.primary || '#3b82f6',
                      backgroundColor: cell.bgColor || board.theme?.bg || '#ffffff',
                      color: board.theme?.textColor || '#1f2937',
                      fontFamily: board.theme?.fontFamily || 'Inter',
                      borderRadius: getCellBorderRadius(board.theme?.cellShape || 'square'),
                      clipPath: getCellClipPath(board.theme?.cellShape || 'square'),
                    }}
                  >
                    {/* Cell background image */}
                    {cell.bgImage && (
                      <div
                        className="absolute inset-0 opacity-30 pointer-events-none"
                        style={{
                          backgroundImage: `url(${cell.bgImage})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat',
                        }}
                      />
                    )}
                    
                    <div className="relative z-10">
                      {renderEmoji(cell.emoji)}
                      <div className="text-sm text-center font-medium line-clamp-3">
                        {cell.text || 'Click để chỉnh sửa'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Theme Picker Sidebar */}
          {showThemePicker && (
            <div className="lg:col-span-1">
              <div className="card sticky top-24 bg-white/80 backdrop-blur-sm border-2 border-pink-200 shadow-xl">
                <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
                  <Settings size={24} />
                  Tùy chỉnh giao diện
                </h2>
                <ThemePicker currentTheme={board.theme} onThemeChange={handleThemeChange} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cell Editor Modal */}
      {editingCell && (
        <CellEditor
          cell={editingCell}
          onSave={handleSaveCell}
          onClose={() => setEditingCell(null)}
        />
      )}

      {/* Share Dialog */}
      {showShareDialog && (
        <ShareDialog shareUrl={shareUrl} onClose={() => setShowShareDialog(false)} />
      )}
    </div>
  );
};

export default BoardEditor;
