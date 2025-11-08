import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../store/authStore';

/**
 * Trang chủ / Landing page
 */
const Home = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            🎯 {t('appTitle')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8">
            {t('appSubtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <>
                <Link to="/dashboard" className="btn btn-primary text-lg px-8 py-3">
                  {t('dashboard')}
                </Link>
                <Link to="/templates" className="btn btn-secondary text-lg px-8 py-3">
                  {t('viewTemplates')}
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary text-lg px-8 py-3">
                  {t('register')}
                </Link>
                <Link to="/login" className="btn btn-secondary text-lg px-8 py-3">
                  {t('login')}
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-16">
          <div className="card text-center">
            <div className="text-5xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-2">Tạo Bingo tùy chỉnh</h3>
            <p className="text-gray-600">
              Tạo bảng Bingo với kích thước và nội dung theo ý bạn
            </p>
          </div>

          <div className="card text-center">
            <div className="text-5xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold mb-2">Tùy chỉnh giao diện</h3>
            <p className="text-gray-600">
              Chọn màu sắc, font chữ, emoji để bảng Bingo thêm sinh động
            </p>
          </div>

          <div className="card text-center">
            <div className="text-5xl mb-4">🔗</div>
            <h3 className="text-xl font-semibold mb-2">Chia sẻ dễ dàng</h3>
            <p className="text-gray-600">
              Tạo link public để chia sẻ bảng Bingo với bạn bè
            </p>
          </div>
        </div>

        {/* Templates Preview */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold mb-8">Template mẫu</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
            {['🎄 Noel', '🎂 Sinh nhật', '📚 Tiếng Anh', '⚡ Năng suất', '💪 Fitness'].map(
              (name) => (
                <div
                  key={name}
                  className="card hover:shadow-xl transition-shadow text-center py-6"
                >
                  <div className="text-4xl mb-2">{name.split(' ')[0]}</div>
                  <div className="text-sm font-medium">{name.split(' ')[1]}</div>
                </div>
              )
            )}
          </div>
          <Link
            to="/templates"
            className="inline-block mt-8 btn btn-primary text-lg px-8 py-3"
          >
            Xem tất cả templates
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
