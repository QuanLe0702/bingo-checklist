import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import useBoardStore from '../store/boardStore';
import CellEditor from '../components/CellEditor';
import ThemePicker from '../components/ThemePicker';
import ShareDialog from '../components/ShareDialog';
import { ArrowLeft, Save, Share2, Palette, Play } from 'lucide-react';

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
    setBoard({ ...board, cells: newCells });
  };

  const handleThemeChange = (newTheme) => {
    setBoard({ ...board, theme: newTheme });
  };

  const handleSave = async () => {
    try {
      await updateBoard(id, {
        title: board.title,
        description: board.description,
        cells: board.cells,
        theme: board.theme,
      });
      alert('✅ Đã lưu!');
    } catch (error) {
      alert('❌ Có lỗi khi lưu');
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link to="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft size={20} />
              Quay lại
            </Link>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowThemePicker(!showThemePicker)}
                className="btn btn-secondary flex items-center gap-2"
              >
                <Palette size={18} />
                Theme
              </button>
              <button onClick={handleShare} className="btn btn-secondary flex items-center gap-2">
                <Share2 size={18} />
                Chia sẻ
              </button>
              <button onClick={handleSave} className="btn btn-primary flex items-center gap-2">
                <Save size={18} />
                Lưu
              </button>
              <Link to={`/board/${id}/play`} className="btn bg-green-600 text-white hover:bg-green-700 flex items-center gap-2">
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
              className="text-2xl font-bold border-b-2 border-transparent hover:border-gray-300 focus:border-blue-500 outline-none px-2 py-1 w-full"
              placeholder="Tên board"
            />
            <input
              type="text"
              value={board.description}
              onChange={(e) => setBoard({ ...board, description: e.target.value })}
              className="text-gray-600 border-b-2 border-transparent hover:border-gray-300 focus:border-blue-500 outline-none px-2 py-1 w-full"
              placeholder="Mô tả (không bắt buộc)"
            />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Board Grid */}
          <div className="lg:col-span-2">
            <div
              className="grid gap-3 p-6 rounded-xl bg-white shadow-lg"
              style={{
                gridTemplateColumns: `repeat(${board.size.cols}, minmax(0, 1fr))`,
              }}
            >
              {board.cells.map((cell) => (
                <div
                  key={cell.id}
                  onClick={() => handleCellClick(cell)}
                  className="aspect-square flex flex-col items-center justify-center border-2 rounded-lg p-3 cursor-pointer hover:scale-105 transition-all"
                  style={{
                    borderColor: board.theme?.primary || '#3b82f6',
                    backgroundColor: board.theme?.bg || '#ffffff',
                    color: board.theme?.textColor || '#1f2937',
                    fontFamily: board.theme?.fontFamily || 'Inter',
                  }}
                >
                  {cell.emoji && <div className="text-3xl mb-2">{cell.emoji}</div>}
                  <div className="text-sm text-center font-medium line-clamp-3">
                    {cell.text || 'Click để chỉnh sửa'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Theme Picker Sidebar */}
          {showThemePicker && (
            <div className="lg:col-span-1">
              <div className="card sticky top-24">
                <h2 className="text-xl font-semibold mb-4">Tùy chỉnh giao diện</h2>
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
