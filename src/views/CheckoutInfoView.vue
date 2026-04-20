<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4 max-w-6xl">
      <CheckoutProgress :current-step="1" />

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Form thông tin -->
        <div class="lg:col-span-2 bg-white rounded-2xl shadow-xl p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <svg class="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Thông tin giao hàng
          </h2>
          
          <form id="checkout-form" @submit.prevent="submitInfo" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
              <input v-model="form.customerName" type="text" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="Nhập họ tên người nhận" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
              <input v-model="form.phone" type="tel" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="Nhập số điện thoại" />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email (Để nhận thông báo đơn hàng)</label>
              <input v-model="form.email" type="email" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="example@gmail.com" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Địa chỉ giao hàng</label>
              <textarea v-model="form.shippingAddress" rows="3" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="Nhập địa chỉ chi tiết (Số nhà, đường, phường/xã...)"></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Ghi chú đơn hàng (Tùy chọn)</label>
              <textarea v-model="form.note" rows="2" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="Ví dụ: Giao hàng giờ hành chính..."></textarea>
            </div>


          </form>
        </div>

        <!-- Sidebar Summary -->
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
              <router-link to="/cart" class="px-6 flex items-center justify-center border border-gray-300 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition hover:text-blue-600 bg-white shadow-sm">
                Quay lại giỏ hàng
              </router-link>
              <button type="submit" form="checkout-form" class="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg">
                Xác nhận
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
import { useAuthStore } from '@/stores/auth'
import api, { getImageUrl } from '@/api/axios'
import CheckoutProgress from '@/components/CheckoutProgress.vue'

const router = useRouter()
const cart = useCartStore()
const checkout = useCheckoutStore()
const authStore = useAuthStore()

const form = ref({
  customerName: '',
  phone: '',
  email: '',
  shippingAddress: '',
  note: ''
})

const discountAmount = computed(() => {
  if (!checkout.appliedCoupon || !checkout.appliedCoupon.discountPercent) return 0
  const discountValue = checkout.appliedCoupon.discountPercent / 100
  return Math.round(cart.totalPrice * discountValue)
})

const finalPrice = computed(() => {
  return Math.max(0, cart.totalPrice - discountAmount.value)
})

onMounted(async () => {
  if (cart.items.length === 0) {
    router.push('/cart')
    return
  }

  if (checkout.checkoutInfo.customerName) {
    form.value = { ...checkout.checkoutInfo }
  } else if (authStore.token) {
    try {
      const res = await api.get('/users/profile')
      form.value.customerName = res.data.name || ''
      form.value.phone = res.data.phone || ''
      form.value.email = res.data.email || ''
      form.value.shippingAddress = res.data.address || ''
    } catch (e) {
      console.error('Auto-fill profile error:', e)
    }
  }
})

const submitInfo = () => {
  checkout.saveCheckoutInfo(form.value)
  router.push('/checkout-confirm')
}
</script>