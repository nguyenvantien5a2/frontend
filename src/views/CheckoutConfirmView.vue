<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4 max-w-6xl">
      <CheckoutProgress :current-step="2" />

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Xác nhận thông tin + Thanh toán -->
        <div class="lg:col-span-2 bg-white rounded-2xl shadow-xl p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-8 flex items-center">
            <svg class="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Xác nhận thông tin
          </h2>

          <!-- Thông tin rút gọn -->
          <div class="bg-gray-50 p-6 rounded-xl mb-8 border border-gray-100">
            <ul class="space-y-3 text-gray-700">
              <li class="flex flex-col sm:flex-row sm:justify-between border-b border-gray-200 pb-2 last:border-0 last:pb-0">
                <span class="text-gray-500 text-sm">Người nhận</span>
                <span class="font-medium">{{ checkout.checkoutInfo.customerName }} - {{ checkout.checkoutInfo.phone }}</span>
              </li>
              <li class="flex flex-col sm:flex-row sm:justify-between border-b border-gray-200 pb-2 last:border-0 last:pb-0">
                <span class="text-gray-500 text-sm">Địa chỉ</span>
                <span class="font-medium text-right sm:max-w-xs">{{ checkout.checkoutInfo.shippingAddress }}</span>
              </li>
              <li class="flex flex-col sm:flex-row sm:justify-between">
                <span class="text-gray-500 text-sm">Ghi chú</span>
                <span class="font-medium">{{ checkout.checkoutInfo.note || 'Không có' }}</span>
              </li>
            </ul>
          </div>

          <!-- Chọn phương thức thanh toán -->
          <div class="border-t pt-8">
            <h3 class="text-xl font-bold text-gray-900 mb-6">Phương thức thanh toán</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button type="button" @click="selectPayment('MoMo')" :class="paymentMethod === 'MoMo' ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:border-blue-400'" class="p-6 border-2 rounded-xl text-center transition">
                <img src="/images/logoMomo.jpg" class="h-12 mx-auto mb-2 object-contain" alt="MoMo" />
                <span class="font-bold text-lg">MoMo</span>
              </button>

              <button type="button" @click="selectPayment('COD')" :class="paymentMethod === 'COD' ? 'border-green-600 bg-green-50' : 'border-gray-300 hover:border-green-400'" class="p-6 border-2 rounded-xl text-center transition">
                <svg class="w-10 h-10 mx-auto mb-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="font-bold text-lg">Thanh toán khi nhận hàng (COD)</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Đơn hàng (Sidebar Sticky) -->
        <div class="lg:col-span-1">
          <div class="sticky top-6">
            <div class="bg-white rounded-2xl shadow-xl p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Đơn hàng của bạn</h2>
            
            <div class="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar mb-6">
              <div v-for="item in cart.items" :key="item.id" class="flex items-center gap-3">
                <div class="relative">
                  <img :src="getImageUrl(item.imageUrl) || 'https://via.placeholder.com/60'" class="w-16 h-16 object-cover rounded-lg border border-gray-100" />
                  <span class="absolute -top-2 -right-2 bg-gray-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">{{ item.quantity }}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="text-sm font-medium text-gray-900 truncate">{{ item.name }}</h3>
                  <p class="text-sm text-gray-500">{{ item.price.toLocaleString('vi-VN') }} ₫</p>
                </div>
                <div class="text-sm font-bold text-gray-900">
                  {{ (item.price * item.quantity).toLocaleString('vi-VN') }} ₫
                </div>
              </div>
            </div>

            <div class="border-t pt-4 space-y-2">
              <div class="flex justify-between text-gray-600">
                <span>Tạm tính:</span>
                <span>{{ cart.totalPrice.toLocaleString('vi-VN') }} ₫</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>Phí vận chuyển:</span>
                <span class="text-green-600 font-medium">Miễn phí</span>
              </div>
              <div v-if="checkout.appliedCoupon" class="flex justify-between font-medium text-green-600">
                <span>Giảm giá ({{ checkout.appliedCoupon.code }}):</span>
                <span>{{ discountAmount > 0 ? '-' + discountAmount.toLocaleString('vi-VN') + ' ₫' : 'Đã áp dụng' }}</span>
              </div>
              <div class="flex justify-between font-bold text-xl mt-2 border-t pt-4 text-gray-900">
                <span>Tổng cộng:</span>
                <span class="text-red-600">{{ finalPrice.toLocaleString('vi-VN') }} ₫</span>
              </div>
            </div>
            </div>
            <div class="mt-6 flex gap-3">
              <router-link to="/checkout-info" class="px-6 flex items-center justify-center border border-gray-300 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition hover:text-blue-600 bg-white shadow-sm">
                Quay lại thông tin
              </router-link>
              <button @click="handleConfirm" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition text-lg shadow-lg">
                Thanh toán
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useCheckoutStore } from '@/stores/checkout'
import CheckoutProgress from '@/components/CheckoutProgress.vue'
import api, { getImageUrl } from '@/api/axios'

const router = useRouter()
const cart = useCartStore()
const checkout = useCheckoutStore()

const paymentMethod = ref('')

const discountAmount = computed(() => {
  if (!checkout.appliedCoupon || !checkout.appliedCoupon.discountPercent) return 0
  const discountValue = checkout.appliedCoupon.discountPercent / 100
  return Math.round(cart.totalPrice * discountValue)
})

const finalPrice = computed(() => {
  return Math.max(0, cart.totalPrice - discountAmount.value)
})

onMounted(() => {
  if (!checkout.checkoutInfo.customerName) {
    router.push('/checkout-info')
  }
})

const selectPayment = (method) => {
  paymentMethod.value = method
}

const handleConfirm = async () => {
  if (!paymentMethod.value) {
    alert('Vui lòng chọn phương thức thanh toán!')
    return
  }

  if (paymentMethod.value === 'MoMo') {
    router.push('/payment')
  } else {
    // COD - Create order immediately
    try {
      const orderRequest = {
        customerName: checkout.checkoutInfo.customerName,
        shippingAddress: checkout.checkoutInfo.shippingAddress,
        phone: checkout.checkoutInfo.phone,
        email: checkout.checkoutInfo.email,
        note: checkout.checkoutInfo.note,
        couponCode: checkout.appliedCoupon?.code, // Gửi mã coupon lên backend
        paymentMethod: 'COD',
        items: cart.items.map(item => ({
          productId: item.id,
          quantity: item.quantity
        }))
      }
      
      await api.post('/orders', orderRequest)
      
      alert(`Bạn cần chuẩn bị số tiền ${finalPrice.value.toLocaleString('vi-VN')} ₫ để thanh toán cho shipper.`)
      cart.clearCart()
      checkout.clearCheckoutInfo()
      router.push('/payment-success')
    } catch (err) {
      console.error('Lỗi tạo đơn hàng:', err)
      alert('Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.')
    }
  }
}
</script>