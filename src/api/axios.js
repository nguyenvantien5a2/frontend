import axios from 'axios';

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

// Interceptor để đính kèm Token vào Header trước khi gửi request
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Nếu data là FormData, không set Content-Type (cho browser tự set multipart/form-data)
    if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
    }
    
    return config;
});

// Interceptor để xử lý lỗi tập trung (ví dụ: Token hết hạn)
axiosClient.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response && error.response.status === 401) {
        localStorage.removeItem('access_token');
    }
    return Promise.reject(error);
});

// Hàm bổ trợ để lấy URL ảnh đầy đủ
export const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path; // Nếu là URL tuyệt đối (từ faker/cloudinary)
    const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:8000';
    return `${baseUrl}/storage/${path}`;
};

export default axiosClient;
