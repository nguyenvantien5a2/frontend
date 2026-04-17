<template>
  <ToastNotification />
  <div class="p-6">
    <h2 class="text-3xl font-bold text-gray-800 mb-6">Quản Lý Đơn Hàng</h2>
    
    <!-- Loading -->
    <div v-if="loading" class="text-center py-10">
      <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600 mx-auto"></div>
    </div>

    <!-- Table -->
    <div v-else class="bg-white rounded-xl shadow overflow-hidden border border-gray-100">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">ID</th>
            <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Khách hàng</th>
            <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Tổng tiền</th>
            <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Thanh toán</th>
            <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Trạng thái</th>
            <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Ngày đặt</th>
            <th class="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Hành động</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="order in paginatedOrders" :key="order.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">#{{ order.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ order.customer_name }}
              <div class="text-xs text-gray-500">{{ order.phone }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-bold">
              {{ Number(order.total_price || 0).toLocaleString('vi-VN', { maximumFractionDigits: 0 }) }} ₫
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <span :class="{'text-pink-600 font-semibold': isMoMo(order.payment_method)}">{{ getPaymentMethodText(order.payment_method) }}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <select 
                :value="order.status" 
                @change="updateStatus(order, $event)"
                class="text-xs font-bold rounded-full px-3 py-1 border-0 cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none"
                :class="statusClass(order.status)"
              >
                <option v-for="(label, value) in statusOptions" :key="value" :value="value" class="bg-white text-gray-900">
                  {{ label }}
                </option>
              </select>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
              {{ new Date(order.created_at).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex justify-end items-center space-x-3">
                <button @click="openDetailModal(order)" class="text-blue-600 hover:text-blue-800 transition flex items-center" title="Xem chi tiết">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Xem
                </button>
                <button 
                  v-if="order.status === 'PENDING' || order.status === 'CANCELLED'"
                  @click="deleteOrder(order.id)" 
                  class="text-red-600 hover:text-red-800 transition flex items-center" 
                  title="Xóa đơn hàng"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Xóa
                </button>
                <div v-else class="w-5"></div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="orders.length === 0" class="p-6 text-center text-gray-500">
        Chưa có đơn hàng nào.
      </div>

      <!-- Pagination Controls -->
      <div v-if="totalPages > 1" class="bg-gray-50 px-6 py-4 border-t flex items-center justify-between">
        <span class="text-sm text-gray-700">
          Trang <span class="font-bold">{{ currentPage + 1 }}</span> / {{ totalPages }}
        </span>
        <div class="space-x-2">
              <button 
            @click="fetchOrders(currentPage.value - 1)" 
            :disabled="currentPage === 0"
            class="px-3 py-1 border rounded bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-gray-700">
            Trước
          </button>
          <button 
            @click="fetchOrders(currentPage.value + 1)" 
            :disabled="currentPage >= totalPages - 1"
            class="px-3 py-1 border rounded bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-gray-700">
            Sau
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Chi Tiết -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" @click.self="closeModal">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto animate-fade-in-up">
        <div class="flex justify-between items-center mb-6 border-b pb-4">
          <h3 class="text-xl font-bold text-gray-800">Chi Tiết Đơn Hàng #{{ selectedOrder?.id }}</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <div v-if="selectedOrder" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg">
            <div>
              <p class="text-xs text-gray-500 uppercase font-semibold mb-1">Khách hàng</p>
              <p class="font-medium text-gray-900">{{ selectedOrder.customer_name }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 uppercase font-semibold mb-1">Số điện thoại</p>
              <p class="font-medium text-gray-900">{{ selectedOrder.phone }}</p>
            </div>
            <div class="md:col-span-2">
              <p class="text-xs text-gray-500 uppercase font-semibold mb-1">Địa chỉ giao hàng</p>
              <p class="font-medium text-gray-900">{{ selectedOrder.shipping_address }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 uppercase font-semibold mb-1">Thanh toán</p>
              <p class="font-bold text-gray-900" :class="{'text-pink-600': isMoMo(selectedOrder.payment_method)}">
                {{ getPaymentMethodText(selectedOrder.payment_method) }}
              </p>
            </div>
             <div class="md:col-span-2" v-if="selectedOrder.note">
              <p class="text-xs text-gray-500 uppercase font-semibold mb-1">Ghi chú</p>
              <p class="font-medium text-gray-900 italic">"{{ selectedOrder.note }}"</p>
            </div>
          </div>

          <div>
            <h4 class="font-bold text-gray-800 mb-3">Sản phẩm đã đặt</h4>
            <div class="border rounded-lg overflow-hidden">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Sản phẩm</th>
                    <th class="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">SL</th>
                    <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Thành tiền</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white">
                  <tr v-for="item in selectedOrder.details" :key="item.id">
                    <td class="px-4 py-3">
                      <div class="flex items-center">
                        <img :src="item.product?.image_url || 'https://via.placeholder.com/40'" class="w-10 h-10 object-cover rounded border mr-3">
                        <div>
                          <p class="text-sm font-medium text-gray-900 line-clamp-1">{{ item.product.name }}</p>
                          <p class="text-xs text-gray-500">{{ Number(item.price || 0).toLocaleString('vi-VN', { maximumFractionDigits: 0 }) }} ₫</p>
                        </div>
                      </div>
                    </td>
                    <td class="px-4 py-3 text-center text-sm text-gray-900">{{ item.quantity }}</td>
                    <td class="px-4 py-3 text-right text-sm font-bold text-gray-900">
                      {{ ((Number(item.price || 0) * Number(item.quantity || 0))).toLocaleString('vi-VN', { maximumFractionDigits: 0 }) }} ₫
                    </td>
                  </tr>
                  <tr v-if="!selectedOrder.details || selectedOrder.details.length === 0">
                    <td colspan="3" class="px-4 py-8 text-center text-gray-500">Không có thông tin sản phẩm</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="flex justify-end border-t pt-4">
            <div class="w-full md:w-1/2 space-y-2">
              <div class="flex justify-between text-gray-600">
                <span>Tạm tính:</span>
                <span>{{ Number(selectedOrder.total_price || 0).toLocaleString('vi-VN', { maximumFractionDigits: 0 }) }} ₫</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>Phí vận chuyển:</span>
                <span class="text-green-600">Miễn phí</span>
              </div>
              <div class="flex justify-between items-center pt-2 border-t mt-2">
                <span class="font-bold text-lg text-gray-900">Tổng cộng:</span>
                <span class="text-xl font-bold text-red-600">{{ Number(selectedOrder.total_price || 0).toLocaleString('vi-VN', { maximumFractionDigits: 0 }) }} ₫</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="mt-6 flex justify-end">
          <button @click="closeModal" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition">
            Đóng
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/api/axios'
import { useToastStore } from '@/stores/toast'
import ToastNotification from '@/components/ToastNotification.vue'

const orders = ref([])
const loading = ref(true)
const currentPage = ref(0)
const pageSize = ref(10)
const totalPages = ref(0)
const totalElements = ref(0)
const paginatedOrders = computed(() => orders.value)
const showModal = ref(false)
const selectedOrder = ref(null)
const toastStore = useToastStore()

const fetchOrders = async (pageIndex = 0) => {
  loading.value = true
  try {
    const res = await api.get('/admin/orders', {
      params: {
        page: pageIndex,
      }
    })

    orders.value = res.data.data || []
    currentPage.value = (res.data.current_page || 1) - 1
    pageSize.value = res.data.per_page || 10
    totalPages.value = res.data.last_page || 0
    totalElements.value = res.data.total || orders.value.length
  } catch (error) {
    console.error("Lỗi tải đơn hàng:", error)
    toastStore.error('Không thể tải danh sách đơn hàng.')
  } finally {
    loading.value = false
  }
}

const deleteOrder = async (id) => {
  if (!confirm('Bạn có chắc chắn muốn xóa đơn hàng này không? Hành động này không thể hoàn tác.')) return

  try {
    await api.delete(`/orders/${id}`)
    orders.value = orders.value.filter(o => o.id !== id)
    toastStore.success('Đã xóa đơn hàng thành công!')
  } catch (error) {
    console.error("Lỗi xóa đơn hàng:", error)
    toastStore.error('Xóa thất bại. Có thể đơn hàng không ở trạng thái cho phép xóa.')
  }
}

const updateStatus = async (order, event) => {
  const newStatus = event.target.value
  const oldStatus = order.status

  try {
    await api.put(`/admin/orders/${order.id}/status`, { status: newStatus })
    order.status = newStatus
    toastStore.success(`Đã cập nhật trạng thái đơn hàng #${order.id}`)
  } catch (error) {
    console.error("Lỗi cập nhật trạng thái:", error)
    event.target.value = oldStatus
    toastStore.error('Cập nhật trạng thái thất bại.')
  }
}

const openDetailModal = (order) => {
  selectedOrder.value = order
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  setTimeout(() => {
    selectedOrder.value = null
  }, 300)
}

const statusClass = (status) => {
  const classes = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    SHIPPED: 'bg-purple-100 text-purple-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const statusOptions = {
  PENDING: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  SHIPPED: 'Đang giao hàng',
  DELIVERED: 'Đã giao hàng',
  CANCELLED: 'Đã hủy'
}

onMounted(() => {
  fetchOrders()
})
</script>
