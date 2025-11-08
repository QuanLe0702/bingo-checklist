import React, { useState } from 'react';
import { Copy, Check, X } from 'lucide-react';

/**
 * Component dialog chia sẻ board
 */
const ShareDialog = ({ shareUrl, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Chia sẻ Bingo Board</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Bất kỳ ai có link này đều có thể xem bảng Bingo của bạn
        </p>

        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            value={shareUrl}
            readOnly
            className="input flex-1 text-sm"
          />
          <button
            onClick={handleCopy}
            className="btn btn-primary px-3 py-2"
            title="Copy link"
          >
            {copied ? <Check size={20} /> : <Copy size={20} />}
          </button>
        </div>

        {copied && (
          <div className="text-sm text-green-600 mb-2">✓ Đã copy link!</div>
        )}

        <button onClick={onClose} className="btn btn-secondary w-full">
          Đóng
        </button>
      </div>
    </div>
  );
};

export default ShareDialog;
