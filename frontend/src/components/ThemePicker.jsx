import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';

/**
 * Component chọn theme (màu sắc, font, background image)
 */
const ThemePicker = ({ currentTheme, onThemeChange }) => {
  const [theme, setTheme] = useState(currentTheme || {
    primary: '#3b82f6',
    bg: '#ffffff',
    bgImage: '',
    textColor: '#1f2937',
    fontFamily: 'Inter',
    cellShape: 'square', // Mặc định là vuông
  });

  const colorPresets = [
    { name: 'Blue', primary: '#3b82f6', bg: '#eff6ff' },
    { name: 'Red', primary: '#dc2626', bg: '#fef2f2' },
    { name: 'Green', primary: '#16a34a', bg: '#f0fdf4' },
    { name: 'Purple', primary: '#9333ea', bg: '#faf5ff' },
    { name: 'Pink', primary: '#ec4899', bg: '#fdf2f8' },
    { name: 'Orange', primary: '#ea580c', bg: '#fff7ed' },
  ];

  const fonts = ['Inter', 'Arial', 'Georgia', 'Courier New', 'Comic Sans MS'];

  const cellShapes = [
    { name: 'Vuông', value: 'square', icon: '🟦' },
    { name: 'Tròn', value: 'circle', radius: '50%', icon: '🔴' },
    // { name: 'Trái tim', value: 'heart', radius: '50% 50% 0 0', icon: '❤️' },
    // { name: 'Bầu dục', value: 'oval', radius: '50%/40%', icon: '🥚' },
    // { name: 'Kim cương', value: 'diamond', radius: '0.5rem', icon: '💎' },
    // { name: 'Lục giác', value: 'hexagon', radius: '1rem', icon: '⬡' },
    // { name: 'Bo tròn', value: 'rounded', radius: '1.5rem', icon: '▢' },
  ];

  const handleColorPreset = (preset) => {
    const newTheme = {
      ...theme,
      primary: preset.primary,
      bg: preset.bg,
    };
    setTheme(newTheme);
    onThemeChange(newTheme);
  };

  const handleFontChange = (font) => {
    const newTheme = { ...theme, fontFamily: font };
    setTheme(newTheme);
    onThemeChange(newTheme);
  };

  const handleShapeChange = (shape) => {
    const newTheme = { ...theme, cellShape: shape };
    setTheme(newTheme);
    onThemeChange(newTheme);
  };

  const handleColorChange = (key, value) => {
    const newTheme = { ...theme, [key]: value };
    setTheme(newTheme);
    onThemeChange(newTheme);
  };

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
          
          // Giới hạn kích thước tối đa (giảm để tránh lỗi)
          const maxWidth = 1000;
          const maxHeight = 1000;
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
          
          // Chuyển sang base64 với chất lượng thấp hơn
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
          
          // Kiểm tra kích thước sau nén
          if (compressedBase64.length > 800000) { // ~800KB
            alert('⚠️ Ảnh vẫn quá lớn sau khi nén. Vui lòng chọn ảnh đơn giản hơn hoặc kích thước nhỏ hơn.');
            return;
          }
          
          const newTheme = { ...theme, bgImage: compressedBase64 };
          setTheme(newTheme);
          onThemeChange(newTheme);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    const newTheme = { ...theme, bgImage: '' };
    setTheme(newTheme);
    onThemeChange(newTheme);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold mb-3 text-gray-700">🎨 Màu chủ đề</h3>
        <div className="grid grid-cols-3 gap-2">
          {colorPresets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handleColorPreset(preset)}
              className="p-3 rounded-lg border-2 transition-all hover:scale-110 shadow-sm hover:shadow-md"
              style={{
                borderColor:
                  theme.primary === preset.primary ? preset.primary : '#e5e7eb',
                backgroundColor: preset.bg,
              }}
            >
              <div
                className="w-full h-8 rounded"
                style={{ backgroundColor: preset.primary }}
              />
              <div className="text-xs mt-1 text-center">{preset.name}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3 text-gray-700">🎨 Tùy chỉnh màu</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <label className="text-sm w-24">Màu chính:</label>
            <input
              type="color"
              value={theme.primary}
              onChange={(e) => handleColorChange('primary', e.target.value)}
              className="w-16 h-10 rounded cursor-pointer"
            />
            <span className="text-sm text-gray-600">{theme.primary}</span>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm w-24">Màu nền:</label>
            <input
              type="color"
              value={theme.bg}
              onChange={(e) => handleColorChange('bg', e.target.value)}
              className="w-16 h-10 rounded cursor-pointer"
            />
            <span className="text-sm text-gray-600">{theme.bg}</span>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm w-24">Màu chữ:</label>
            <input
              type="color"
              value={theme.textColor}
              onChange={(e) => handleColorChange('textColor', e.target.value)}
              className="w-16 h-10 rounded cursor-pointer"
            />
            <span className="text-sm text-gray-600">{theme.textColor}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3 text-gray-700">✍️ Font chữ</h3>
        <select
          value={theme.fontFamily}
          onChange={(e) => handleFontChange(e.target.value)}
          className="input"
        >
          {fonts.map((font) => (
            <option key={font} value={font} style={{ fontFamily: font }}>
              {font}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3 text-gray-700">🔷 Hình dạng ô</h3>
        <div className="grid grid-cols-4 gap-2">
          {cellShapes.map((shape) => (
            <button
              key={shape.value}
              onClick={() => handleShapeChange(shape.value)}
              className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                theme.cellShape === shape.value
                  ? 'border-pink-500 bg-pink-50'
                  : 'border-gray-200 bg-white hover:border-pink-300'
              }`}
              title={shape.name}
            >
              <div className="text-2xl mb-1">{shape.icon}</div>
              <div className="text-xs text-gray-600">{shape.name}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3 text-gray-700 flex items-center gap-2">
          <Upload size={16} />
          🖼️ Hình nền board
        </h3>
        <div className="space-y-3">
          {theme.bgImage ? (
            <div className="relative">
              <img
                src={theme.bgImage}
                alt="Background preview"
                className="w-full h-32 object-cover rounded-lg border-2 border-pink-300 shadow-md"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                title="Xóa hình nền"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-pink-300 rounded-lg cursor-pointer hover:border-pink-400 hover:bg-pink-50 transition-all shadow-sm">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-pink-400" />
                <p className="mb-2 text-sm text-gray-600">
                  <span className="font-semibold">✨ Click để tải ảnh lên</span>
                </p>
                <p className="text-xs text-gray-400">PNG, JPG, GIF (Không giới hạn dung lượng)</p>
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
      </div>
    </div>
  );
};

export default ThemePicker;
