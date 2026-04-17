<template>
    <nav class="bg-white shadow-md sticky top-0 z-50">
        <div class="container mx-auto px-4 py-3 flex items-center justify-between">
            <!-- Logo -->
            <router-link to="/" class="flex items-center space-x-2">
                <span class="text-3xl font-black text-blue-600 tracking-tighter italic">LKMT</span>
                <div class="hidden lg:block h-8 w-px bg-gray-200 mx-2"></div>
                <span class="hidden lg:block text-xs text-gray-400 uppercase tracking-widest font-bold leading-tight">Linh kiện<br>máy tính</span>
            </router-link>

            <!-- Navigation Links -->
            <div class="hidden lg:flex items-center space-x-6 text-sm font-bold uppercase tracking-wide text-gray-600">
                <router-link to="/" class="hover:text-blue-600 transition-colors" active-class="text-blue-600">Trang chủ</router-link>
                <router-link to="/products" class="hover:text-blue-600 transition-colors" active-class="text-blue-600">Sản phẩm</router-link>
                <router-link to="/promotions" class="hover:text-blue-600 transition-colors" active-class="text-blue-600">Khuyến mãi</router-link>
            </div>

            <!-- Search Bar -->
            <div class="hidden md:flex flex-1 mx-8 max-w-sm relative">
                <input 
                    type="text" 
                    v-model="search"
                    @keyup.enter="handleSearch"
                    placeholder="Bạn cần tìm linh kiện gì?" 
                    class="w-full border border-gray-300 rounded-full py-2 px-5 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button @click="handleSearch" class="absolute right-3 top-2 text-gray-500 hover:text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
            </div>

            <!-- Actions -->
            <div class="flex items-center space-x-5">
                <!-- Cart -->
                <router-link to="/cart" class="relative group">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-gray-700 group-hover:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span v-if="cart.cartCount > 0" class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                        {{ cart.cartCount }}
                    </span>
                </router-link>

                <!-- Auth -->
                <div v-if="auth.user" class="relative group border-l pl-6">
                    <button class="flex items-center space-x-2 focus:outline-none">
                        <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200 overflow-hidden">
                            <img v-if="auth.user.avatar_url" :src="auth.user.avatar_url" :alt="auth.user.name" class="w-full h-full object-cover">
                            <span v-else>{{ auth.user.name.charAt(0).toUpperCase() }}</span>
                        </div>
                        <div class="hidden lg:block text-left">
                            <p class="text-[10px] text-gray-400 uppercase font-bold leading-none">Tài khoản</p>
                            <span class="text-sm font-bold text-gray-700">{{ auth.user.name }}</span>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <div class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <router-link to="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Thông tin tài khoản
                        </router-link>
                        <router-link to="/my-orders" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Lịch sử đơn hàng của tôi
                        </router-link>
                        <router-link v-if="auth.isAdmin" to="/admin/dashboard" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Quản trị
                        </router-link>
                        <button @click="handleLogout" class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700">
                            Đăng xuất
                        </button>
                    </div>
                </div>
                <router-link v-else to="/login" class="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition-colors text-sm font-semibold">
                    Đăng nhập
                </router-link>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { ref } from 'vue';
import { useCartStore } from '../stores/cart';
import { useAuthStore } from '../stores/auth';
import { useToastStore } from '../stores/toast';
import { useRouter } from 'vue-router';

const cart = useCartStore();
const auth = useAuthStore();
const router = useRouter();
const search = ref('');

const toast = useToastStore();

const handleSearch = () => {
    if (search.value.trim()) {
        router.push({ path: '/products', query: { search: search.value } });
    }
};

const handleLogout = async () => {
    try {
        await auth.logout();
        toast.success('Đăng xuất thành công.');
    } catch (error) {
        console.error('Lỗi khi đăng xuất:', error);
    } finally {
        // Đảm bảo xóa sạch thông tin user ở phía client để Navbar cập nhật lại giao diện
        auth.$patch({ user: null, token: null });
        router.replace({ name: 'login' });
    }
};
</script>