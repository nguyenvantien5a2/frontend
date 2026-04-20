<template>
    <ToastNotification />
    <div class="min-h-screen bg-gray-50 font-sans pb-10">
        <!-- Breadcrumb -->
        <div class="bg-white border-b border-gray-200">
            <div class="container mx-auto px-4 py-3">
                <div class="flex items-center text-sm text-gray-500">
                    <router-link to="/" class="hover:text-blue-600 transition">Trang chủ</router-link>
                    <span class="mx-2">/</span>
                    <router-link to="/products" class="hover:text-blue-600 transition">Sản phẩm</router-link>
                    <template v-if="product?.category">
                        <span class="mx-2">/</span>
                        <span class="font-medium text-blue-600 uppercase tracking-wider text-xs">{{ product.category.name }}</span>
                    </template>
                </div>
            </div>
        </div>

        <div class="container mx-auto px-4 py-8">
        <div v-if="loading" class="text-center py-20">
            <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 mx-auto"></div>
            <p class="mt-4 text-gray-500 font-medium uppercase tracking-widest text-xs">
                Đang tải dữ liệu...
            </p>
        </div>

            <div v-else-if="product">
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
                    <!-- Image Section -->
                    <div class="lg:col-span-5">
                        <div class="sticky top-6">
                            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-4">
                                <img :src="getImageUrl(product.image_url) || 'https://via.placeholder.com/600'" :alt="product.name"
                                    class="w-full h-auto object-contain hover:scale-105 transition duration-500 cursor-zoom-in" />
                            </div>
                        </div>
                    </div>

                    <!-- Info Section -->
                    <div class="lg:col-span-7 flex flex-col">
                        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                            <div class="flex items-center space-x-2 mb-4">
                                <span class="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                    {{ product.category?.name || 'Linh kiện' }}
                                </span>
                                <span v-if="product.stock > 0" class="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full flex items-center">
                                    <span class="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span> Còn hàng
                                </span>
                                <span v-else class="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full">Hết hàng</span>
                            </div>

                            <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">{{ product.name }}</h1>

                            <div class="flex items-end mb-6 pb-6 border-b border-gray-100">
                                <p class="text-4xl font-bold text-red-600">{{ Math.floor(product.price).toLocaleString('vi-VN') }} ₫</p>
                                <span class="ml-4 text-sm text-gray-500 mb-2">Đã bao gồm VAT</span>
                            </div>

                            <p class="text-gray-600 mb-8 leading-relaxed text-lg">{{ product.description || 'Không có mô tả chi tiết.' }}</p>

                            <!-- Stock Info Only -->
                            <div class="flex items-center gap-4 mb-8">
                                <p class="text-gray-500 text-sm font-bold uppercase tracking-widest">Tình trạng:</p>
                                <span class="text-sm font-medium text-gray-700">Kho còn: {{ product.stock }} sản phẩm</span>
                            </div>

                            <div class="flex gap-4 mb-8">
                                <button @click="handleAddToCart" :disabled="product.stock === 0"
                                    :class="product.stock === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'"
                                    class="flex-1 text-white font-bold py-4 rounded-xl transition text-lg flex items-center justify-center">
                                    <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                    {{ product.stock === 0 ? 'Tạm hết hàng' : 'Thêm vào giỏ hàng' }}
                                </button>
                                <button @click="toggleFavorite" class="px-6 border-2 border-gray-200 rounded-xl hover:border-red-500 hover:text-red-500 transition group bg-white">
                                    <svg class="w-8 h-8 transition duration-300" :class="isFavorite ? 'text-red-500 fill-current' : 'text-gray-400 group-hover:text-red-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                                    </svg>
                                </button>
                            </div>

                            <!-- Policy Grid -->
                            <div class="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100">
                                <div class="flex items-start space-x-3">
                                    <div class="bg-blue-50 p-2 rounded-lg text-blue-600">
                                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    </div>
                                    <div>
                                        <h4 class="font-bold text-gray-900 text-sm">Chính hãng 100%</h4>
                                        <p class="text-xs text-gray-500 mt-0.5">Nhập khẩu trực tiếp</p>
                                    </div>
                                </div>
                                <div class="flex items-start space-x-3">
                                    <div class="bg-blue-50 p-2 rounded-lg text-blue-600">
                                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    </div>
                                    <div>
                                        <h4 class="font-bold text-gray-900 text-sm">Bảo hành 12 tháng</h4>
                                        <p class="text-xs text-gray-500 mt-0.5">Lỗi 1 đổi 1</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Specifications -->
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div class="lg:col-span-8 lg:col-start-3">
                        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                            <h3 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                                <svg class="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path></svg>
                                Thông Số Kỹ Thuật
                            </h3>
                            <div class="overflow-hidden rounded-xl border border-gray-200">
                                <table class="w-full text-left border-collapse">
                                    <tbody>
                                        <tr v-for="(spec, index) in productSpecs" :key="index" :class="index % 2 === 0 ? 'bg-gray-50' : 'bg-white'" class="hover:bg-blue-50 transition">
                                            <td class="py-4 px-6 font-medium text-gray-600 w-1/3 border-b border-gray-200">{{ spec.label }}</td>
                                            <td class="py-4 px-6 text-gray-900 font-semibold border-b border-gray-200">{{ spec.value }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Related Products -->
                <div v-if="relatedProducts.length > 0" class="mt-20">
                    <h2 class="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">Sản Phẩm Liên Quan</h2>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div v-for="item in relatedProducts" :key="item.id" class="bg-white rounded-xl shadow-sm hover:shadow-xl transition duration-300 overflow-hidden group border border-gray-100">
                            <router-link :to="'/products/' + item.id" class="block relative overflow-hidden">
                                <img :src="getImageUrl(item.image_url) || 'https://via.placeholder.com/300'" class="w-full h-56 object-cover group-hover:scale-105 transition duration-500" />
                                <div v-if="item.stock === 0" class="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-xs">HẾT HÀNG</div>
                            </router-link>
                            <div class="p-5">
                                <div class="text-[10px] text-blue-600 font-bold uppercase tracking-wider mb-1">{{ item.category?.name || 'Khác' }}</div>
                                <h3 class="font-bold text-gray-900 text-lg mb-2 line-clamp-1 hover:text-blue-600 transition">
                                    <router-link :to="'/products/' + item.id">{{ item.name }}</router-link>
                                </h3>
                                <div class="flex justify-between items-end">
                                    <span class="text-xl font-bold text-red-600">
                                        {{ Math.floor(item.price).toLocaleString('vi-VN') }} ₫
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useCartStore } from '../stores/cart';
import { useToastStore } from '@/stores/toast';
import axiosClient, { getImageUrl } from '../api/axios';
import ToastNotification from '@/components/ToastNotification.vue';

