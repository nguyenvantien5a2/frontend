<template>
  <ToastNotification />
  <div class="min-h-screen bg-gray-50 py-10">
    <div class="container mx-auto px-4 max-w-6xl">
      <div class="flex items-center mb-10">
        <router-link to="/" class="flex items-center text-blue-600 hover:underline text-lg mr-6">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Quay lại trang chủ
        </router-link>
        <h1 class="text-4xl font-bold text-gray-900">Lịch Sử Đơn Hàng Của Tôi</h1>
      </div>

      <div v-if="loading" class="text-center py-20">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 mx-auto mb-6"></div>
        <p class="text-xl text-gray-600">Đang tải lịch sử đơn hàng...</p>
      </div>

      <div v-else-if="orders.length === 0" class="bg-white rounded-2xl shadow-xl p-12 text-center text-xl text-gray-600 border border-gray-100">
        Bạn chưa có đơn hàng nào. 
        <router-link to="/" class="text-blue-600 hover:underline font-medium">Bắt đầu mua sắm ngay!</router-link>
      </div>

      <div v-else>
        <!-- Bộ lọc trạng thái giống OrdersView -->
        <div class="flex overflow-x-auto pb-2 mb-6 gap-2 no-scrollbar">
          <button 
            v-for="tab in filterTabs" 
            :key="tab.value"
            @click="selectedStatus = tab.value"
            :class="selectedStatus === tab.value ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'"
            class="px-5 py-2.5 rounded-full border font-bold text-sm whitespace-nowrap transition-all shadow-sm"
          >
            {{ tab.label }}
          </button>
        </div>

        <div v-if="filteredOrders.length === 0" class="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm">
          <p class="text-gray-500">Không tìm thấy đơn hàng nào ở trạng thái này.</p>
        </div>

        <div v-else class="space-y-6">
          <div v-for="order in filteredOrders" :key="order.id" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <!-- Header đơn hàng -->
            <div class="px-6 py-4 border-b border-gray-50 flex flex-wrap justify-between items-center bg-gray-50/50 gap-4">
              <div class="flex items-center gap-4">
                <span class="font-bold text-gray-900">Đơn hàng #{{ order.id }}</span>
                <span class="text-sm text-gray-500 border-l pl-4 border-gray-300">{{ new Date(order.created_at).toLocaleString('vi-VN') }}</span>
              </div>
              <span :class="statusClass(order.status)" class="px-3 py-1 rounded-full text-xs font-bold">
                {{ statusText(order.status) }}
              </span>
            </div>

            <!-- Body: Preview ảnh & Thông tin nhanh -->
            <div class="p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
              <div class="flex-shrink-0 flex items-center -space-x-4 overflow-hidden py-2">
                <template v-for="(item, index) in order.details" :key="item.id">
                  <div v-if="index < 4" class="relative group">
                    <img 
                      :src="getImageUrl(item.product?.image_url) || 'https://via.placeholder.com/80'" 
                      class="w-20 h-20 object-cover rounded-xl border-4 border-white shadow-sm transition-transform group-hover:-translate-y-1"
                      :alt="item.product?.name"
                      :title="item.product?.name"
                    />
                  </div>
                </template>
                <div v-if="order.details?.length > 4" class="w-20 h-20 rounded-xl border-4 border-white bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600 shadow-sm z-10">
                  +{{ order.details.length - 4 }}
                </div>
              </div>
              
              <div class="flex-1 min-w-0">
                <h4 class="text-gray-900 font-medium line-clamp-2" :title="order.details?.map(item => item.product?.name).join(', ')">
                  {{ order.details?.map(item => item.product?.name).join(', ') }}
                </h4>
                <p class="text-sm text-gray-500 mt-1">
                  {{ order.details?.reduce((sum, item) => sum + item.quantity, 0) || 0 }} sản phẩm
                </p>
              </div>

              <div class="flex flex-col md:items-end gap-3 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
                <div class="flex items-center gap-2 text-sm text-gray-600">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                  <span :class="{'text-pink-600 font-medium': isMoMo(order.payment_method)}">{{ getPaymentMethodText(order.payment_method) }}</span>
                </div>
                <div class="flex items-center justify-between md:justify-end gap-2">
                  <span class="text-gray-500 text-sm">Tổng tiền:</span>
                  <span class="text-xl font-bold text-red-600">{{ Number(order.total_price || 0).toLocaleString('vi-VN', { maximumFractionDigits: 0 }) }} ₫</span>
                </div>
                <button @click="openModal(order)" class="flex-1 md:flex-none px-6 py-2.5 bg-white border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-medium transition shadow-sm">
                  Xem chi tiết
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Chi Tiết Đơn Hàng -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" @click.self="closeModal">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in-up">
        <div class="px-6 py-4 border-b flex justify-between items-center bg-white">
          <h3 class="text-xl font-bold text-gray-800">Chi Tiết Đơn Hàng #{{ selectedOrder?.id }}</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <div v-if="selectedOrder" class="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          <!-- Thông tin giao hàng -->
          <div class="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500">Người nhận:</span>
              <span class="font-medium text-gray-900">{{ selectedOrder.customer_name }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Số điện thoại:</span>
              <span class="font-medium text-gray-900">{{ selectedOrder.phone }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Địa chỉ:</span>
              <span class="font-medium text-gray-900 text-right max-w-xs">{{ selectedOrder.shipping_address }}</span>
            </div>
          </div>

          <!-- Danh sách sản phẩm -->
          <div>
            <h4 class="font-bold text-gray-800">Sản phẩm đã đặt</h4>
            <div v-for="item in selectedOrder.details" :key="item.id" class="flex items-center gap-4 p-3 border-b border-gray-50">
              <img :src="getImageUrl(item.product?.image_url)" class="w-14 h-14 object-cover rounded-lg border">
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-800 line-clamp-1">{{ item.product?.name }}</p>
                <p class="text-xs text-gray-500">SL: {{ item.quantity }} x {{ Number(item.price || 0).toLocaleString('vi-VN', { maximumFractionDigits: 0 }) }}₫</p>
              </div>
              <p class="text-sm font-bold text-gray-900">{{ (Number(item.price || 0) * Number(item.quantity || 0)).toLocaleString('vi-VN', { maximumFractionDigits: 0 }) }} ₫</p>
            </div>
          </div>

          <!-- Tổng kết -->
          <div class="pt-4 border-t space-y-2">
            <div class="flex justify-between items-center">
              <span class="font-bold text-gray-900">Tổng cộng:</span>
              <span class="text-xl font-bold text-red-600">{{ Number(selectedOrder.total_price || 0).toLocaleString('vi-VN', { maximumFractionDigits: 0 }) }} ₫</span>
            </div>
          </div>
        </div>
        
        <div class="p-4 bg-gray-50 flex justify-end">
          <button @click="closeModal" class="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition">
            Đóng
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useOrdersStore } from '@/stores/orders';
import { getImageUrl } from '@/api/axios';
import { useToastStore } from '@/stores/toast';
import ToastNotification from '@/components/ToastNotification.vue';

const ordersStore = useOrdersStore();
const orders = ref([]);
const loading = ref(true);
const showModal = ref(false);
const selectedOrder = ref(null);
const selectedStatus = ref('ALL');
const authStore = useAuthStore();
const toastStore = useToastStore();

const filterTabs = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'PENDING', label: 'Chờ xác nhận' },
  { value: 'CONFIRMED', label: 'Đã xác nhận' },
  { value: 'SHIPPED', label: 'Đang giao' },
  { value: 'DELIVERED', label: 'Đã giao' },
  { value: 'CANCELLED', label: 'Đã hủy' }
];

