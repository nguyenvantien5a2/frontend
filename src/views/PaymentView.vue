<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4 max-w-6xl">
      <CheckoutProgress :current-step="3" />

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Thanh toán -->
        <div class="lg:col-span-2 bg-white rounded-2xl shadow-xl p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <svg class="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Thanh toán giả lập
          </h2>

          <div class="flex justify-center mb-6">
            <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex flex-col items-center">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png" class="w-60 h-60" />
            </div>
          </div>

          <div class="text-center mb-8">
            <div class="inline-block bg-red-50 border border-red-100 rounded-full px-6 py-2">
              <p class="text-red-600 font-bold flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Hết hạn trong: {{ countdownDisplay }}
              </p>
            </div>
          </div>

          <button @click="simulateSuccess" :disabled="countdown <= 0 || loading" class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed">
            {{ loading ? 'Đang xử lý...' : 'Tôi đã thanh toán' }}
          </button>

          <div class="mt-6 text-center">
            <router-link to="/checkout-confirm" class="text-gray-500 hover:text-blue-600 font-medium transition inline-flex items-center">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              Quay lại chọn phương thức khác
            </router-link>
          </div>
        </div>

        <!-- Thông tin đơn hàng (Sidebar Sticky) -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-2xl shadow-xl p-6 sticky top-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Thông tin đơn hàng
            </h2>
            <div class="space-y-3 mb-6 text-sm">
              <p class="flex justify-between text-gray-700">
                <span class="text-gray-500">Người nhận:</span>
                <span class="font-medium text-right ml-2">{{ checkout.checkoutInfo.customerName }}</span>
              </p>
              <p class="flex justify-between text-gray-700">
                <span class="text-gray-500">SĐT:</span>
                <span class="font-medium text-right ml-2">{{ checkout.checkoutInfo.phone }}</span>
              </p>
              <p class="flex flex-col text-gray-700">
                <span class="text-gray-500 mb-1">Địa chỉ:</span>
                <span class="font-medium bg-gray-50 p-2 rounded">{{ checkout.checkoutInfo.shippingAddress }}</span>
              </p>
            </div>

            <h3 class="font-bold text-gray-900 mb-3 border-t pt-3">Sản phẩm</h3>
            <div class="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar mb-4">
              <div v-for="item in cart.items" :key="item.id" class="flex items-center gap-3">
                <div class="relative">
                  <img :src="getImageUrl(item.imageUrl) || 'https://via.placeholder.com/60'" class="w-12 h-12 object-cover rounded-lg border border-gray-100" />
                  <span class="absolute -top-2 -right-2 bg-gray-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">{{ item.quantity }}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="text-sm font-medium text-gray-900 truncate">{{ item.name }}</h4>
                  <p class="text-xs text-gray-500">{{ item.price.toLocaleString('vi-VN') }} ₫</p>
                </div>
                <div class="text-sm font-bold text-gray-900">
                  {{ (item.price * item.quantity).toLocaleString('vi-VN') }} ₫
                </div>
              </div>
            </div>
            
            <div class="mt-4 pt-4 border-t space-y-2">
              <div class="flex justify-between text-gray-600">
                <span>Phí vận chuyển:</span>
                <span class="font-medium text-green-600">Miễn phí</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>Tạm tính:</span>
                <span>{{ cart.totalPrice.toLocaleString('vi-VN') }} ₫</span>
              </div>
              <div v-if="checkout.appliedCoupon" class="flex justify-between font-medium text-green-600">
                <span>Giảm giá ({{ checkout.appliedCoupon.code }}):</span>
                <span>{{ discountAmount > 0 ? '-' + discountAmount.toLocaleString('vi-VN') + ' ₫' : 'Đã áp dụng' }}</span>
              </div>
              <div class="flex justify-between font-bold text-xl mt-2 border-t pt-2">
                <span>Tổng thanh toán:</span>
                <span class="text-red-600">{{ finalPrice.toLocaleString('vi-VN') }} ₫</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useCheckoutStore } from '@/stores/checkout'
import { useAuthStore } from '@/stores/auth'
import { useOrdersStore } from '@/stores/orders'
import CheckoutProgress from '@/components/CheckoutProgress.vue'
import api, { getImageUrl } from '@/api/axios'

const router = useRouter()
const cart = useCartStore()
const checkout = useCheckoutStore()
const authStore = useAuthStore()
const ordersStore = useOrdersStore()

const countdown = ref(300)
const countdownDisplay = ref('05:00')
const loading = ref(false)
let timer = null

const discountAmount = computed(() => {
  if (!checkout.appliedCoupon || !checkout.appliedCoupon.discountPercent) return 0
  const discountValue = checkout.appliedCoupon.discountPercent / 100
  return Math.round(cart.totalPrice * discountValue)
})

const finalPrice = computed(() => {
  return Math.max(0, cart.totalPrice - discountAmount.value)
})

onMounted(() => {
  timer = setInterval(() => {
    countdown.value--
    const min = Math.floor(countdown.value / 60).toString().padStart(2, '0')
    const sec = (countdown.value % 60).toString().padStart(2, '0')
    countdownDisplay.value = `${min}:${sec}`
    if (countdown.value <= 0) {
      clearInterval(timer)
      alert('Hết thời gian thanh toán!')
      router.push('/checkout-confirm')
    }
  }, 1000)
})

onUnmounted(() => clearInterval(timer))

const simulateSuccess = async () => {
  loading.value = true
  try {
    // Tạo request tới API backend
    const orderRequest = {
      customerName: checkout.checkoutInfo.customerName,
      shippingAddress: checkout.checkoutInfo.shippingAddress,
      phone: checkout.checkoutInfo.phone,
      email: checkout.checkoutInfo.email,
      note: checkout.checkoutInfo.note,
      couponCode: checkout.appliedCoupon?.code, // Gửi mã coupon lên backend
      paymentMethod: 'MoMo',
      items: cart.items.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }))
    }
    
    console.log('📦 Gửi request POST /orders:', orderRequest)
    const response = await api.post('/orders', orderRequest)
    console.log('✅ Đơn hàng tạo thành công:', response.data)

    // Sau 1.5s mô phỏng xử lý thanh toán
    setTimeout(() => {
      cart.clearCart()
      checkout.clearCheckoutInfo()
      router.push('/payment-success')
      loading.value = false
    }, 1500)
  } catch (err) {
    console.error('❌ Lỗi tạo đơn hàng:', err)
    const errorMsg = typeof err.response?.data === 'string' 
      ? err.response.data 
      : (err.response?.data?.message || err.message || 'Lỗi không xác định')
    alert('Lỗi: ' + errorMsg)
    loading.value = false
  }
}
</script>