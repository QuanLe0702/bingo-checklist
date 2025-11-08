import mongoose from "mongoose";

/**
 * Schema cho Template (bảng mẫu)
 * Tương tự Board nhưng không có ownerId, dùng chung cho tất cả user
 */
const templateCellSchema = new mongoose.Schema({
  id: String,
  r: Number,
  c: Number,
  text: { type: String, default: "" },
  emoji: { type: String, default: "" },
  note: { type: String, default: "" },
  checked: { type: Boolean, default: false },
});

const templateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    category: { type: String, default: "general" }, // noel, birthday, productivity, etc.
    size: {
      rows: { type: Number, required: true, default: 5 },
      cols: { type: Number, required: true, default: 5 },
    },
    cells: [templateCellSchema],
    theme: {
      primary: { type: String, default: "#3b82f6" },
      bg: { type: String, default: "#ffffff" },
      textColor: { type: String, default: "#1f2937" },
      fontFamily: { type: String, default: "Inter" },
    },
    featured: { type: Boolean, default: false }, // hiển thị nổi bật
  },
  { timestamps: true }
);

const Template = mongoose.model("Template", templateSchema);
export default Template;
