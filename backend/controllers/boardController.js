import Board from "../models/Board.js";
import slugify from "slugify";
import { boardSchema } from "../utils/validation.js";

/**
 * @route   POST /api/boards
 * @desc    Tạo board mới
 * @access  Private
 */
export const createBoard = async (req, res) => {
  try {
    const validatedData = boardSchema.parse(req.body);
    const { title, description, size, cells, theme } = validatedData;

    // Tạo cells mặc định nếu không có
    let boardCells = cells || [];
    if (boardCells.length === 0) {
      for (let r = 0; r < size.rows; r++) {
        for (let c = 0; c < size.cols; c++) {
          boardCells.push({
            id: `cell-${r}-${c}`,
            r,
            c,
            text: "",
            emoji: "",
            note: "",
            checked: false,
          });
        }
      }
    }

    const board = await Board.create({
      ownerId: req.user._id,
      title,
      description,
      size,
      cells: boardCells,
      theme: theme || {},
    });

    res.status(201).json(board);
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        message: "Dữ liệu không hợp lệ",
        errors: error.errors,
      });
    }
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   GET /api/boards
 * @desc    Lấy danh sách boards của user
 * @access  Private
 */
export const getBoards = async (req, res) => {
  try {
    const boards = await Board.find({ ownerId: req.user._id })
      .sort({ updatedAt: -1 })
      .select("-cells"); // Không lấy cells để giảm data

    res.json(boards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   GET /api/boards/:id
 * @desc    Lấy chi tiết 1 board
 * @access  Private
 */
export const getBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({ message: "Board không tồn tại" });
    }

    // Kiểm tra quyền truy cập
    if (board.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }

    res.json(board);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   PUT /api/boards/:id
 * @desc    Cập nhật board
 * @access  Private
 */
export const updateBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({ message: "Board không tồn tại" });
    }

    if (board.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }

    // Cập nhật các field
    const { title, description, size, cells, theme, visibility } = req.body;

    if (title) board.title = title;
    if (description !== undefined) board.description = description;
    if (size) board.size = size;
    if (cells) board.cells = cells;
    if (theme) board.theme = { ...board.theme, ...theme };
    if (visibility) board.visibility = visibility;

    await board.save();
    res.json(board);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   DELETE /api/boards/:id
 * @desc    Xóa board
 * @access  Private
 */
export const deleteBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({ message: "Board không tồn tại" });
    }

    if (board.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }

    await board.deleteOne();
    res.json({ message: "Board đã được xóa" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   POST /api/boards/:id/check
 * @desc    Check/uncheck một ô
 * @access  Private
 */
export const checkCell = async (req, res) => {
  try {
    const { cellId, checked } = req.body;
    const board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({ message: "Board không tồn tại" });
    }

    if (board.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }

    // Tìm cell và cập nhật
    const cell = board.cells.find((c) => c.id === cellId);
    if (cell) {
      cell.checked = checked;
      await board.save();
      res.json(board);
    } else {
      res.status(404).json({ message: "Cell không tồn tại" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   POST /api/boards/:id/share
 * @desc    Tạo link public share
 * @access  Private
 */
export const shareBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({ message: "Board không tồn tại" });
    }

    if (board.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }

    // Tạo slug nếu chưa có
    if (!board.slug) {
      const baseSlug = slugify(board.title, { lower: true, strict: true });
      const randomStr = Math.random().toString(36).substring(2, 8);
      board.slug = `${baseSlug}-${randomStr}`;
    }

    board.visibility = "public";
    await board.save();

    const shareUrl = `${process.env.CLIENT_URL}/p/${board.slug}`;
    res.json({ shareUrl, slug: board.slug });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   GET /api/boards/public/:slug
 * @desc    Xem board public qua slug
 * @access  Public
 */
export const getPublicBoard = async (req, res) => {
  try {
    const board = await Board.findOne({
      slug: req.params.slug,
      visibility: "public",
    }).populate("ownerId", "username displayName");

    if (!board) {
      return res.status(404).json({ message: "Board không tồn tại hoặc không public" });
    }

    res.json(board);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
