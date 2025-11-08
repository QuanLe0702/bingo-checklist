import React from 'react';
import confetti from 'canvas-confetti';

/**
 * Component hiển thị bảng Bingo (lưới ô vuông)
 */
const BoardGrid = ({ board, onCellClick, readonly = false }) => {
  const { size, cells, theme } = board;

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
      className="grid gap-2 p-4 rounded-xl"
      style={{
        gridTemplateColumns: `repeat(${size.cols}, minmax(0, 1fr))`,
        backgroundColor: theme?.bg || '#ffffff',
        fontFamily: theme?.fontFamily || 'Inter',
      }}
    >
      {cells.map((cell) => (
        <div
          key={cell.id}
          onClick={() => handleCellClick(cell)}
          className={`
            aspect-square flex flex-col items-center justify-center
            border-2 rounded-lg p-2 cursor-pointer transition-all
            ${cell.checked ? 'opacity-60 scale-95' : 'hover:scale-105'}
          `}
          style={{
            borderColor: theme?.primary || '#3b82f6',
            backgroundColor: cell.checked ? theme?.primary || '#3b82f6' : '#fff',
            color: cell.checked ? '#fff' : theme?.textColor || '#1f2937',
          }}
        >
          {cell.emoji && (
            <div className="text-2xl md:text-4xl mb-1">{cell.emoji}</div>
          )}
          <div className="text-xs md:text-sm text-center font-medium line-clamp-3">
            {cell.text}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BoardGrid;
