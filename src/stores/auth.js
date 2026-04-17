import { defineStore } from 'pinia';
import axiosClient from '../api/axios';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('user_data')) || null,
        token: localStorage.getItem('access_token') || null,
    }),
    getters: {
        isAdmin: (state) => state.user?.role === 'ADMIN',
        isLoggedIn: (state) => !!state.token,
    },
    actions: {
        async login(credentials) {
            try {
                const response = await axiosClient.post('/login', credentials);
                // Sau khi API trả về thành công, dùng hàm setAuth để lưu state
                this.setAuth(response.data.access_token, response.data.user);
                return response;
            } catch (error) {
                throw error;
            }
        },
        // Hàm này dùng để lưu token và user vào state + localStorage
        // Dùng được cho cả login thường và login Google
        setAuth(token, user) {
            // Kiểm tra tài khoản bị khóa
            if (user.locked) {
                throw new Error('Tài khoản đã bị khóa');
            }
            
            this.token = token;
            this.user = user;
            localStorage.setItem('access_token', token);
            localStorage.setItem('user_data', JSON.stringify(user));
            // Cấu hình lại axios header ngay lập tức sau khi có token mới
            axiosClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        },
        // Cập nhật thông tin user mà không làm thay đổi token
        updateUserData(user) {
            this.user = user;
            localStorage.setItem('user_data', JSON.stringify(user));
        },
        async logout() {
            try {
                await axiosClient.post('/logout');
            } catch (error) {
                console.error('Logout error:', error);
            } finally {
                this.user = null;
                this.token = null;
                localStorage.removeItem('access_token');
                localStorage.removeItem('user_data');
                delete axiosClient.defaults.headers.common['Authorization'];
            }
        },
        async getUser() {
            if (this.token) {
                const response = await axiosClient.get('/users/profile');
                this.user = response.data;
                localStorage.setItem('user_data', JSON.stringify(this.user));
                
                // Kiểm tra tài khoản bị khóa
                if (this.user.locked) {
                    this.logout();
                    throw new Error('Tài khoản đã bị khóa');
                }
            }
        }
    }
});