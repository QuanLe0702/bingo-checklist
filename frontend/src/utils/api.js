import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

/**
 * Instance axios với cấu hình mặc định
 */
const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true, // Cho phép gửi cookie
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor để thêm token vào header (nếu cần)
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Interceptor để xử lý lỗi response
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - xóa token và redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
