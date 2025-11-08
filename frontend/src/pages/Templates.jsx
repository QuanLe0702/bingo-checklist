import React from 'react';
import { Link } from 'react-router-dom';
import TemplateGallery from '../components/TemplateGallery';
import { ArrowLeft } from 'lucide-react';

/**
 * Trang hiển thị templates
 */
const Templates = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft size={20} />
              Trang chủ
            </Link>
            <Link to="/" className="text-2xl font-bold text-blue-600">
              🎯 Bingo Checklist
            </Link>
            <Link to="/dashboard" className="btn btn-primary">
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Template Mẫu</h1>
          <p className="text-gray-600">
            Chọn template để bắt đầu hoặc tạo board của riêng bạn
          </p>
        </div>

        <TemplateGallery />
      </div>
    </div>
  );
};

export default Templates;
