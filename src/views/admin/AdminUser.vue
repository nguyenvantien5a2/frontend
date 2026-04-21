<template>
  <ToastNotification />
  <div class="p-6">
    <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <h2 class="text-3xl font-bold text-gray-800">Quản Lý Người Dùng</h2>
      
      <div class="flex gap-2 w-full md:w-auto">
        <div class="relative flex-1 md:w-64">
          <input 
            v-model="searchKeyword" 
            @keyup.enter="fetchUsers(0)"
            type="text" 
            placeholder="Tìm tên, email..." 
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none pl-10"
          />
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <button v-if="searchKeyword" @click="clearSearch" class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">✕</button>
        </div>
      </div>
    </div>

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
            <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Thông tin người dùng</th>
            <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Email</th>
            <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Vai trò</th>
            <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Ngày tham gia</th>
            <th class="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Hành động</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">#{{ user.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                  <img v-if="user.avatar_url" :src="getImageUrl(user.avatar_url)" class="h-10 w-10 rounded-full object-cover" alt="Avatar" referrerpolicy="no-referrer">
                  <div v-else class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                    {{ getInitials(user.name || user.username) }}
                  </div>
                </div>
                <div class="ml-3">
                  <div class="text-sm font-bold text-gray-900">{{ user.name || user.username }}</div>
                  <div v-if="user.locked" class="text-xs text-red-500 font-bold">Đã khóa</div>
                  <div class="text-xs text-gray-500 font-medium">{{ user.phone || 'Chưa cập nhật' }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">{{ user.email }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <select 
                :value="user.role" 
                @change="updateRole(user, $event)"
                class="text-xs font-bold rounded-full px-3 py-1 border-0 cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none"
                :class="user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'">
                <option value="USER" class="bg-white text-gray-900">USER</option>
                <option value="ADMIN" class="bg-white text-gray-900">ADMIN</option>
              </select>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
              {{ user.created_at ? new Date(user.created_at).toLocaleDateString('vi-VN') : 'N/A' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
              <div class="flex justify-center items-center space-x-4">
                <button @click="openDetailModal(user)" class="text-blue-600 hover:text-blue-800 transition flex items-center" title="Xem chi tiết">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Xem
                </button>
                <button @click="toggleLock(user)" class="transition flex items-center" :class="user.locked ? 'text-green-600 hover:text-green-800' : 'text-red-600 hover:text-red-800'" :title="user.locked ? 'Mở khóa tài khoản' : 'Khóa tài khoản'">
                  <svg v-if="user.locked" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  {{ user.locked ? 'Mở khóa' : 'Khóa' }}
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="users.length === 0">
             <td colspan="6" class="px-6 py-10 text-center text-gray-500">Không tìm thấy người dùng nào.</td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="bg-gray-50 px-6 py-4 border-t flex items-center justify-between">
        <span class="text-sm text-gray-700">
          Trang <span class="font-bold">{{ currentPage + 1 }}</span> / {{ totalPages }}
        </span>
        <div class="space-x-2">
          <button 
            @click="fetchUsers(currentPage - 1)" 
            :disabled="currentPage === 0"
            class="px-3 py-1 border rounded bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-gray-700">
            Trước
          </button>
          <button 
            @click="fetchUsers(currentPage + 1)" 
            :disabled="currentPage >= totalPages - 1"
            class="px-3 py-1 border rounded bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-gray-700">
            Sau
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Chi Tiết Người Dùng & Lịch Sử Đơn Hàng -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" @click.self="closeModal">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto animate-fade-in-up">
        <div class="flex justify-between items-center mb-6 border-b pb-4">
          <h3 class="text-xl font-bold text-gray-800">Chi Tiết Người Dùng #{{ selectedUser?.id }}</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div v-if="selectedUser" class="space-y-8">
          <!-- Thông tin cá nhân -->
          <div class="flex items-start gap-6">
            <div class="h-24 w-24 flex-shrink-0">
              <img v-if="selectedUser.avatar_url" :src="getImageUrl(selectedUser.avatar_url)" class="h-24 w-24 rounded-full object-cover border border-gray-200" alt="Avatar" referrerpolicy="no-referrer">
              <div v-else class="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-3xl">
                {{ getInitials(selectedUser.name || selectedUser.username) }}
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 flex-1">
              <div><span class="text-gray-500 text-sm">Họ và tên:</span> <p class="font-bold text-gray-900">{{ selectedUser.name || 'Chưa cập nhật' }}</p></div>
              <div><span class="text-gray-500 text-sm">Tên đăng nhập:</span> <p class="font-medium text-gray-900">{{ selectedUser.username }}</p></div>
              <div><span class="text-gray-500 text-sm">Email:</span> <p class="font-medium text-gray-900">{{ selectedUser.email }}</p></div>
              <div><span class="text-gray-500 text-sm">Số điện thoại:</span> <p class="font-medium text-gray-900">{{ selectedUser.phone || 'Chưa cập nhật' }}</p></div>
              <div><span class="text-gray-500 text-sm">Vai trò:</span> 
                <span :class="selectedUser.role === 'ADMIN' ? 'text-purple-700 bg-purple-100' : 'text-blue-700 bg-blue-100'" class="px-2 py-0.5 rounded text-sm font-bold ml-2">{{ selectedUser.role }}</span>
              </div>
              <div><span class="text-gray-500 text-sm">Trạng thái:</span> 
                <span :class="selectedUser.locked ? 'text-red-600' : 'text-green-600'" class="font-bold ml-2">{{ selectedUser.locked ? 'Đã khóa' : 'Hoạt động' }}</span>
              </div>
            </div>
          </div>

          <!-- Lịch sử đơn hàng -->
          <div>
            <h4 class="text-lg font-bold text-gray-800 mb-4 border-l-4 border-blue-600 pl-3">Lịch Sử Đơn Hàng</h4>
            <div v-if="ordersLoading" class="text-center py-8"><div class="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600 mx-auto"></div></div>
            <div v-else-if="userOrders.length === 0" class="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">Người dùng này chưa có đơn hàng nào.</div>
            <div v-else class="overflow-x-auto border rounded-lg">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">ID</th>
                    <th class="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Ngày đặt</th>
                    <th class="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Tổng tiền</th>
                    <th class="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">Trạng thái</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="order in userOrders" :key="order.id" class="hover:bg-gray-50">
                    <td class="px-4 py-3 text-sm font-semibold text-gray-700">#{{ order.id }}</td>
                    <td class="px-4 py-3 text-sm text-gray-600">{{ new Date(order.created_at).toLocaleString('vi-VN') }}</td>
                    <td class="px-4 py-3 text-sm font-bold text-red-600">
                      {{ Number(order.total_price).toLocaleString('vi-VN', { maximumFractionDigits: 0 }) }} ₫
                    </td>
                    <td class="px-4 py-3 text-center">
                      <span :class="statusClass(order.status)" class="px-2 py-1 rounded-full text-xs font-bold">{{ statusText(order.status) }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-end">
          <button @click="closeModal" class="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition">Đóng</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import api, { getImageUrl } from '@/api/axios'
import { useToastStore } from '@/stores/toast'
import ToastNotification from '@/components/ToastNotification.vue'

const users = ref([])
const loading = ref(true)
const searchKeyword = ref('')
const currentPage = ref(0)
const pageSize = ref(10)
const totalPages = ref(0)
const showModal = ref(false)
const selectedUser = ref(null)
const userOrders = ref([])
const ordersLoading = ref(false)
const toastStore = useToastStore()

const fetchUsers = async (page = 0) => {
  loading.value = true
  try {
    const res = await api.get('/admin/users', {
      params: { 
        page, 
        size: pageSize.value,
        keyword: searchKeyword.value 
      }
    })
    users.value = res.data.content
    totalPages.value = res.data.totalPages
    currentPage.value = res.data.number
  } catch (error) {
    console.error("Lỗi tải danh sách user:", error)
    toastStore.error('Không thể tải danh sách người dùng.')
  } finally {
    loading.value = false
  }
}

const clearSearch = () => {
  searchKeyword.value = ''
  fetchUsers(0)
}

// Tự động tìm kiếm khi gõ (debounce có thể thêm sau nếu cần)
watch(searchKeyword, () => {
  fetchUsers(0)
})

const toggleLock = async (user) => {
  const action = user.locked ? 'mở khóa' : 'khóa'
  if (!confirm(`Bạn có chắc chắn muốn ${action} tài khoản này?`)) return

  try {
    await api.put(`/admin/users/${user.id}/lock`, { locked: !user.locked })
    user.locked = !user.locked
    toastStore.success(`Đã ${action} tài khoản thành công!`)
  } catch (error) {
    console.error(`Lỗi ${action} người dùng:`, error)
    toastStore.error('Thao tác thất bại.')
  }
}

const updateRole = async (user, event) => {
  const newRole = event.target.value
  const oldRole = user.role

  if (!confirm(`Bạn có chắc chắn muốn thay đổi vai trò của người dùng này thành ${newRole}?`)) {
    event.target.value = oldRole
    return
  }

  try {
    await api.put(`/admin/users/${user.id}/role`, { role: newRole })
    user.role = newRole
    toastStore.success('Cập nhật vai trò thành công!')
  } catch (error) {
    console.error("Lỗi cập nhật vai trò:", error)
    event.target.value = oldRole
    toastStore.error('Cập nhật thất bại.')
  }
}

const openDetailModal = async (user) => {
  selectedUser.value = user
  showModal.value = true
  ordersLoading.value = true
  userOrders.value = []
  
  try {
    // Gọi API lấy đơn hàng theo userId
    const res = await api.get(`/orders/user/${user.id}`)
    userOrders.value = res.data.sort((a, b) => b.id - a.id)
  } catch (error) {
    console.error("Lỗi tải lịch sử đơn hàng:", error)
    toastStore.error('Không thể tải lịch sử đơn hàng.')
  } finally {
    ordersLoading.value = false
  }
}

const closeModal = () => {
  showModal.value = false
  selectedUser.value = null
}

const statusClass = (status) => {
  const classes = { PENDING: 'bg-yellow-100 text-yellow-800', CONFIRMED: 'bg-blue-100 text-blue-800', SHIPPED: 'bg-purple-100 text-purple-800', DELIVERED: 'bg-green-100 text-green-800', CANCELLED: 'bg-red-100 text-red-800' }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const statusText = (status) => {
  const texts = { PENDING: 'Chờ xác nhận', CONFIRMED: 'Đã xác nhận', SHIPPED: 'Đang giao hàng', DELIVERED: 'Đã giao hàng', CANCELLED: 'Đã hủy' }
  return texts[status] || status
}

const getInitials = (name) => {
  if (!name) return 'U'
  return name.charAt(0).toUpperCase()
}

onMounted(fetchUsers)
</script>
