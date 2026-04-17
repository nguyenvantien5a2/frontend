import { defineStore } from 'pinia';
import axios from 'axios';

export const useProductStore = defineStore('product', {
    state: () => ({
        products: [], // Lưu danh sách sản phẩm hiện tại
        pagination: null,
        loading: false,
        lastFetched: null // Để kiểm soát việc có cần gọi lại API ngay lập tức không
    }),

    actions: {
        async fetchProducts(params = {}, force = false) {
            // Nếu đã có dữ liệu và không bắt buộc load mới (force), 
            // và các tham số tìm kiếm không đổi, ta có thể bỏ qua loading để hiện ngay dữ liệu cũ
            if (this.products.length > 0 && !force && !params.search && !params.category_id) {
                // Vẫn gọi API ngầm nhưng không chặn UI
                return this.getApiData(params);
            }

            this.loading = true;
            return await this.getApiData(params);
        },

        async getApiData(params) {
            try {
                const response = await axios.get('/api/products', { params });
                this.products = response.data.data;
                this.pagination = response.data;
                this.lastFetched = new Date().getTime();
            } catch (error) {
                console.error('Lỗi khi tải sản phẩm:', error);
            } finally {
                this.loading = false;
            }
        }
    }
});