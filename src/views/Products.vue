<template>
    <ToastNotification />
    <div class="min-h-screen bg-gray-50 font-sans">
        <!-- Breadcrumb -->
        <div class="bg-white shadow-sm border-b sticky top-0 z-20">
            <div class="container mx-auto px-4 py-3">
                <div class="flex items-center text-sm text-gray-500">
                    <router-link to="/" class="hover:text-blue-600 transition-colors flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Trang chủ
                    </router-link>
                    <span class="mx-2 text-gray-300">/</span>
                    <span class="font-medium text-blue-600 uppercase tracking-wider text-xs">{{ currentCategoryName }}</span>
                </div>
            </div>
        </div>

        <div class="container mx-auto px-4 py-8">
            <div class="flex flex-col lg:flex-row gap-8">
                <!-- Sidebar: Bộ lọc -->
                <aside class="w-full lg:w-1/4 space-y-6">
                    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                        <h3 class="text-lg font-bold text-gray-800 uppercase tracking-tight mb-6 flex items-center gap-2">
                            <span class="w-1.5 h-6 bg-blue-600 rounded-full"></span> Danh mục linh kiện
                        </h3>
                        <div class="flex flex-col gap-2">
                            <button @click="filterByCategory('')"
                                :class="['text-left px-5 py-3.5 rounded-2xl transition-all font-bold text-sm border-2', !selectedCategory ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100' : 'text-gray-500 border-transparent hover:bg-gray-50 hover:border-gray-100']">
                                Tất cả sản phẩm
                            </button>
                            <button v-for="cat in categories" :key="cat.id" @click="filterByCategory(cat.id)"
                                :class="['text-left px-5 py-3.5 rounded-2xl transition-all font-bold text-sm border-2', selectedCategory == cat.id ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100' : 'text-gray-500 border-transparent hover:bg-gray-50 hover:border-gray-100']">
                                {{ cat.name }}
                            </button>
                        </div>
                    </div>

                    <!-- Favorite Trigger -->
                    <button @click="showFavorites = true" class="w-full bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:border-red-500 transition-colors">
                        <div class="flex items-center gap-3">
                            <svg class="w-6 h-6 text-red-500 fill-current" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                            <span class="font-bold text-gray-700 group-hover:text-red-500">Sản phẩm yêu thích</span>
                        </div>
                        <span class="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">{{ favorites.length }}</span>
                    </button>
                </aside>

                <!-- Main Content -->
                <main class="w-full lg:w-3/4">
                    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
                        <div>
                            <h2 class="text-3xl font-bold text-gray-900 mb-1">
                                {{ currentCategoryName }}
                            </h2>
                            <p class="text-gray-500 text-xs font-medium uppercase tracking-widest">Tìm thấy {{ totalItems }} linh kiện phù hợp</p>
                        </div>
                        
                        <div class="flex items-center gap-3">
                            <select v-model="sortOrder" @change="handleSort" class="bg-gray-50 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl px-4 py-2.5 focus:ring-blue-500 focus:border-blue-500 outline-none">
                                <option value="">Mặc định</option>
                                <option value="price_asc">Giá: Thấp đến Cao</option>
                                <option value="price_desc">Giá: Cao đến Thấp</option>
                            </select>
                        </div>
                    </div>

                    <!-- Loading State -->
                    <div v-if="loading" class="flex flex-col items-center justify-center py-32">
                        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 border-r-transparent mb-4"></div>
                        <p class="text-gray-500 font-medium uppercase tracking-widest text-xs">Đang tải dữ liệu...</p>
                    </div>

                    <!-- Empty State -->
                    <div v-else-if="products.length === 0" class="bg-white p-20 rounded-2xl text-center border-2 border-dashed border-gray-100">
                        <div class="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <h3 class="text-xl font-black text-gray-800 mb-2">Không tìm thấy sản phẩm</h3>
                        <p class="text-gray-400 font-medium mb-8">Rất tiếc, hiện tại không có linh kiện nào trong danh mục này.</p>
                        <button @click="filterByCategory('')" class="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200">
                            Xem tất cả sản phẩm
                        </button>
                    </div>

                    <!-- Product Grid -->
                    <div v-else>
                        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                            <div v-for="product in products" :key="product.id" @click="openQuickView(product)"
                                class="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 group flex flex-col h-full relative">
                                
                                <!-- Product Image -->
                                <div class="relative overflow-hidden aspect-square">
                                    <img :src="getImageUrl(product.image_url) || 'https://via.placeholder.com/400'" :alt="product.name"
                                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                                    
                                    <!-- Badges (Chỉ hiện khi hết hàng) -->
                                    <div class="absolute top-4 left-4 flex flex-col gap-2">
                                        <span v-if="product.stock === 0" class="bg-gray-900/80 backdrop-blur-md text-white px-4 py-1.5 rounded-full font-bold uppercase text-[10px] tracking-widest">Hết hàng</span>
                                    </div>
                                </div>

                                <!-- Product Info -->
                                <div class="p-6 flex flex-col flex-1">
                                    <div class="flex items-center gap-2 mb-2">
                                        <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
                                        <p class="text-blue-500 text-[10px] font-bold uppercase tracking-widest">
                                            {{ product.category?.name || 'Linh kiện' }}
                                        </p>
                                    </div>
                                    
                                    <h2 class="text-lg font-bold mb-4 text-gray-800 line-clamp-2 h-14 leading-tight group-hover:text-blue-600 transition-colors">
                                        {{ product.name }}
                                    </h2>
                                    
                                    <div class="mt-auto pt-5 border-t border-gray-50 flex justify-between items-center">
                                        <div class="flex flex-col">
                                            <span class="text-gray-400 text-[10px] font-bold uppercase tracking-tighter">Giá niêm yết</span>
                                            <p class="text-red-600 font-bold text-xl tracking-tighter">{{ Number(product.price).toLocaleString('vi-VN') }} ₫</p>
                                        </div>
                                        <button @click.stop="addToCart(product)" :disabled="product.stock === 0"
                                            class="bg-blue-600 text-white p-3.5 rounded-2xl hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-100 disabled:bg-gray-200 disabled:shadow-none disabled:text-gray-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Pagination -->
                        <div v-if="lastPage > 1" class="flex justify-center mt-16 gap-3">
                            <button 
                                v-for="page in lastPage" 
                                :key="page" 
                                @click="changePage(page)"
                                :class="['min-w-[48px] h-12 rounded-2xl font-bold transition-all border-2', 
                                         currentPage === page 
                                         ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-100 scale-110' 
                                         : 'bg-white text-gray-500 border-transparent hover:border-gray-200 hover:text-blue-600']"
                            >
                                {{ page }}
                            </button>
                        </div>

                        <!-- Quick View Modal (Popup) -->
                        <div v-if="selectedProduct" class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" @click.self="closeQuickView">
                            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden relative flex flex-col md:flex-row animate-in fade-in zoom-in duration-300">
                                <!-- Close Button -->
                                <button @click="closeQuickView" class="absolute top-4 right-4 text-gray-400 hover:text-gray-900 z-10 bg-white shadow-md rounded-full p-1.5 transition-colors">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                                
                                <!-- Image Side -->
                                <div class="w-full md:w-5/12 h-64 md:h-auto bg-white p-6 flex items-center justify-center border-r border-gray-50">
                                    <img :src="getImageUrl(selectedProduct.image_url) || 'https://via.placeholder.com/600'" class="max-w-full max-h-full object-contain" />
                                </div>
                                
                                <!-- Info Side -->
                                <div class="w-full md:w-7/12 p-8 flex flex-col justify-center">
                                    <div class="flex items-center gap-2 mb-2">
                                        <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
                                        <p class="text-blue-500 text-[10px] font-bold uppercase tracking-widest">{{ selectedProduct.category?.name }}</p>
                                    </div>
                                    <h2 class="text-2xl font-bold text-gray-900 mb-3 leading-tight">{{ selectedProduct.name }}</h2>
                                    <p class="text-3xl font-bold text-red-600 mb-6 tracking-tight">{{ Math.floor(Number(selectedProduct.price)).toLocaleString('vi-VN') }} ₫</p>
                                    
                                    <div class="mb-6">
                                        <p class="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">Mô tả ngắn</p>
                                        <p class="text-gray-600 line-clamp-4 leading-relaxed">{{ selectedProduct.description || 'Sản phẩm linh kiện máy tính chất lượng cao, bảo hành chính hãng.' }}</p>
                                    </div>

                                    <!-- Actions -->
                                    <div class="flex flex-col gap-3">
                                        <button 
                                            @click="addToCart(selectedProduct); closeQuickView()"
                                            :disabled="selectedProduct.stock === 0"
                                            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-100 uppercase tracking-widest text-xs flex items-center justify-center gap-2 disabled:bg-gray-200 disabled:shadow-none"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            Thêm vào giỏ hàng
                                        </button>
                                        <button 
                                            @click="router.push(`/products/${selectedProduct.id}`)"
                                            class="w-full bg-white border-2 border-gray-100 hover:border-blue-600 hover:text-blue-600 text-gray-500 font-bold py-3.5 rounded-xl transition-all uppercase tracking-widest text-xs"
                                        >
                                          Xem chi tiết sản phẩm
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Favorites Modal -->
                        <div v-if="showFavorites" class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" @click.self="showFavorites = false">
                            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh]">
                                <div class="p-5 border-b flex justify-between items-center bg-gray-50">
                                    <h3 class="text-xl font-bold text-gray-900 flex items-center gap-2">
                                        <svg class="w-6 h-6 text-red-500 fill-current" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                                        Sản phẩm yêu thích
                                    </h3>
                                    <button @click="showFavorites = false" class="text-gray-400 hover:text-gray-900 transition-colors">
                                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                    </button>
                                </div>
                                <div class="flex-1 overflow-y-auto p-4 space-y-4">
                                    <div v-if="favoriteProducts.length === 0" class="text-center py-10 text-gray-500">
                                        Chưa có sản phẩm yêu thích nào.
                                    </div>
                                    <div v-for="fav in favoriteProducts" :key="fav.id" class="flex gap-4 p-3 border rounded-xl hover:bg-gray-50 transition-colors group">
                                        <img :src="getImageUrl(fav.image_url)" class="w-16 h-16 object-cover rounded-lg" />
                                        <div class="flex-1">
                                            <h4 class="font-bold text-gray-900 text-sm line-clamp-1">{{ fav.name }}</h4>
                                            <p class="text-red-600 font-bold text-sm">{{ fav.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") }} ₫</p>
                                            <div class="flex gap-2 mt-2">
                                                <button @click="router.push(`/products/${fav.id}`); showFavorites = false" class="text-[10px] font-bold text-blue-600 uppercase hover:underline">Chi tiết</button>
                                                <span class="text-gray-300">|</span>
                                                <button @click="removeFromFavorites(fav.id)" class="text-[10px] font-bold text-red-500 uppercase hover:underline">Xóa</button>
                                            </div>
                                        </div>
                                        <button @click="addToCart(fav)" class="self-center bg-blue-100 text-blue-600 p-2 rounded-lg hover:bg-blue-600 hover:text-white transition">
                                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api, { getImageUrl } from '@/api/axios';
import { useCartStore } from '@/stores/cart';
import { useToastStore } from '@/stores/toast';
import ToastNotification from '@/components/ToastNotification.vue';

const router = useRouter();
const route = useRoute();
const cart = useCartStore();
const toastStore = useToastStore();

const products = ref([]);
const categories = ref([]);
const loading = ref(true);
const sortOrder = ref(route.query.sort || '');
const favorites = ref([]);
const favoriteProducts = ref([]);
const showFavorites = ref(false);

// Quick View State
const selectedProduct = ref(null);
const modalQuantity = ref(1);

// Đảm bảo khởi tạo các biến reactive trước khi sử dụng logic
const selectedCategory = ref('');
const currentPage = ref(parseInt(route.query.page) || 1);
const lastPage = ref(1);
const totalItems = ref(0);

const currentCategoryName = computed(() => {
    if (!selectedCategory.value || selectedCategory.value === '') return 'Tất cả linh kiện';
    const cat = categories.value.find(c => c.id == selectedCategory.value);
    return cat ? cat.name : 'Sản phẩm';
});

const fetchCategories = async () => {
    try {
        const response = await api.get('/categories');
        categories.value = response.data;
        // Sau khi có categories, mới cập nhật selectedCategory từ URL
        selectedCategory.value = route.query.category_id || '';
    } catch (err) { console.error(err); }
};

const fetchProducts = async () => {
    loading.value = true;
    try {
        const params = {
            page: currentPage.value,
            sort: sortOrder.value
        };
        
        if (selectedCategory.value) {
            params.category_id = selectedCategory.value;
        }
        if (route.query.search) {
            params.search = route.query.search;
        }

        const response = await api.get('/products', { params });
        products.value = response.data.data || [];
        lastPage.value = response.data.last_page || 1;
        totalItems.value = response.data.total || 0;
    } catch (err) { console.error(err); }
    finally { loading.value = false; window.scrollTo({ top: 0, behavior: 'smooth' }); }
};

const filterByCategory = (id) => {
    selectedCategory.value = id;
    router.push({ query: { ...route.query, category_id: id, page: 1 } });
};

const changePage = (page) => {
    currentPage.value = page;
    router.push({ query: { ...route.query, page } });
};

const handleSort = () => {
    currentPage.value = 1;
    router.push({ query: { ...route.query, sort: sortOrder.value, page: 1 } });
};

const addToCart = (product) => {
    cart.addToCart(product);
};

const openQuickView = (product) => {
    selectedProduct.value = product;
    modalQuantity.value = 1;
};

const closeQuickView = () => {
    selectedProduct.value = null;
};

const loadFavorites = async () => {
    const saved = localStorage.getItem('favorites');
    if (saved) {
        favorites.value = JSON.parse(saved);
        if (favorites.value.length > 0) {
            // Tải thông tin chi tiết các sản phẩm yêu thích (giả định dùng chung API products)
            try {
                const res = await api.get('/products');
                const all = res.data.data || res.data;
                favoriteProducts.value = all.filter(p => favorites.value.includes(p.id));
            } catch (err) { console.error(err); }
        } else {
            favoriteProducts.value = [];
        }
    }
};

const removeFromFavorites = (id) => {
    favorites.value = favorites.value.filter(favId => favId !== id);
    localStorage.setItem('favorites', JSON.stringify(favorites.value));
    favoriteProducts.value = favoriteProducts.value.filter(p => p.id !== id);
    toastStore.success('Đã xóa khỏi danh sách yêu thích');
};

watch(() => route.query, () => {
    selectedCategory.value = route.query.category_id || '';
    currentPage.value = parseInt(route.query.page) || 1;
    sortOrder.value = route.query.sort || '';
    fetchProducts();
}, { deep: true });

onMounted(() => {
    selectedCategory.value = route.query.category_id || '';
    loadFavorites();
    fetchCategories();
    fetchProducts();
});
</script>