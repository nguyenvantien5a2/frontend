<template>
  <ToastNotification />
  <!-- Breadcrumb -->
  <div class="bg-white shadow-sm border-b sticky top-0 z-10">
    <div class="container mx-auto px-4 py-3">
      <div class="flex items-center text-xs md:text-sm text-gray-500 space-x-2">
        <router-link to="/" class="hover:text-blue-600 transition-colors flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Trang chủ
          </router-link>
        <span class="mx-2 text-gray-400">/</span>
        <span class="font-medium text-blue-600 uppercase tracking-wider text-xs">Khuyến mãi</span>
      </div>
    </div>
  </div>

  <div class="min-h-screen bg-gray-50 pb-20">
    <div class="container mx-auto px-4 max-w-7xl pt-8">
      <div class="mb-10 text-center">
        <h1 class="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">Ưu Đãi Đặc Biệt</h1>
        <p class="text-gray-600 max-w-2xl mx-auto">Săn ngay mã giảm giá để sở hữu những bộ linh kiện máy tính chất lượng với mức giá tốt nhất.</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-r-transparent mb-4"></div>
        <p class="text-gray-500 font-medium animate-pulse">Đang tìm kiếm deal hời cho bạn...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="promotions.length === 0" class="bg-white rounded-3xl shadow-sm p-12 md:p-20 text-center border border-gray-100">
        <div class="bg-blue-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
        </div>
        <p class="text-gray-500 mb-6">Hiện tại chưa có chương trình khuyến mãi nào đang diễn ra. Vui lòng quay lại sau nhé!</p>
        <router-link to="/" class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors">
          Tiếp tục mua sắm
        </router-link>
      </div>

      <!-- Promotions List -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="promo in promotions" :key="promo.id" class="group bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden flex flex-col h-full transform hover:-translate-y-2">
          <!-- Image Container -->
          <div class="relative h-56 overflow-hidden">
            <img :src="getImageUrl(promo.image_url) || 'https://via.placeholder.com/600x300?text=Khuyen+Mai'" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Promotion Image" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            
            <!-- Badge Discount -->
            <div class="absolute top-4 right-4">
              <span class="bg-red-600 text-white px-4 py-2 rounded-2xl text-sm font-black shadow-lg flex items-center backdrop-blur-sm bg-opacity-90">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                -{{ promo.discount_type === 'PERCENT' 
                ? Number(promo.discount_value).toFixed(0) + '%' 
                : Number(promo.discount_value).toLocaleString('vi-VN') + ' ₫' }}
              </span>
            </div>

            <!-- Date Badge -->
            <div class="absolute bottom-4 left-4 text-white text-sm font-medium flex items-center">
              <div class="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span class="text-xs">Hết hạn: {{ promo.end_date ? new Date(promo.end_date).toLocaleDateString('vi-VN') : 'Vô thời hạn' }}</span>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="p-8 flex-1 flex flex-col">
            <h2 class="text-xl font-extrabold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">{{ promo.name || promo.title }}</h2>
            <p class="text-gray-500 mb-4 flex-1 text-sm leading-relaxed line-clamp-3">{{ promo.description }}</p>
            <p v-if="promo.min_order_value > 0" class="text-[11px] text-blue-500 font-bold mb-6 flex items-center uppercase tracking-wider">
              <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
              Đơn tối thiểu {{ Number(promo.min_order_value).toLocaleString('vi-VN') }} ₫
            </p>
            
            <!-- Coupon Box -->
            <div class="mt-auto">
              <div class="bg-blue-50 border-2 border-dashed border-blue-200 rounded-2xl p-4 flex items-center justify-between relative overflow-hidden group/coupon">
                <!-- Circle cutouts -->
                <div class="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full border-r-2 border-blue-200"></div>
                <div class="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full border-l-2 border-blue-200"></div>
                
                <div class="pl-4 flex flex-col">
                  <span class="text-[10px] text-blue-400 font-black uppercase tracking-[0.2em]">Mã ưu đãi</span>
                  <span class="text-xl font-mono font-black text-blue-900 tracking-wider">{{ promo.code }}</span>
                </div>
                
                <button @click="copyCode(promo.code)" class="relative z-10 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl transition-all hover:bg-blue-700 active:scale-95 shadow-md hover:shadow-blue-200">
                  {{ copiedCode === promo.code ? 'Đã lưu!' : 'Lấy mã' }}
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
    // Gọi API lấy danh sách khuyến mãi thực tế từ Laravel
    const res = await api.get('/promotions')
    promotions.value = res.data
  } catch (err) {
    console.error('Lỗi tải khuyến mãi:', err)
    toastStore.error('Không thể kết nối đến máy chủ để lấy mã giảm giá')
  } finally {
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