import { create } from 'zustand';
import api from '../utils/api';

/**
 * Zustand store cho Board
 */
const useBoardStore = create((set, get) => ({
  boards: [],
  currentBoard: null,
  templates: [],
  loading: false,
  error: null,

  /**
   * Lấy danh sách boards của user
   */
  fetchBoards: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/boards');
      set({ boards: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  /**
   * Lấy chi tiết 1 board
   */
  fetchBoard: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/boards/${id}`);
      set({ currentBoard: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  /**
   * Lấy board public qua slug
   */
  fetchPublicBoard: async (slug) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/boards/public/${slug}`);
      set({ currentBoard: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  /**
   * Tạo board mới
   */
  createBoard: async (boardData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/boards', boardData);
      set((state) => ({
        boards: [response.data, ...state.boards],
        currentBoard: response.data,
        loading: false,
      }));
      return response.data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  /**
   * Cập nhật board
   */
  updateBoard: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/boards/${id}`, updates);
      set((state) => ({
        boards: state.boards.map((b) => (b._id === id ? response.data : b)),
        currentBoard: response.data,
        loading: false,
      }));
      return response.data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  /**
   * Xóa board
   */
  deleteBoard: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/boards/${id}`);
      set((state) => ({
        boards: state.boards.filter((b) => b._id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  /**
   * Check/uncheck cell
   */
  toggleCell: async (boardId, cellId, checked) => {
    try {
      const response = await api.post(`/boards/${boardId}/check`, {
        cellId,
        checked,
      });
      set({ currentBoard: response.data });
      return response.data;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  /**
   * Tạo link share
   */
  shareBoard: async (id) => {
    try {
      const response = await api.post(`/boards/${id}/share`);
      return response.data;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  /**
   * Lấy templates
   */
  fetchTemplates: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/templates');
      set({ templates: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  /**
   * Tạo board từ template
   */
  createFromTemplate: async (templateId) => {
    set({ loading: true, error: null });
    try {
      // Lấy template
      const templateRes = await api.get(`/templates/${templateId}`);
      const template = templateRes.data;

      // Tạo board mới từ template
      const boardData = {
        title: template.title,
        description: template.description,
        size: template.size,
        cells: template.cells.map((cell) => ({ ...cell, checked: false })),
        theme: template.theme,
      };

      const response = await api.post('/boards', boardData);
      set((state) => ({
        boards: [response.data, ...state.boards],
        currentBoard: response.data,
        loading: false,
      }));
      return response.data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  /**
   * Reset current board
   */
  resetCurrentBoard: () => set({ currentBoard: null }),
}));

export default useBoardStore;
