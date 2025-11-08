import React, { useState } from 'react';

/**
 * Component chọn theme (màu sắc, font)
 */
const ThemePicker = ({ currentTheme, onThemeChange }) => {
  const [theme, setTheme] = useState(currentTheme || {
    primary: '#3b82f6',
    bg: '#ffffff',
    textColor: '#1f2937',
    fontFamily: 'Inter',
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

  const handleColorChange = (key, value) => {
    const newTheme = { ...theme, [key]: value };
    setTheme(newTheme);
    onThemeChange(newTheme);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold mb-3">Màu chủ đề</h3>
        <div className="grid grid-cols-3 gap-2">
          {colorPresets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handleColorPreset(preset)}
              className="p-3 rounded-lg border-2 transition-all hover:scale-105"
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
        <h3 className="text-sm font-semibold mb-3">Tùy chỉnh màu</h3>
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
        <h3 className="text-sm font-semibold mb-3">Font chữ</h3>
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
    </div>
  );
};

export default ThemePicker;
