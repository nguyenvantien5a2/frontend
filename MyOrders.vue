<template>
  <ToastNotification />
  <div class="min-h-screen bg-gray-50 pb-20 font-sans">
    <div class="bg-white shadow-sm border-b sticky top-0 z-20">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center text-sm text-gray-500">
          <router-link to="/" class="hover:text-blue-600 transition-colors">Trang chủ</router-link>
          <span class="mx-2">/</span>
          <span class="font-bold text-blue-600 uppercase tracking-wider text-xs">Đơn hàng của tôi</span>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-10 max-w-5xl">
      <h1 class="text-3xl font-black text-gray-800 uppercase tracking-tighter mb-8">Lịch sử đặt hàng</h1>

      <div v-if="loading" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-r-transparent"></div>
      </div>

      <div v-else-if="orders.length === 0" class="bg-white p-20 rounded-[40px] text-center border border-gray-100 shadow-sm">
        <p class="text-gray-400 font-bold text-lg mb-6">Bạn chưa có đơn hàng nào.</p>
        <router-link to="/products" class="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition">
          Mua sắm ngay
        </router-link>
      </div>

      <div v-else class="space-y-6">
        <div v-for="order in orders" :key="order.id" class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
          <div class="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Mã đơn hàng</p>
              <p class="text-lg font-bold text-gray-800">#{{ order.id }}</p>
            </div>
            <div class="flex items-center gap-6">
              <div class="text-right">
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Ngày đặt</p>
                <p class="font-bold text-gray-700">{{ new Date(order.created_at).toLocaleDateString('vi-VN') }}</p>
              </div>
              <div class="text-right">
                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Trạng thái</p>
                <span :class="getStatusClass(order.status)" class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                  {{ order.status }}
                </span>
              </div>
            </div>
          </div>

          <div class="p-6 bg-gray-50/30">
             <div v-for="detail in order.details" :key="detail.id" class="flex items-center gap-4 mb-4 last:mb-0">
                <img :src="getImageUrl(detail.product.image_url)" class="w-16 h-16 object-cover rounded-xl border border-white shadow-sm" />
                <div class="flex-1">
                    <p class="text-sm font-bold text-gray-800 line-clamp-1">{{ detail.product.name }}</p>
                    <p class="text-xs text-gray-500 font-medium">Số lượng: {{ detail.quantity }}</p>
                </div>
                <p class="text-sm font-black text-gray-700">{{ (detail.price * detail.quantity).toLocaleString('vi-VN') }}đ</p>
             </div>
          </div>

          <div class="p-6 border-t border-gray-50 flex justify-between items-center bg-white">
            <p class="text-gray-500 text-sm font-medium italic">Giao đến: {{ order.shipping_address }}</p>
            <div class="text-right">
              <span class="text-gray-400 text-xs font-bold uppercase mr-2">Tổng thanh toán:</span>
              <span class="text-2xl font-black text-red-600">{{ order.total_price.toLocaleString('vi-VN') }}đ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api, { getImageUrl } from '@/api/axios';
import ToastNotification from '@/components/ToastNotification.vue';

const orders = ref([]);
const loading = ref(true);

const fetchOrders = async () => {
    try {
        const response = await api.get('/my-orders');
        orders.value = response.data.data || response.data;
    } catch (err) {
        console.error('Lỗi khi lấy đơn hàng:', err);
    } finally {
        loading.value = false;
    }
};

const getStatusClass = (status) => {
    const classes = {
        'PENDING': 'bg-yellow-100 text-yellow-700',
        'PROCESSING': 'bg-blue-100 text-blue-700',
        'COMPLETED': 'bg-green-100 text-green-700',
        'CANCELLED': 'bg-red-100 text-red-700'
    };
    return classes[status] || 'bg-gray-100 text-gray-700';
};

onMounted(() => {
    fetchOrders();
});
</script>