import React from 'react';
import confetti from 'canvas-confetti';

/**
 * Component hiển thị bảng Bingo (lưới ô vuông)
 */
const BoardGrid = ({ board, onCellClick, readonly = false }) => {
  const { size, cells, theme } = board;

  /**
   * Lấy border-radius dựa vào cellShape
   */
  const getCellBorderRadius = (shape) => {
    const shapes = {
      square: '0.5rem',
      circle: '50%',
      heart: '50% 50% 0 0',
      oval: '50%',
      diamond: '0.5rem',
      hexagon: '0.5rem',
      rounded: '1.5rem',
    };
    return shapes[shape] || '0.5rem';
  };

  /**
   * Lấy clip-path cho hình dạng đặc biệt
   */
  const getCellClipPath = (shape) => {
    const shapes = {
      heart: 'path("M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z")',
      diamond: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
      hexagon: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
    };
    return shapes[shape] || 'none';
  };

  /**
   * Kiểm tra có Bingo không (hàng ngang, dọc, chéo)
   */
  const checkBingo = () => {
    const { rows, cols } = size;
    const grid = Array(rows)
      .fill(null)
      .map(() => Array(cols).fill(false));

    // Tạo grid từ cells
    cells.forEach((cell) => {
      grid[cell.r][cell.c] = cell.checked;
    });

    // Kiểm tra hàng ngang
    for (let r = 0; r < rows; r++) {
      if (grid[r].every((val) => val)) return true;
    }

    // Kiểm tra hàng dọc
    for (let c = 0; c < cols; c++) {
      if (grid.every((row) => row[c])) return true;
    }

    // Kiểm tra chéo chính (nếu là bảng vuông)
    if (rows === cols) {
      const diag1 = [];
      const diag2 = [];
      for (let i = 0; i < rows; i++) {
        diag1.push(grid[i][i]);
        diag2.push(grid[i][rows - 1 - i]);
      }
      if (diag1.every((val) => val) || diag2.every((val) => val)) {
        return true;
      }
    }

    return false;
  };

  /**
   * Render emoji với layout thông minh
   * 1-3 emoji: 1 hàng
   * 4 emoji: 2x2 grid
   * 5-6 emoji: 3 trên, 2-3 dưới
   */
  const renderEmoji = (emoji) => {
    if (!emoji) return null;
    
    const emojis = [...emoji]; // Tách thành mảng emoji
    const count = emojis.length;
    
    if (count <= 3) {
      // 1-3 emoji: hiển thị 1 hàng
      return (
        <div className="flex justify-center gap-1 mb-1">
          {emojis.map((e, i) => (
            <span key={i} className="text-xl md:text-3xl">{e}</span>
          ))}
        </div>
      );
    } else if (count === 4) {
      // 4 emoji: 2x2 grid
      return (
        <div className="flex flex-col items-center gap-1 mb-1">
          <div className="flex gap-1">
            {emojis.slice(0, 2).map((e, i) => (
              <span key={i} className="text-xl md:text-3xl">{e}</span>
            ))}
          </div>
          <div className="flex gap-1">
            {emojis.slice(2, 4).map((e, i) => (
              <span key={i} className="text-xl md:text-3xl">{e}</span>
            ))}
          </div>
        </div>
      );
    } else {
      // 5-6 emoji: 3 trên, 2-3 dưới
      return (
        <div className="flex flex-col items-center gap-1 mb-1">
          <div className="flex gap-1">
            {emojis.slice(0, 3).map((e, i) => (
              <span key={i} className="text-xl md:text-3xl">{e}</span>
            ))}
          </div>
          <div className="flex gap-1">
            {emojis.slice(3).map((e, i) => (
              <span key={i} className="text-xl md:text-3xl">{e}</span>
            ))}
          </div>
        </div>
      );
    }
  };

  /**
   * Handle click vào cell
   */
  const handleCellClick = (cell) => {
    if (readonly) return;
    
    const newChecked = !cell.checked;
    onCellClick(cell.id, newChecked);

    // Kiểm tra Bingo sau khi update
    setTimeout(() => {
      if (newChecked && checkBingo()) {
        // Hiệu ứng confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
        alert('🎉 BINGO! Chúc mừng bạn!');
      }
    }, 100);
  };

  return (
    <div
      className="grid gap-2 p-4 rounded-xl relative overflow-hidden"
      style={{
        gridTemplateColumns: `repeat(${size.cols}, minmax(0, 1fr))`,
        backgroundColor: theme?.bg || '#ffffff',
        fontFamily: theme?.fontFamily || 'Inter',
      }}
    >
      {/* Background image overlay */}
      {theme?.bgImage && (
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `url(${theme.bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
      )}
      
      {/* Cells */}
      {cells.map((cell) => (
        <div
          key={cell.id}
          onClick={() => handleCellClick(cell)}
          className={`
            aspect-square flex flex-col items-center justify-center
            border-2 p-2 cursor-pointer transition-all relative z-10 overflow-hidden
            ${cell.checked ? 'opacity-60 scale-95' : 'hover:scale-105'}
          `}
          style={{
            borderColor: theme?.primary || '#3b82f6',
            backgroundColor: cell.checked 
              ? theme?.primary || '#3b82f6' 
              : cell.bgColor || '#fff',
            color: cell.checked ? '#fff' : theme?.textColor || '#1f2937',
            borderRadius: getCellBorderRadius(theme?.cellShape || 'square'),
          }}
        >
          {/* Cell background image */}
          {cell.bgImage && !cell.checked && (
            <div
              className="absolute inset-0 opacity-30 pointer-events-none"
              style={{
                backgroundImage: `url(${cell.bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            />
          )}
          
          <div className="relative z-10">
            {renderEmoji(cell.emoji)}
            <div className="text-xs md:text-sm text-center font-medium line-clamp-3">
              {cell.text}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BoardGrid;
