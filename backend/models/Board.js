import mongoose from "mongoose";

/**
 * Schema cho Cell (ô vuông trong bảng Bingo)
 */
const cellSchema = new mongoose.Schema({
  id: { type: String, required: true }, // cell-r-c
  r: { type: Number, required: true }, // row index
  c: { type: Number, required: true }, // col index
  text: { type: String, default: "" }, // Nội dung nhiệm vụ
  emoji: { type: String, default: "" }, // Icon/emoji
  note: { type: String, default: "" }, // Ghi chú
  checked: { type: Boolean, default: false }, // Đã hoàn thành chưa
  bgColor: { type: String, default: "" }, // Màu nền riêng cho ô
  bgImage: { type: String, default: "" }, // Ảnh nền riêng cho ô
});

/**
 * Schema cho Board (bảng Bingo)
 */
const boardSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      default: "My Bingo Board",
    },
    description: {
      type: String,
      default: "",
    },
    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
    },
    size: {
      rows: { type: Number, required: true, default: 5 },
      cols: { type: Number, required: true, default: 5 },
    },
    cells: [cellSchema],
    theme: {
      primary: { type: String, default: "#3b82f6" }, // màu chính
      bg: { type: String, default: "#ffffff" }, // màu nền
      bgImage: { type: String, default: "" }, // URL ảnh nền
      textColor: { type: String, default: "#1f2937" }, // màu chữ
      fontFamily: { type: String, default: "Inter" }, // font chữ
    },
    slug: {
      type: String,
      unique: true,
      sparse: true, // cho phép null
    },
    visibility: {
      type: String,
      enum: ["private", "public"],
      default: "private",
    },
  },
  { timestamps: true }
);

// Index để tìm kiếm nhanh
boardSchema.index({ ownerId: 1, createdAt: -1 });
boardSchema.index({ slug: 1 });

const Board = mongoose.model("Board", boardSchema);
export default Board;
