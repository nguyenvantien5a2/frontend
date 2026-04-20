<!-- e:\0. Database\tbnv\frontend\src\views\admin\AdminPromotionView.vue -->

<template>
  <ToastNotification />
  <div>
    <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <h2 class="text-3xl font-bold text-gray-800">Quản Lý Khuyến Mãi</h2>
      
      <div class="flex gap-2 w-full md:w-auto">
        <button @click="openModal()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center whitespace-nowrap ml-auto shadow-md">
          <span class="mr-2">+</span> Thêm mã mới
        </button>
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
            <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-24">Hình ảnh</th>
            <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Mã Code</th>
            <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Tiêu đề</th>
            <th class="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Giảm giá</th>
            <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Thời gian</th>
            <th class="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Hành động</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="promo in promotions" :key="promo.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap">
              <img :src="promo.imageUrl || 'https://via.placeholder.com/100?text=No+Img'" class="h-12 w-20 object-cover rounded-md border border-gray-200" alt="Promo" />
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-mono font-bold text-sm border border-blue-200 shadow-sm">{{ promo.code }}</span>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm font-bold text-gray-800">{{ promo.title }}</div>
              <div class="text-xs text-gray-500 truncate max-w-xs">{{ promo.description }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-center">
              <span v-if="promo.discountPercent" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
                -{{ promo.discountPercent }}%
              </span>
              <span v-else class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">
                Freeship / Khác
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              <div class="flex flex-col space-y-1">
                <span class="text-xs font-medium text-gray-500">BĐ: <span class="text-gray-700">{{ formatDate(promo.startDate) }}</span></span>
                <span class="text-xs font-medium text-gray-500">KT: <span class="text-gray-700">{{ formatDate(promo.endDate) }}</span></span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
              <div class="flex items-center justify-center space-x-3">
                <button @click="openModal(promo)" class="text-blue-600 hover:text-blue-800 transition flex items-center" title="Sửa">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Sửa
                </button>
                <button @click="deletePromotion(promo.id)" class="text-red-600 hover:text-red-800 transition flex items-center" title="Xóa">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Xóa
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="promotions.length === 0" class="p-6 text-center text-gray-500">
        Chưa có chương trình khuyến mãi nào.
      </div>

      <!-- Pagination Controls -->
      <div v-if="totalPages > 1" class="bg-gray-50 px-6 py-4 border-t flex items-center justify-between">
        <span class="text-sm text-gray-700">
          Trang <span class="font-bold">{{ currentPage + 1 }}</span> / {{ totalPages }}
        </span>
        <div class="space-x-2">
          <button 
            @click="fetchPromotions(currentPage - 1)" 
            :disabled="currentPage === 0" 
            class="px-3 py-1 border rounded bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-gray-700">
            Trước
          </button>
          <button 
            @click="fetchPromotions(currentPage + 1)" 
            :disabled="currentPage >= totalPages - 1" 
            class="px-3 py-1 border rounded bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-gray-700">
            Sau
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Thêm/Sửa -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto animate-fade-in-up">
        <h3 class="text-xl font-bold mb-4">{{ isEditing ? 'Cập Nhật Khuyến Mãi' : 'Thêm Khuyến Mãi Mới' }}</h3>
        
        <form @submit.prevent="savePromotion" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Mã Code (*)</label>
              <input v-model="form.code" type="text" required class="mt-1 block w-full border rounded-lg px-3 py-2 uppercase font-mono focus:ring-blue-500 focus:border-blue-500" placeholder="VD: SALE2024" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Giảm giá (%)</label>
              <input v-model.number="form.discountPercent" type="number" min="0" max="100" class="mt-1 block w-full border rounded-lg px-3 py-2" placeholder="Để trống nếu Freeship" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Tiêu đề (*)</label>
            <input v-model="form.title" type="text" required class="mt-1 block w-full border rounded-lg px-3 py-2" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Mô tả</label>
            <textarea v-model="form.description" rows="3" class="mt-1 block w-full border rounded-lg px-3 py-2"></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Ngày bắt đầu</label>
              <input v-model="form.startDate" type="datetime-local" class="mt-1 block w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Ngày kết thúc</label>
              <input v-model="form.endDate" type="datetime-local" class="mt-1 block w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Link Hình ảnh (URL)</label>
            <input v-model="form.imageUrl" type="text" class="mt-1 block w-full border rounded-lg px-3 py-2" placeholder="https://..." />
            <div v-if="form.imageUrl" class="mt-2">
              <img :src="form.imageUrl" class="h-20 w-full object-cover rounded border" onerror="this.style.display='none'" />
            </div>
          </div>

          <div class="flex justify-end space-x-3 mt-6 pt-4 border-t">
            <button type="button" @click="closeModal" class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Hủy</button>
            <button type="submit" class="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-medium">
              {{ isEditing ? 'Cập nhật' : 'Thêm mới' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api/axios'
import { useToastStore } from '@/stores/toast'
import ToastNotification from '@/components/ToastNotification.vue'

const promotions = ref([])
const loading = ref(true)
const showModal = ref(false)
const isEditing = ref(false)
const toastStore = useToastStore()

// Form data
const form = ref({
  id: null,
  code: '',
  title: '',
  description: '',
  discountPercent: null,
  startDate: '',
  endDate: '',
  imageUrl: ''
})

const currentPage = ref(0)
const totalPages = ref(0)
const pageSize = ref(10)

const fetchPromotions = async (page = 0) => {
  loading.value = true
  try {
    const res = await api.get('/admin/promotions', {
      params: { page, size: pageSize.value }
    })
    promotions.value = res.data.content
    totalPages.value = res.data.totalPages
    currentPage.value = res.data.number
  } catch (error) {
    console.error("Lỗi tải khuyến mãi:", error)
    toastStore.error('Không thể tải danh sách khuyến mãi.')
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '---'
  return new Date(dateString).toLocaleDateString('vi-VN')
}

// Helper để format date cho input datetime-local (YYYY-MM-DDThh:mm)
const toInputDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toISOString().slice(0, 16)
}

const openModal = (promo = null) => {
  if (promo) {
    isEditing.value = true
    form.value = { 
      ...promo, 
      startDate: toInputDate(promo.startDate),
      endDate: toInputDate(promo.endDate)
    }
  } else {
    isEditing.value = false
    form.value = { 
      id: null, code: '', title: '', description: '', 
      discountPercent: null, startDate: '', endDate: '', imageUrl: '' 
    }
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const savePromotion = async () => {
  try {
    // Validate cơ bản
    if (!form.value.code || !form.value.title) {
      toastStore.warning('Vui lòng nhập Code và Tiêu đề')
      return
    }

    // Chuẩn bị payload, thêm giây (:00) vào datetime để khớp với LocalDateTime backend
    const payload = { 
      ...form.value,
      startDate: form.value.startDate ? form.value.startDate + ':00' : null,
      endDate: form.value.endDate ? form.value.endDate + ':00' : null
    }
    
    if (isEditing.value) {
      await api.put(`/admin/promotions/${form.value.id}`, payload)
      toastStore.success('Cập nhật thành công!')
    } else {
      await api.post('/admin/promotions', payload)
      toastStore.success('Thêm mới thành công!')
      currentPage.value = 0 // Về trang đầu
    }
    
    fetchPromotions(currentPage.value)
    closeModal()
  } catch (error) {
    console.error("Lỗi lưu khuyến mãi:", error)
    const msg = error.response?.data || 'Có lỗi xảy ra.'
    toastStore.error(typeof msg === 'string' ? msg : 'Lỗi hệ thống')
  }
}

const deletePromotion = async (id) => {
  if (!confirm('Bạn có chắc chắn muốn xóa mã này không?')) return

  try {
    await api.delete(`/admin/promotions/${id}`)
    toastStore.success('Đã xóa thành công!')
    fetchPromotions(currentPage.value)
  } catch (error) {
    console.error("Lỗi xóa:", error)
    toastStore.error('Xóa thất bại.')
  }
}

onMounted(() => {
  fetchPromotions()
})
</script>
