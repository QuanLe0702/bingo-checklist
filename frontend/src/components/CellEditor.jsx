import React, { useState } from 'react';
import { X } from 'lucide-react';

/**
 * Component chỉnh sửa nội dung của 1 cell
 */
const CellEditor = ({ cell, onSave, onClose }) => {
  const [text, setText] = useState(cell.text || '');
  const [emoji, setEmoji] = useState(cell.emoji || '');
  const [note, setNote] = useState(cell.note || '');

  const handleSave = () => {
    onSave({
      ...cell,
      text,
      emoji,
      note,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Chỉnh sửa ô {cell.id}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Emoji/Icon
            </label>
            <input
              type="text"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              placeholder="🎯"
              className="input"
              maxLength={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Nội dung nhiệm vụ *
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Nhập nội dung..."
              className="input resize-none"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Ghi chú
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ghi chú thêm..."
              className="input"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <button onClick={handleSave} className="btn btn-primary flex-1">
              Lưu
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

export default CellEditor;
