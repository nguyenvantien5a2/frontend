<template>
    <footer class="bg-white border-t mt-12">
        <div class="container mx-auto px-4 py-12">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <!-- Cột 1: Giới thiệu -->
                <div>
                    <h3 class="text-xl font-bold text-blue-600 mb-4">LKMT Store</h3>
                    <p class="text-gray-600 text-sm leading-relaxed">
                        Chuyên cung cấp linh kiện máy tính chính hãng, giải pháp build PC chuyên nghiệp hàng đầu Việt Nam. Chất lượng và uy tín là ưu tiên số 1.
                    </p>
                </div>

                <!-- Cột 2: Chính sách -->
                <div>
                    <h4 class="font-bold text-gray-800 mb-4">Chính sách chung</h4>
                    <ul class="text-sm text-gray-600 space-y-2">
                        <li><a href="#" class="hover:text-blue-600">Chính sách bảo hành</a></li>
                        <li><a href="#" class="hover:text-blue-600">Chính sách đổi trả</a></li>
                        <li><a href="#" class="hover:text-blue-600">Vận chuyển & Giao hàng</a></li>
                        <li><a href="#" class="hover:text-blue-600">Bảo mật thông tin</a></li>
                    </ul>
                </div>

                <!-- Cột 3: Hỗ trợ khách hàng -->
                <div>
                    <h4 class="font-bold text-gray-800 mb-4">Hỗ trợ khách hàng</h4>
                    <ul class="text-sm text-gray-600 space-y-2">
                        <li><a href="#" class="hover:text-blue-600">Hướng dẫn mua hàng</a></li>
                        <li><a href="#" class="hover:text-blue-600">Hướng dẫn thanh toán</a></li>
                        <li><a href="#" class="hover:text-blue-600">Câu hỏi thường gặp</a></li>
                        <li><router-link to="/my-orders" class="hover:text-blue-600">Lịch sử đơn hàng</router-link></li>
                    </ul>
                </div>

                <!-- Cột 4: Liên hệ -->
                <div>
                    <h4 class="font-bold text-gray-800 mb-4">Kết nối với chúng tôi</h4>
                    <div class="text-sm text-gray-600 space-y-2">
                        <p><strong>Hotline:</strong> 058.63.64.516</p>
                        <p><strong>Email:</strong> support@lkmt.com</p>
                        <p><strong>Địa chỉ:</strong> Phường Láng, TP. Hà Nội</p>
                    </div>
                    <div class="flex space-x-4 mt-4">
                        <a href="#" class="text-blue-600 hover:opacity-80">Facebook</a>
                        <a href="#" class="text-red-600 hover:opacity-80">Youtube</a>
                        <a href="#" class="text-blue-400 hover:opacity-80">Zalo</a>
                    </div>
                </div>
            </div>

            <!-- Bản quyền -->
            <div class="border-t mt-12 pt-8 text-center text-gray-500 text-sm">
                <p>&copy; {{ new Date().getFullYear() }} LKMT Store. All rights reserved. Nguyen Van Tien </p>
            </div>
        </div>

        <!-- Nút Cuộn lên đầu trang -->
        <button 
            v-show="showScrollButton"
            @click="scrollToTop"
            class="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-2xl hover:bg-blue-700 transition-all duration-300 z-50 transform hover:scale-110 active:scale-95 flex items-center justify-center border-2 border-white"
            title="Lên đầu trang"
        >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
        </button>
    </footer>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const showScrollButton = ref(false);

const checkScroll = () => {
    // Hiển thị nút khi cuộn xuống quá 400px
    showScrollButton.value = window.scrollY > 400;
};

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

onMounted(() => {
    window.addEventListener('scroll', checkScroll);
});

onUnmounted(() => {
    window.removeEventListener('scroll', checkScroll);
});
</script>

<style scoped>
</style>