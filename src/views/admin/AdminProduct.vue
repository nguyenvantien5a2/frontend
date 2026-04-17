<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <h2 class="text-3xl font-bold text-gray-800">Quản Lý Sản Phẩm</h2>

      <div class="flex gap-2 w-full md:w-auto">
        <div class="relative flex-1 md:w-64">
          <input
            v-model="searchKeyword"
            @keyup.enter="handleSearch"
            type="text"
            placeholder="Tìm tên sản phẩm..."
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <button v-if="searchKeyword" @click="clearSearch" class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <button @click="handleSearch" class="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition font-medium">Tìm</button>
        <button @click="openModal()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center whitespace-nowrap">
          <span class="mr-2">+</span> Thêm mới
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-10">
      <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600 mx-auto"></div>
    </div>

    <!-- Table -->
    <div v-else class="bg-white rounded-xl shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">ID</th>
            <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Hình ảnh</th>
            <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Tên sản phẩm</th>
            <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
              <div class="flex items-center space-x-1 relative cursor-pointer group">
                <span>Danh mục</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-colors" :class="selectedCategoryId ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <select v-model="selectedCategoryId" @change="handleSearch" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
                  <option :value="null">Tất cả</option>
                  <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                </select>
              </div>
            </th>
            <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Giá</th>
            <th class="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Kho</th>
            <th class="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Hành động</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="product in products" :key="product.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">#{{ product.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <img :src="getImageUrl(product.image_url)" class="h-12 w-12 rounded-lg object-cover border flex-shrink-0" alt="">
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ product.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">{{ product.category?.name || 'Chưa phân loại' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-blue-700 font-bold">
              {{ new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800 text-center">{{ product.stock }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
              <div class="flex items-center justify-center space-x-4">
                <button @click="openModal(product)" class="text-blue-600 hover:text-blue-800 transition flex items-center" title="Sửa sản phẩm">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Sửa
                </button>
                <button @click="deleteProduct(product.id)" class="text-red-600 hover:text-red-800 transition flex items-center" title="Xóa sản phẩm">
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

      <div v-if="products.length === 0" class="p-6 text-center text-gray-500">
        Chưa có sản phẩm nào.
      </div>

      <!-- Pagination Controls -->
      <div v-if="totalPages > 1" class="bg-gray-50 px-6 py-4 border-t flex items-center justify-between">
        <span class="text-sm text-gray-700">
          Trang <span class="font-bold">{{ currentPage + 1 }}</span> / {{ totalPages }}
        </span>
        <div class="space-x-2">
          <button
            @click="fetchProducts(currentPage - 1)"
            :disabled="currentPage === 0"
            class="px-3 py-1 border rounded bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-gray-700">
            Trước
          </button>
          <button
            @click="fetchProducts(currentPage + 1)"
            :disabled="currentPage >= totalPages - 1"
            class="px-3 py-1 border rounded bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-gray-700">
            Sau
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Thêm/Sửa -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6">
        <h3 class="text-xl font-bold mb-4">{{ isEditing ? 'Cập Nhật Sản Phẩm' : 'Thêm Sản Phẩm Mới' }}</h3>

        <form @submit.prevent="saveProduct" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Tên sản phẩm</label>
            <input v-model="form.name" type="text" required class="mt-1 block w-full border rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Giá (VNĐ)</label>
              <input v-model.number="form.price" type="number" required min="1" class="mt-1 block w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Tồn kho</label>
              <input v-model.number="form.stock" type="number" required class="mt-1 block w-full border rounded-lg px-3 py-2" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Hình ảnh</label>
            <input type="file" @change="handleFileUpload" class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>

            <!-- Preview ảnh -->
            <div v-if="previewImage || form.image_url" class="mt-2">
              <img :src="previewImage || getImageUrl(form.image_url)" class="h-20 w-20 object-cover rounded border" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Danh mục</label>
            <select v-model="form.categoryId" class="mt-1 block w-full border rounded-lg px-3 py-2">
              <option :value="null">Chọn danh mục</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Mô tả</label>
            <textarea v-model="form.description" rows="3" class="mt-1 block w-full border rounded-lg px-3 py-2"></textarea>
          </div>

          <div class="flex justify-end space-x-3 mt-6">
            <button type="button" @click="closeModal" class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Hủy</button>
            <button type="submit" class="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
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
import api, { getImageUrl } from '@/api/axios'
import { useToastStore } from '@/stores/toast'

const products = ref([])
const categories = ref([])
const loading = ref(true)
const showModal = ref(false)
const isEditing = ref(false)
const form = ref({
  id: null, name: '', price: 0, stock: 0, image_url: '', description: '', categoryId: null
})
const selectedFile = ref(null)
const previewImage = ref(null)
const currentPage = ref(0)
const totalPages = ref(0)
const pageSize = ref(10)
const searchKeyword = ref('')
const selectedCategoryId = ref(null)
const toastStore = useToastStore()

const fetchProducts = async (pageIndex = 0) => {
  loading.value = true
  try {
    const page = Math.max(pageIndex, 0)
    const res = await api.get('/admin/products', {
      params: { page, size: pageSize.value, keyword: searchKeyword.value, categoryId: selectedCategoryId.value }
    })
    console.log('API Response:', res.data)
    products.value = res.data.content || []
    totalPages.value = res.data.totalPages || 0
    currentPage.value = res.data.number || 0

    // Lấy danh mục - API trả về object paginated, lấy content
    const resCat = await api.get('/admin/categories')
    categories.value = Array.isArray(resCat.data) ? resCat.data : (resCat.data.content || [])
  } catch (error) {
    console.error("Lỗi tải sản phẩm:", error.response?.data || error.message)
    toastStore.error(error.response?.data?.message || 'Không thể tải danh sách sản phẩm.')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  fetchProducts(0)
}

const clearSearch = () => {
  searchKeyword.value = ''
  selectedCategoryId.value = null
  fetchProducts(0)
}

const deleteProduct = async (id) => {
  if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) return

  try {
    await api.delete(`/admin/products/${id}`)
    fetchProducts(currentPage.value)
    toastStore.success('Đã xóa thành công!')
  } catch (error) {
    console.error("Lỗi xóa sản phẩm:", error)
    toastStore.error('Xóa thất bại.')
  }
}

const openModal = (product = null) => {
  selectedFile.value = null
  previewImage.value = null
  if (product) {
    isEditing.value = true
    form.value = {
      ...product,
      price: Number(product.price || 0),
      stock: Number(product.stock || 0),
      categoryId: product.category?.id || null
    }
  } else {
    isEditing.value = false
    form.value = { name: '', price: 0, stock: 10, image_url: '', description: '', categoryId: null }
  }
  showModal.value = true
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 2 * 1024 * 1024) {
      toastStore.warning('Kích thước ảnh quá lớn (Tối đa 2MB)')
      event.target.value = ''
      return
    }
    if (!['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type)) {
      toastStore.warning('Chỉ chấp nhận định dạng JPG, PNG hoặc WebP')
      event.target.value = ''
      return
    }
    selectedFile.value = file
    previewImage.value = URL.createObjectURL(file)
  }
}

const closeModal = () => {
  showModal.value = false
}

const saveProduct = async () => {
  if (form.value.price <= 0) {
    toastStore.warning('Giá sản phẩm phải lớn hơn 0')
    return
  }

  try {
    const formData = new FormData()

    const productPayload = {
      name: form.value.name,
      price: form.value.price,
      stock: form.value.stock,
      description: form.value.description,
      category: form.value.categoryId ? { id: form.value.categoryId } : null
    }

    // Gửi product dữ liệu là string JSON, không phải Blob
    formData.append('product', JSON.stringify(productPayload))

    if (selectedFile.value) {
      formData.append('image', selectedFile.value)
    }

    if (isEditing.value) {
      formData.append('_method', 'PUT')
      await api.post(`/admin/products/${form.value.id}`, formData)
      fetchProducts(currentPage.value)
      toastStore.success('Cập nhật thành công!')
    } else {
      await api.post('/admin/products', formData)
      fetchProducts(0)
      toastStore.success('Thêm mới thành công!')
    }
    closeModal()
  } catch (error) {
    console.error("Lỗi lưu sản phẩm:", error)
    if (error.response?.data?.message) {
      toastStore.error(error.response.data.message)
    } else if (error.response?.data?.errors) {
      const errorMessages = Object.values(error.response.data.errors).flat().join(', ')
      toastStore.error(`Lỗi: ${errorMessages}`)
    } else {
      toastStore.error('Có lỗi xảy ra khi lưu sản phẩm.')
    }
  }
}

onMounted(() => {
  fetchProducts()
})
</script>