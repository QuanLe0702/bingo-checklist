import React, { useEffect } from 'react';
import useBoardStore from '../store/boardStore';
import { useNavigate } from 'react-router-dom';

/**
 * Component hiển thị thư viện templates
 */
const TemplateGallery = () => {
  const { templates, loading, fetchTemplates, createFromTemplate } = useBoardStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleUseTemplate = async (templateId) => {
    try {
      const newBoard = await createFromTemplate(templateId);
      navigate(`/board/${newBoard._id}`);
    } catch (error) {
      console.error('Error creating from template:', error);
      alert('Có lỗi khi tạo board từ template');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Đang tải...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <div
          key={template._id}
          className="card hover:shadow-xl transition-shadow cursor-pointer"
          onClick={() => handleUseTemplate(template._id)}
        >
          <div className="flex items-start gap-3 mb-3">
            <div className="text-3xl">{template.cells[0]?.emoji || '📋'}</div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{template.title}</h3>
              <p className="text-sm text-gray-600">{template.description}</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>
              {template.size.rows}×{template.size.cols}
            </span>
            <button className="btn btn-primary text-sm py-1 px-3">
              Sử dụng
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TemplateGallery;
