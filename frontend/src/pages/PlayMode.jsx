import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import useBoardStore from '../store/boardStore';
import BoardGrid from '../components/BoardGrid';
import { ArrowLeft, Download, Share2 } from 'lucide-react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import ShareDialog from '../components/ShareDialog';

/**
 * Trang chơi Bingo (Play Mode)
 */
const PlayMode = () => {
  const { id } = useParams();
  const { currentBoard, fetchBoard, toggleCell } = useBoardStore();
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    fetchBoard(id);
  }, [id]);

  const handleCellClick = async (cellId, checked) => {
    try {
      await toggleCell(id, cellId, checked);
    } catch (error) {
      console.error('Error toggling cell:', error);
    }
  };

  const handleExportPNG = async () => {
    const element = document.getElementById('bingo-board');
    if (!element) return;

    try {
      const dataUrl = await toPng(element, { quality: 0.95 });
      const link = document.createElement('a');
      link.download = `${currentBoard.title}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error exporting PNG:', error);
      alert('Có lỗi khi xuất PNG');
    }
  };

  const handleExportPDF = async () => {
    const element = document.getElementById('bingo-board');
    if (!element) return;

    try {
      const dataUrl = await toPng(element, { quality: 0.95 });
      const pdf = new jsPDF();
      const imgWidth = 190;
      const imgHeight = (element.offsetHeight * imgWidth) / element.offsetWidth;
      pdf.addImage(dataUrl, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save(`${currentBoard.title}.pdf`);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Có lỗi khi xuất PDF');
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

  if (!currentBoard) {
    return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft size={20} />
              Quay lại
            </Link>
            <div className="flex items-center gap-2">
              <button onClick={handleShare} className="btn btn-secondary flex items-center gap-2">
                <Share2 size={18} />
                Chia sẻ
              </button>
              <button onClick={handleExportPNG} className="btn btn-secondary flex items-center gap-2">
                <Download size={18} />
                PNG
              </button>
              <button onClick={handleExportPDF} className="btn btn-secondary flex items-center gap-2">
                <Download size={18} />
                PDF
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-2">{currentBoard.title}</h1>
            {currentBoard.description && (
              <p className="text-gray-600">{currentBoard.description}</p>
            )}
          </div>

          <div id="bingo-board" className="bg-white rounded-xl shadow-lg p-4">
            <BoardGrid board={currentBoard} onCellClick={handleCellClick} />
          </div>

          <div className="mt-6 text-center text-sm text-gray-600">
            Click vào các ô để đánh dấu hoàn thành. Khi đủ hàng ngang/dọc/chéo, bạn sẽ thắng! 🎉
          </div>
        </div>
      </div>

      {/* Share Dialog */}
      {showShareDialog && (
        <ShareDialog shareUrl={shareUrl} onClose={() => setShowShareDialog(false)} />
      )}
    </div>
  );
};

export default PlayMode;
