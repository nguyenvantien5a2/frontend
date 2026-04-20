<template>
  <ToastNotification />
  <!-- Breadcrumb -->
  <div class="bg-white shadow-sm border-b sticky top-0 z-10">
    <div class="container mx-auto px-4 py-3">
      <div class="flex items-center text-sm text-gray-500">
        <router-link to="/" class="hover:text-blue-600 flex items-center transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Trang chủ
        </router-link>
        <span class="mx-2 text-gray-400">/</span>
        <span class="font-semibold text-gray-900">Khuyến mãi</span>
      </div>
    </div>
  </div>

  <div class="min-h-screen bg-gray-50 pb-20">
    <div class="container mx-auto px-4 max-w-6xl pt-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-r-transparent mb-4"></div>
        <p class="text-gray-500 font-medium">Đang tải các ưu đãi hấp dẫn...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="promotions.length === 0" class="bg-white rounded-2xl shadow-sm p-16 text-center border border-gray-100">
        <div class="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">Chưa có khuyến mãi nào</h3>
        <p class="text-gray-500 mb-6">Hiện tại chưa có chương trình khuyến mãi nào đang diễn ra. Vui lòng quay lại sau nhé!</p>
        <router-link to="/" class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors">
          Tiếp tục mua sắm
        </router-link>
      </div>

      <!-- Promotions List -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        <div v-for="promo in promotions" :key="promo.id" class="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full transform hover:-translate-y-1">
          <!-- Image Container -->
          <div class="relative h-56 overflow-hidden">
            <img :src="getImageUrl(promo.imageUrl) || 'https://via.placeholder.com/600x300?text=Khuyen+Mai'" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Promotion Image" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
            
            <!-- Badge Discount -->
            <div class="absolute top-4 right-4">
              <span v-if="promo.discountPercent" class="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-lg flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Giảm {{ promo.discountPercent }}%
              </span>
              <span v-else class="bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-lg flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                Freeship
              </span>
            </div>

            <!-- Date Badge -->
            <div class="absolute bottom-4 left-4 text-white text-sm font-medium flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Hết hạn: {{ promo.endDate ? new Date(promo.endDate).toLocaleDateString('vi-VN') : 'Vô thời hạn' }}
            </div>
          </div>

          <!-- Content -->
          <div class="p-6 flex-1 flex flex-col">
            <h2 class="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">{{ promo.title }}</h2>
            <p class="text-gray-600 mb-6 flex-1 text-sm leading-relaxed line-clamp-3">{{ promo.description }}</p>
            
            <!-- Coupon Box -->
            <div class="mt-auto">
              <div class="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-1 flex items-center justify-between relative overflow-hidden">
                <!-- Left circle cutout -->
                <div class="absolute -left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white rounded-full border-r border-gray-200"></div>
                <!-- Right circle cutout -->
                <div class="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white rounded-full border-l border-gray-200"></div>
                
                <div class="pl-6 flex flex-col">
                  <span class="text-xs text-gray-500 font-semibold uppercase tracking-wider">Mã ưu đãi</span>
                  <span class="text-lg font-mono font-bold text-gray-800 tracking-wide">{{ promo.code || 'KHONGCOCODE' }}</span>
                </div>
                
                <button 
                  @click="copyCode(promo.code)" 
                  class="mr-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-bold rounded-lg transition-colors shadow-sm flex items-center"
                >
                  <span v-if="copiedCode === promo.code">Đã chép!</span>
                  <span v-else class="flex items-center">
                    Sao chép
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api, { getImageUrl } from '@/api/axios'
import { useToastStore } from '@/stores/toast'
import ToastNotification from '@/components/ToastNotification.vue'

const promotions = ref([])
const loading = ref(true)
const copiedCode = ref(null)
const toastStore = useToastStore()

onMounted(async () => {
  try {
    // Gọi API lấy danh sách khuyến mãi (Giả sử endpoint là /promotions)
    const res = await api.get('/promotions')
    promotions.value = res.data
  } catch (err) {
    console.error('Lỗi tải khuyến mãi (sẽ dùng dữ liệu mẫu):', err)
  } finally {
    // Nếu không có dữ liệu (do lỗi API hoặc API trả về rỗng), hiển thị dữ liệu mẫu để demo
    if (promotions.value.length === 0) {
      promotions.value = [
        {
          id: 1,
          title: 'Siêu Sale Khai Trương',
          description: 'Giảm giá cực sốc lên đến 20% cho các sản phẩm chuột gaming và bàn phím cơ nhân dịp khai trương.',
          discountPercent: 20,
          imageUrl: '/chuot/6.jpg', // Thay bằng đường dẫn tương đối nếu ảnh nằm trong static/chuot
          code: 'HELLO2024',
          endDate: '2025-12-31'
        },
        {
          id: 2,
          title: 'Miễn Phí Vận Chuyển',
          description: 'Freeship cho đơn hàng từ 500k. Áp dụng cho tất cả các tỉnh thành trên toàn quốc.',
          discountPercent: null,
          imageUrl: '/uploads/freeship.jpg', // Ví dụ ảnh upload
          code: 'FREESHIP',
          endDate: null
        }
      ]
    }
    loading.value = false
  }
})

const copyCode = (code) => {
  if (!code) return
  navigator.clipboard.writeText(code)
  copiedCode.value = code
  toastStore.success(`Đã sao chép mã: ${code}`)
  
  setTimeout(() => {
    copiedCode.value = null
  }, 2000)
}
</script>