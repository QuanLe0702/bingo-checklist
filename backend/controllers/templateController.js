import Template from "../models/Template.js";

/**
 * @route   GET /api/templates
 * @desc    Lấy danh sách templates
 * @access  Public
 */
export const getTemplates = async (req, res) => {
  try {
    const { category, featured } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (featured === "true") filter.featured = true;

    const templates = await Template.find(filter).sort({ createdAt: -1 });
    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   GET /api/templates/:id
 * @desc    Lấy chi tiết 1 template
 * @access  Public
 */
export const getTemplate = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);

    if (!template) {
      return res.status(404).json({ message: "Template không tồn tại" });
    }

    res.json(template);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   POST /api/templates
 * @desc    Tạo template mới (admin only - có thể thêm middleware)
 * @access  Private
 */
export const createTemplate = async (req, res) => {
  try {
    const { title, description, category, size, cells, theme, featured } = req.body;

    const template = await Template.create({
      title,
      description,
      category,
      size,
      cells,
      theme,
      featured,
    });

    res.status(201).json(template);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
