import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useBoardStore from '../store/boardStore';
import BoardGrid from '../components/BoardGrid';

/**
 * Trang xem Board công khai (PublicView)
 */
const PublicView = () => {
  const { slug } = useParams();
  const { currentBoard, fetchPublicBoard, loading, error } = useBoardStore();

  useEffect(() => {
    fetchPublicBoard(slug);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl">Đang tải...</div>
      </div>
    );
  }

  if (error || !currentBoard) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">😢</div>
          <h1 className="text-2xl font-bold mb-2">Board không tồn tại</h1>
          <p className="text-gray-600">Board này không tồn tại hoặc chưa được công khai</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-blue-600">🎯 Bingo Checklist</h1>
            <p className="text-sm text-gray-600">
              Được chia sẻ bởi{' '}
              {currentBoard.ownerId?.displayName || currentBoard.ownerId?.username}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold mb-2">{currentBoard.title}</h2>
            {currentBoard.description && (
              <p className="text-gray-600">{currentBoard.description}</p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4">
            <BoardGrid board={currentBoard} onCellClick={() => {}} readonly />
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-4">
              💡 Đây là bản xem công khai (chỉ đọc)
            </p>
            <a
              href="/"
              className="btn btn-primary inline-flex items-center gap-2"
            >
              Tạo Bingo của riêng bạn
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicView;
