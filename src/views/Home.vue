<template>
    <ToastNotification />
    <div class="container mx-auto p-4 space-y-10">
        <!-- 1. Hero Banner Section -->
        <div class="relative rounded-3xl overflow-hidden text-white shadow-2xl bg-cover bg-center bg-no-repeat" style="background-image: url('/images/nền.jpg');">
            <div class="absolute inset-0 bg-black/60"></div>
            <div class="px-8 py-12 md:py-20 max-w-2xl relative z-10">
                <h1 class="text-4xl md:text-6xl font-black mb-6 leading-tight tracking-tight uppercase">Build PC đỉnh cao<br><span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-blue-200">Chạm tới đam mê</span></h1>
                <p class="text-blue-100 text-xl mb-10 font-medium opacity-90">Cung cấp linh kiện máy tính chính hãng 100%. Giải pháp tối ưu cho Game thực thụ.</p>
                <div class="flex gap-4 flex-wrap">
                    <router-link to="/products" class="bg-white text-blue-700 px-10 py-4 rounded-xl font-black uppercase tracking-wider hover:bg-blue-50 transition transform hover:-translate-y-1 shadow-xl">Mua ngay</router-link>
                    <router-link to="/promotions" class="backdrop-blur-md border-2 border-white/20 hover:bg-white/10 px-10 py-4 rounded-xl font-black uppercase tracking-wider transition flex items-center justify-center">Khuyến mãi</router-link>
                </div>
            </div>
            <div class="absolute right-0 bottom-0 opacity-20 md:opacity-100 p-10 hidden md:block">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-64 w-64 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            </div>
        </div>

        <!-- 2. Top Categories Section (4 Categories) -->
        <section>
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-2xl font-black text-gray-800 uppercase tracking-tighter flex items-center gap-2">
                    <span class="w-2 h-8 bg-blue-600 rounded-full"></span> Danh mục nổi bật
                </h2>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div v-for="category in categories.slice(0, 4)" :key="category.id"
                     @click="router.push({ path: '/products', query: { category_id: category.id } })"
                     class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-500 transition-all cursor-pointer text-center group">
                    <div class="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center group-hover:bg-white transition-colors overflow-hidden">
                        <img :src="category.image || 'https://via.placeholder.com/128?text=Category'" :alt="category.name" class="w-full h-full object-cover p-2 group-hover:p-0 transition-all duration-300"/>
                    </div>
                    <h3 class="font-black text-gray-700 group-hover:text-blue-600 uppercase text-sm tracking-widest">{{ category.name }}</h3>
                </div>
            </div>
        </section>

        <!-- 3. Newest Products Section (8 Products) -->
        <section>
            <div class="flex items-center justify-between mb-10">
                <h2 class="text-2xl font-black text-gray-800 uppercase tracking-tighter flex items-center gap-2">
                    <span class="w-2 h-8 bg-blue-600 rounded-full"></span> Sản phẩm mới nhất
                </h2>
                <router-link to="/products" class="text-blue-600 font-bold hover:underline">Xem tất cả →</router-link>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <div v-for="(product, index) in products" :key="product.id"
                     @click="goToProductDetail(product.id)"
                     class="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group relative">
                    <div class="relative overflow-hidden">
                        <img :src="getImageUrl(product.image_url)" :alt="product.name" class="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700">
                    <div v-if="index < 8" class="absolute top-4 left-4 bg-red-500 text-white text-[10px] px-3 py-1 rounded-full font-black uppercase">Mới về</div>
                    </div>
                    <div class="p-4">
                        <p class="text-blue-500 text-[10px] font-black uppercase mb-1 tracking-widest">{{ product.category.name }}</p>
                        <h2 class="text-base font-bold mb-3 text-gray-800 line-clamp-2 h-12 leading-tight group-hover:text-blue-600">{{ product.name }}</h2>
                        <div class="flex justify-between items-center mt-4">
                            <p class="text-blue-600 font-black text-xl"> {{ Number(product.price).toLocaleString('vi-VN') }}đ</p>
                            <button 
                                @click.stop="addToCart(product)"
                                :disabled="product.stock === 0"
                                class="bg-blue-600 text-white p-3 rounded-2xl hover:bg-blue-700 disabled:bg-gray-300 transition-all shadow-lg shadow-blue-200"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </button>
                        </div>
                        <div class="mt-3 flex items-center gap-2">
                            <div :class="['w-2 h-2 rounded-full animate-pulse', product.stock > 0 ? 'bg-green-500' : 'bg-red-500']"></div>
                            <p class="text-[10px] font-bold uppercase tracking-tight" :class="product.stock > 0 ? 'text-green-600' : 'text-red-500'">
                                {{ product.stock > 0 ? `Còn hàng (${product.stock} sp)` : 'Hết hàng' }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Load More Button -->
            <div v-if="currentPage < lastPage" class="text-center mt-12">
                <button @click="loadMore" 
                    :disabled="loading"
                    class="bg-white border-2 border-blue-600 text-blue-600 px-10 py-3 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition shadow-lg shadow-blue-50 disabled:opacity-50">
                    {{ loading ? 'Đang tải...' : 'Xem thêm sản phẩm' }}
                </button>
            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import axiosClient, { getImageUrl } from '../api/axios';
import { useCartStore } from '../stores/cart';
import { useToastStore } from '../stores/toast';
import ToastNotification from '../components/ToastNotification.vue';
import { useRouter, useRoute } from 'vue-router';

const cart = useCartStore();
const toastStore = useToastStore();
const products = ref([]);
const categories = ref([]);
const loading = ref(true);
const error = ref(null);
const currentPage = ref(1);
const lastPage = ref(1);
const searchQuery = ref('');

const selectedCategory = ref('');

const router = useRouter();
const route = useRoute();

// Hàm lấy danh sách sản phẩm
const fetchProducts = async (append = false) => {
    if (!append) {
        currentPage.value = 1;
    }
    loading.value = true;
    error.value = null;
    try {
        const params = {
            page: currentPage.value,
            per_page: 8,
            available: 1, // Chỉ lấy sản phẩm còn hàng
        };
        if (searchQuery.value) {
            params.search = searchQuery.value;
        }
        if (selectedCategory.value) {
            params.category_id = selectedCategory.value;
        }

        const response = await axiosClient.get('/products', { params });
        if (append) {
            products.value = [...products.value, ...response.data.data];
        } else {
            products.value = response.data.data;
        }
        currentPage.value = response.data.current_page;
        lastPage.value = response.data.last_page;
    } catch (err) {
        console.error('Lỗi khi lấy sản phẩm:', err);
        error.value = 'Không thể tải sản phẩm. Vui lòng thử lại sau.';
    } finally {
        loading.value = false;
    }
};

const loadMore = () => {
    if (currentPage.value < lastPage.value) {
        currentPage.value++;
        fetchProducts(true);
    }
};

const addToCart = (product) => {
    cart.addToCart(product);
};

// Hàm lấy danh sách danh mục
const fetchCategories = async () => {
    try {
        // Lấy tất cả danh mục từ API
        const response = await axiosClient.get('/categories');
        categories.value = response.data;
    } catch (err) {
        console.error('Lỗi khi lấy danh mục:', err);
    }
};

// Điều hướng đến trang chi tiết sản phẩm
const goToProductDetail = (id) => {
    router.push(`/products/${id}`);
};

// Khi component được mount
onMounted(() => {
    fetchCategories();
    fetchProducts();
});
</script>