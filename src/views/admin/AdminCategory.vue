<template>
  <ToastNotification />
  <div class="p-6">
    <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <h2 class="text-3xl font-bold text-gray-800">Quản Lý Danh Mục</h2>
      
      <div class="flex gap-2 w-full md:w-auto">
        <button @click="openModal()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center whitespace-nowrap shadow-sm">
          <span class="mr-2 text-xl font-bold">+</span> Thêm mới
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
            <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-20">ID</th>
            <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-24">Ảnh</th>
            <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
              <div class="flex items-center space-x-1 relative cursor-pointer group">
                <span>Tên danh mục</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-colors" :class="searchKeyword ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <select v-model="searchKeyword" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
                  <option value="">Tất cả</option>
                  <option v-for="cat in categories" :key="cat.id" :value="cat.name">{{ cat.name }}</option>
                </select>
              </div>
            </th>
            <th class="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider w-48">Hành động</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="category in paginatedCategories" :key="category.id" class="hover:bg-gray-50 transition-colors group">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">#{{ category.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="h-14 w-14 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                <img :src="category.image || 'https://via.placeholder.com/96x96?text=No+Image'" :alt="category.name" class="h-full w-full object-cover" />
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="text-sm font-medium text-gray-900">{{ category.name }}</div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
              <div class="flex items-center justify-center space-x-4">
                <button @click="openModal(category)" class="text-blue-600 hover:text-blue-800 transition flex items-center px-3 py-1 rounded-md hover:bg-blue-50" title="Sửa danh mục">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Sửa
                </button>
                <button @click="deleteCategory(category.id)" class="text-red-600 hover:text-red-800 transition flex items-center px-3 py-1 rounded-md hover:bg-red-50" title="Xóa danh mục">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Xóa
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredCategories.length === 0">
            <td colspan="4" class="px-6 py-10 text-center text-gray-500">
              Không tìm thấy danh mục nào phù hợp.
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination Controls -->
      <div v-if="totalPages > 1" class="bg-gray-50 px-6 py-4 border-t flex items-center justify-between">
        <span class="text-sm text-gray-700">
          Trang <span class="font-bold">{{ currentPage + 1 }}</span> / {{ totalPages }}
        </span>
        <div class="space-x-2">
          <button 
            @click="currentPage--" 
            :disabled="currentPage === 0"
            class="px-3 py-1 border rounded bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-gray-700">
            Trước
          </button>
          <button 
            @click="currentPage++" 
            :disabled="currentPage >= totalPages - 1"
            class="px-3 py-1 border rounded bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-gray-700">
            Sau
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Thêm/Sửa -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" @click.self="closeModal">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-fade-in-up">
        <div class="flex justify-between items-center mb-6 border-b pb-4">
          <h3 class="text-xl font-bold text-gray-800">{{ isEditing ? 'Cập Nhật Danh Mục' : 'Thêm Danh Mục Mới' }}</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <form @submit.prevent="saveCategory" class="space-y-6">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Tên danh mục <span class="text-red-500">*</span></label>
            <input 
              v-model="form.name" 
              type="text" 
              required 
              placeholder="Ví dụ: Điện tử, Thời trang..."
              class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" 
            />
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">URL ảnh danh mục</label>
            <input 
              v-model="form.image" 
              type="url" 
              placeholder="https://example.com/category-image.jpg"
              class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" 
            />
            <p class="mt-2 text-sm text-gray-500">Để trống nếu không muốn hiển thị ảnh.</p>
          </div>

          <div class="flex justify-end space-x-3 pt-2">
            <button type="button" @click="closeModal" class="px-5 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium transition">Hủy</button>
            <button type="submit" class="px-5 py-2.5 text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-bold shadow-md transition flex items-center">
              <svg v-if="isEditing" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
              {{ isEditing ? 'Lưu thay đổi' : 'Thêm mới' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import api from '@/api/axios'
import { useToastStore } from '@/stores/toast'
import ToastNotification from '@/components/ToastNotification.vue'

const categories = ref([])
const loading = ref(true)
const showModal = ref(false)
const isEditing = ref(false)
const searchKeyword = ref('')
const form = ref({ id: null, name: '', image: '' })
const currentPage = ref(0)
const pageSize = ref(10)
const toastStore = useToastStore()

const filteredCategories = computed(() => {
  if (!searchKeyword.value) return categories.value
  return categories.value.filter(cat => 
    cat.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
  )
})

const totalPages = computed(() => Math.ceil(filteredCategories.value.length / pageSize.value))

const paginatedCategories = computed(() => {
  const start = currentPage.value * pageSize.value
  const end = start + pageSize.value
  return filteredCategories.value.slice(start, end)
})

// Reset về trang 1 khi tìm kiếm
watch(searchKeyword, () => { currentPage.value = 0 })

const fetchCategories = async () => {
  loading.value = true
  try {
    const res = await api.get('/admin/categories')
    // API trả về object paginated, lấy mảng từ content
    categories.value = Array.isArray(res.data) ? res.data : (res.data.content || [])
  } catch (error) {
    console.error("Lỗi tải danh mục:", error)
    toastStore.error('Không thể tải danh sách danh mục.')
  } finally {
    loading.value = false
  }
}

const openModal = (category = null) => {
  if (category) {
    isEditing.value = true
    form.value = { ...category }
  } else {
    isEditing.value = false
    form.value = { id: null, name: '', image: '' }
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const saveCategory = async () => {
  try {
    if (isEditing.value) {
      await api.put(`/admin/categories/${form.value.id}`, form.value)
      toastStore.success('Cập nhật danh mục thành công!')
    } else {
      await api.post('/admin/categories', form.value)
      toastStore.success('Thêm danh mục mới thành công!')
    }
    fetchCategories()
    closeModal()
  } catch (error) {
    console.error("Lỗi lưu danh mục:", error)
    toastStore.error('Có lỗi xảy ra. Vui lòng thử lại.')
  }
}

const deleteCategory = async (id) => {
  if (!confirm('Bạn có chắc chắn muốn xóa danh mục này? Các sản phẩm thuộc danh mục này có thể bị ảnh hưởng.')) return

  try {
    await api.delete(`/admin/categories/${id}`)
    toastStore.success('Đã xóa danh mục!')
    fetchCategories()
  } catch (error) {
    console.error("Lỗi xóa danh mục:", error)
    toastStore.error('Xóa thất bại. Có thể danh mục đang chứa sản phẩm.')
  }
}

onMounted(() => {
  fetchCategories()
})
</script>
