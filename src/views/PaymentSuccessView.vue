<template>
  <div class="min-h-screen bg-gradient-to-b from-green-50 to-white py-8">
    <div class="container mx-auto px-4 max-w-6xl">

      <div class="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center mt-8">
        <div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <svg class="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 class="text-4xl font-bold text-gray-900 mb-4">Thanh Toán Thành Công!</h1>
        <p class="text-xl text-gray-600 mb-10">Cảm ơn bạn đã mua sắm tại TBNV Shop. Đơn hàng của bạn đã được tiếp nhận.</p>

        <!-- Order Status Steps -->
        <div class="max-w-3xl mx-auto mb-12">
          <div class="flex justify-between items-center relative">
            <!-- Line -->
            <div class="absolute top-4 left-0 w-full h-1 bg-gray-100 -z-10"></div>
            
            <div class="flex flex-col items-center">
              <div class="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold mb-2 shadow-sm ring-4 ring-white">1</div>
              <span class="text-sm font-bold text-green-600">Đã đặt hàng</span>
            </div>
            <div class="flex flex-col items-center">
              <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-sm font-bold mb-2 shadow-sm ring-4 ring-white">2</div>
              <span class="text-sm text-gray-500">Xác nhận</span>
            </div>
            <div class="flex flex-col items-center">
              <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-sm font-bold mb-2 shadow-sm ring-4 ring-white">3</div>
              <span class="text-sm text-gray-500">Giao hàng</span>
            </div>
            <div class="flex flex-col items-center">
              <div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-sm font-bold mb-2 shadow-sm ring-4 ring-white">4</div>
              <span class="text-sm text-gray-500">Nhận hàng</span>
            </div>
          </div>
        </div>

        <!-- Info Box -->
        <div class="bg-blue-50 border border-blue-100 rounded-xl p-6 max-w-2xl mx-auto mb-10 flex items-start text-left">
          <svg class="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <p class="text-blue-800 text-base">
            Chúng tôi sẽ liên hệ với bạn qua số điện thoại để xác nhận đơn hàng trong vòng <strong>24h</strong>. Vui lòng để ý điện thoại nhé!
          </p>
        </div>

        <!-- Buttons -->
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <router-link to="/orders" class="px-8 py-4 border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:border-blue-600 hover:text-blue-600 transition text-center min-w-[200px]">
            Xem đơn hàng
          </router-link>
          <router-link to="/" class="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition text-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 min-w-[200px]">
            Tiếp tục mua sắm
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useCheckoutStore } from '@/stores/checkout'
import CheckoutProgress from '@/components/CheckoutProgress.vue'

const checkout = useCheckoutStore()

onMounted(() => checkout.clearCheckoutInfo())
</script>