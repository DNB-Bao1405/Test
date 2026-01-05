import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
  
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- INTERCEPTOR REQUEST (Giữ nguyên) ---
// Tự động móc Token từ LocalStorage nhét vào Header
axiosClient.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// --- INTERCEPTOR RESPONSE ---
axiosClient.interceptors.response.use((response) => {
  return response.data; // Trả về data luôn cho gọn
}, (error) => {
  // Nếu lỗi 401 (Unauthorized) -> Token hỏng/hết hạn
  if (error.response && error.response.status === 401) {
      console.warn("Token hết hạn hoặc không hợp lệ. Đang đăng xuất...");
      localStorage.clear();
      window.location.href = '/admin/login';
  }
  throw error;
});

export default axiosClient;