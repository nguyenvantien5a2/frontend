<template>
  <ToastNotification />
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
            Thanh toán qua MoMo (Giả lập)
          </h2>

          <div class="flex justify-center mb-6">
            <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex flex-col items-center">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png" class="w-60 h-60" />
              <p class="mt-4 text-sm text-gray-500 italic">Quét mã để thanh toán đơn hàng</p>
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

          <button @click="simulateSuccess" :disabled="countdown <= 0 || loading" class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            <svg v-if="loading" class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? 'Đang xử lý đơn hàng...' : 'Tôi đã hoàn tất thanh toán' }}
          </button>

          <div class="mt-6 text-center">
            <router-link to="/checkout-confirm" class="text-gray-500 hover:text-blue-600 font-medium transition inline-flex items-center">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              Quay lại bước xác nhận
            </router-link>
          </div>
        </div>

        <!-- Sidebar Thông tin -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-2xl shadow-xl p-6 sticky top-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Tóm tắt đơn hàng</h2>
            <div class="space-y-3 mb-6 text-sm">
              <div class="flex justify-between"><span class="text-gray-500">Người nhận:</span><span class="font-medium">{{ checkout.checkoutInfo.customerName }}</span></div>
              <div class="flex justify-between"><span class="text-gray-500">SĐT:</span><span class="font-medium">{{ checkout.checkoutInfo.phone }}</span></div>
              <div class="flex flex-col"><span class="text-gray-500">Địa chỉ:</span><span class="font-medium text-xs mt-1 bg-gray-50 p-2 rounded">{{ checkout.checkoutInfo.shippingAddress }}</span></div>
            </div>

            <div class="border-t pt-4 mb-4 max-h-48 overflow-y-auto custom-scrollbar">
              <div v-for="item in cart.items" :key="item.id" class="flex items-center gap-3 mb-3">
                <img :src="getImageUrl(item.image_url || item.imageUrl)" class="w-10 h-10 object-cover rounded shadow-sm" />
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-medium truncate">{{ item.name }}</p>
                  <p class="text-[10px] text-gray-700">Số lượng: {{ item.quantity }}</p>
                </div>
                <div class="text-xs font-bold">{{ (item.price * item.quantity).toLocaleString('vi-VN') }} ₫</div>
              </div>
            </div>
            
            <div class="pt-4 border-t space-y-2">
              <div class="flex justify-between text-sm"><span>Tạm tính:</span><span>{{ cart.totalPrice.toLocaleString('vi-VN') }} ₫</span></div>
              <div v-if="discountAmount > 0" class="flex justify-between text-sm text-green-600">
                <span>Giảm giá:</span><span>-{{ discountAmount.toLocaleString('vi-VN') }} ₫</span>
              </div>
              <div class="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Tổng cộng:</span><span class="text-red-600">{{ finalPrice.toLocaleString('vi-VN') }} ₫</span>
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
import { useOrdersStore } from '@/stores/orders'
import { useToastStore } from '@/stores/toast'
import { getImageUrl } from '@/api/axios'
import CheckoutProgress from '@/components/CheckoutProgress.vue'
import ToastNotification from '@/components/ToastNotification.vue' // Import ToastNotification

const router = useRouter()
const cart = useCartStore()
const checkout = useCheckoutStore()
const ordersStore = useOrdersStore()
const toastStore = useToastStore()
const countdown = ref(300)
const countdownDisplay = ref('05:00')
const loading = ref(false)
let timer = null

const discountAmount = computed(() => {
  if (!checkout.appliedCoupon) return 0
  const total = cart.totalPrice
  if (checkout.appliedCoupon.discount_type === 'PERCENT') {
    let discount = total * (checkout.appliedCoupon.discount_value / 100)
    if (checkout.appliedCoupon.max_discount_value) {
      discount = Math.min(discount, checkout.appliedCoupon.max_discount_value)
    }
    return Math.round(discount)
  }
  return checkout.appliedCoupon.discount_value
})

const finalPrice = computed(() => Math.max(0, cart.totalPrice - discountAmount.value))

onMounted(() => {
  timer = setInterval(() => {
    if (countdown.value <= 0) {
      clearInterval(timer)
      alert('Hết thời gian thanh toán!')
      router.push('/checkout-confirm')
      return
    }
    countdown.value--
    const min = Math.floor(countdown.value / 60).toString().padStart(2, '0')
    const sec = (countdown.value % 60).toString().padStart(2, '0')
    countdownDisplay.value = `${min}:${sec}`
  }, 1000)
})

onUnmounted(() => clearInterval(timer))

const simulateSuccess = async () => {
  loading.value = true
  try {
    // Map dữ liệu sang đúng định dạng snake_case của Backend Laravel
    const orderData = {
      customer_name: checkout.checkoutInfo.customerName,
      phone: checkout.checkoutInfo.phone,
      shipping_address: checkout.checkoutInfo.shippingAddress,
      note: checkout.checkoutInfo.note,
      coupon_code: checkout.appliedCoupon?.code || null,
      payment_method: 'MOMO',
      details: cart.items.map(item => ({
        product_id: item.product_id || item.id,
        quantity: item.quantity
      }))
    }
    
    console.log('🚀 Gửi đơn hàng tới API:', orderData)
    await ordersStore.createOrder(orderData)

    cart.clearCart()
    checkout.resetCheckout()
    
    setTimeout(() => {
      router.push('/payment-success')
      loading.value = false
    }, 1000)
  } catch (err) {
    console.error('❌ Lỗi tạo đơn hàng:', err)
    const errorMsg = err.response?.data?.message || err.message || 'Lỗi kết nối máy chủ'
    toastStore.error('Không thể tạo đơn hàng: ' + errorMsg) // Hiển thị toast lỗi
    loading.value = false
  }
}
</script>