const cart = useCartStore();
const toastStore = useToastStore();
const product = ref(null);
const loading = ref(true);
const favorites = ref([]);
const relatedProducts = ref([]);
const route = useRoute();

const isFavorite = computed(() => {
    if (!product.value) return false;
    return favorites.value.includes(product.value.id);
});

const productSpecs = computed(() => {
    if (!product.value?.category?.name) return [];
    const category = product.value.category.name.toLowerCase();
    if (category.includes('chuột')) {
        return [
            { label: 'Độ phân giải', value: '100 - 25,600 DPI' },
            { label: 'Cảm biến', value: 'Optical Gaming' },
            { label: 'Kết nối', value: 'USB / Wireless' },
            { label: 'Trọng lượng', value: '60g - 90g' }
        ];
    } else if (category.includes('phím')) {
        return [
            { label: 'Loại bàn phím', value: 'Cơ học' },
            { label: 'Switch', value: 'Blue/Red/Brown' },
            { label: 'Kết nối', value: 'USB Type-C' },
            { label: 'Layout', value: 'Fullsize / TKL' }
        ];
    }
    return [
        { label: 'Thương hiệu', value: 'Chính hãng' },
        { label: 'Bảo hành', value: '12 Tháng' },
        { label: 'Tình trạng', value: 'Mới 100%' }
    ];
});

const fetchProduct = async () => {
    loading.value = true;
    try {
        const response = await axiosClient.get(`/products/${route.params.id}`);
        product.value = response.data;

        // Lấy sản phẩm liên quan
        if (product.value.category_id) {
            const resAll = await axiosClient.get('/products', { params: { category_id: product.value.category_id } });
            relatedProducts.value = (resAll.data.data || resAll.data)
                .filter(p => p.id !== product.value.id)
                .slice(0, 4);
        }
    } catch (err) {
        console.error('Lỗi khi lấy chi tiết sản phẩm:', err);
    } finally {
        loading.value = false;
    }
};

const handleAddToCart = () => {
    if (product.value) {
        cart.addToCart(product.value);
    }
};

const toggleFavorite = () => {
    if (!product.value) return;
    if (isFavorite.value) {
        favorites.value = favorites.value.filter(id => id !== product.value.id);
    } else {
        favorites.value.push(product.value.id);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites.value));
};

watch(() => route.params.id, (newId) => {
    if (newId) {
        fetchProduct();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

onMounted(() => {
    const saved = localStorage.getItem('favorites');
    if (saved) favorites.value = JSON.parse(saved);
    fetchProduct();
    window.scrollTo(0, 0);
});
</script>