const filteredOrders = computed(() => {
  if (selectedStatus.value === 'ALL') return orders.value;
  return orders.value.filter(order => order.status === selectedStatus.value);
});

const statusClass = (status) => {
  const classes = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    CONFIRMED: 'bg-blue-100 text-blue-700',
    SHIPPED: 'bg-purple-100 text-purple-700',
    DELIVERED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-800'
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};

const isMoMo = (method) => {
  return method && (method === 'MoMo' || method.toUpperCase() === 'MOMO');
};

const getPaymentMethodText = (method) => {
  if (isMoMo(method)) return 'Ví MoMo';
  return 'Thanh toán khi nhận hàng (COD)';
};

const statusText = (status) => {
  const texts = {
    PENDING: 'Chờ xác nhận',
    CONFIRMED: 'Đã xác nhận',
    SHIPPED: 'Đang giao hàng',
    DELIVERED: 'Đã giao hàng',
    CANCELLED: 'Đã hủy'
  };
  return texts[status] || status;
};

const openModal = (order) => {
  selectedOrder.value = order;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  setTimeout(() => { selectedOrder.value = null; }, 300);
};

onMounted(async () => {
  if (!authStore.token) {
    toastStore.error('Vui lòng đăng nhập để xem lịch sử đơn hàng!');
    return;
  }

  try {
    await ordersStore.fetchOrders();
    orders.value = ordersStore.orders;
  } catch (err) {
    console.error('❌ Lỗi tải đơn hàng:', err);
    toastStore.error('Không thể tải lịch sử đơn hàng.');
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up { animation: fadeInUp 0.4s ease-out forwards; }
</style>