<template>
  <div class="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
    <div class="container mx-auto px-4 max-w-4xl">
      <div class="bg-white rounded-3xl shadow-2xl p-10 md:p-16 text-center">
        <!-- Success Icon -->
        <div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
          <svg class="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 class="text-4xl font-extrabold text-gray-900 mb-4">Thanh Toán Hoàn Tất!</h1>
        <p class="text-lg text-gray-600 mb-12">Hệ thống đã ghi nhận đơn hàng của bạn. Chúng tôi sẽ sớm liên hệ để xác nhận.</p>

        <!-- Stepper -->
        <div class="relative flex justify-between items-center max-w-2xl mx-auto mb-16">
          <div class="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 -z-0"></div>
          <div v-for="(step, i) in steps" :key="i" class="relative z-10 flex flex-col items-center">
            <div :class="[
              'w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-4 border-white shadow-md transition-colors',
              i === 0 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
            ]">
              {{ i + 1 }}
            </div>
            <span :class="['text-xs mt-3 font-semibold', i === 0 ? 'text-green-600' : 'text-gray-400']">
              {{ step }}
            </span>
          </div>
        </div>

        <!-- Notice Card -->
        <div class="bg-blue-50 border-l-4 border-blue-500 rounded-r-xl p-6 mb-12 text-left flex items-start gap-4">
          <div class="bg-blue-100 p-2 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 class="font-bold text-blue-900 mb-1">Thông tin xác nhận</h4>
            <p class="text-blue-800 text-sm leading-relaxed">
              Nhân viên tư vấn sẽ gọi cho bạn qua số điện thoại đã cung cấp để chốt đơn trong vòng <strong>1 giờ</strong> (giờ hành chính).
            </p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <router-link to="/my-orders" class="flex-1 max-w-xs px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-2xl hover:border-blue-500 hover:text-blue-600 transition shadow-sm">
            Lịch sử đơn hàng
          </router-link>
          <router-link to="/" class="flex-1 max-w-xs px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition shadow-lg transform hover:-translate-y-1">
            Về trang chủ
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useCheckoutStore } from '@/stores/checkout'

const checkout = useCheckoutStore()
const steps = ['Đã đặt hàng', 'Xác nhận', 'Đang giao', 'Thành công']

onMounted(() => {
  // Xóa thông tin checkout sau khi đã đặt hàng thành công
  // Để tránh người dùng quay lại trang thanh toán khi đơn đã xong
  setTimeout(() => {
    checkout.resetCheckout()
  }, 1000)
})
</script>

<style scoped>
.animate-bounce { animation: bounce 2s infinite; }
</style>