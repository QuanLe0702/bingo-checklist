import React, { useState } from 'react';
import { X, Smile, Upload } from 'lucide-react';

/**
 * Component chỉnh sửa nội dung của 1 cell
 */
const CellEditor = ({ cell, onSave, onClose }) => {
  const [text, setText] = useState(cell.text || '');
  const [emoji, setEmoji] = useState(cell.emoji || '');
  const [note, setNote] = useState(cell.note || '');
  const [bgColor, setBgColor] = useState(cell.bgColor || '');
  const [bgImage, setBgImage] = useState(cell.bgImage || '');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Đếm số lượng emoji thực tế (sử dụng spread operator)
  const countEmojis = (str) => {
    return [...str].length;
  };

  // Danh sách emoji phổ biến
  const emojiList = [
    '🎯', '✅', '💪', '🎉', '🎁', '🎄', '🎂', '🎈',
    '📚', '📝', '💻', '☕', '🏃', '🏋️', '🧘', '🎮',
    '🎵', '🎨', '📱', '🌟', '⭐', '🔥', '💡', '🚀',
    '❤️', '💙', '💚', '💛', '🧡', '💜', '🖤', '🤍',
    '👍', '👏', '🙌', '🤝', '💪', '🎊', '🌈', '☀️',
    '🌙', '⚡', '🌸', '🌺', '🌻', '🌹', '🍀', '🌿',
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Kiểm tra kích thước file (giới hạn 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Ảnh quá lớn! Vui lòng chọn ảnh nhỏ hơn 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        // Nén ảnh trước khi lưu
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Giới hạn kích thước tối đa (giảm xuống để tránh lỗi)
          const maxWidth = 600;
          const maxHeight = 600;
          let width = img.width;
          let height = img.height;
          
          // Tính toán kích thước mới
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
          
          // Chuyển sang base64 với chất lượng thấp hơn để giảm dung lượng
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.5);
          
          // Kiểm tra kích thước sau nén
          if (compressedBase64.length > 500000) { // ~500KB
            alert('⚠️ Ảnh vẫn quá lớn sau khi nén. Vui lòng chọn ảnh nhỏ hơn hoặc đơn giản hơn.');
            return;
          }
          
          setBgImage(compressedBase64);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave({
      ...cell,
      text,
      emoji,
      note,
      bgColor,
      bgImage,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-white to-pink-50 rounded-2xl shadow-2xl max-w-md w-full p-6 border-2 border-pink-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            ✏️ Chỉnh sửa ô {cell.id}
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
            <label className="block text-sm font-medium mb-1">
              Emoji/Icon
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={emoji}
                onChange={(e) => {
                  // Chỉ cho phép tối đa 6 emoji
                  if (countEmojis(e.target.value) <= 6) {
                    setEmoji(e.target.value);
                  }
                }}
                placeholder="🎯🎉🎁"
                className="input flex-1"
              />
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="btn btn-secondary px-4"
                title="Chọn emoji"
              >
                <Smile size={20} />
              </button>
            </div>
            
            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div className="mt-2 p-3 border-2 border-pink-200 rounded-lg bg-gradient-to-br from-pink-50 to-purple-50 max-h-40 overflow-y-auto shadow-inner">
                <div className="grid grid-cols-8 gap-2">
                  {emojiList.map((e, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        if (countEmojis(emoji) < 6) {
                          setEmoji(emoji + e);
                        } else {
                          alert('Max icon rồi bà dà');
                        }
                      }}
                      className="text-2xl hover:bg-white hover:scale-110 rounded-lg p-1 transition-all shadow-sm"
                      title={e}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            )}
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

          <div>
            <label className="block text-sm font-medium mb-1">
              Màu nền ô (tùy chọn)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={bgColor || '#ffffff'}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-16 h-10 rounded cursor-pointer border-2"
              />
              <span className="text-sm text-gray-600 flex-1">
                {bgColor || 'Mặc định'}
              </span>
              {bgColor && (
                <button
                  type="button"
                  onClick={() => setBgColor('')}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Xóa màu
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Ảnh nền ô (tùy chọn)
            </label>
            {bgImage ? (
              <div className="relative">
                <img
                  src={bgImage}
                  alt="Cell background"
                  className="w-full h-24 object-cover rounded-lg border-2 border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => setBgImage('')}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  title="Xóa ảnh"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col items-center justify-center">
                  <Upload className="w-6 h-6 mb-1 text-gray-400" />
                  <p className="text-xs text-gray-500">Click để tải ảnh</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <button onClick={handleSave} className="btn btn-primary flex-1 shadow-lg">
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

export default CellEditor;
