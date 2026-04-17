<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4 max-w-6xl">
      <CheckoutProgress :current-step="1" />

      <div v-if="cart.items?.length > 0" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 bg-white rounded-2xl shadow-xl p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <svg class="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            Thông tin giao hàng
          </h2>
          
          <form id="checkout-form" @submit.prevent="submitInfo" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
              <input v-model="form.customerName" type="text" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="Nhập họ tên người nhận" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
              <input v-model="form.phone" type="tel" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="Nhập số điện thoại" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input v-model="form.email" type="email" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="example@gmail.com" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Địa chỉ giao hàng</label>
              <textarea v-model="form.shippingAddress" rows="3" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="Số nhà, tên đường, phường/xã..."></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Ghi chú (Tùy chọn)</label>
              <textarea v-model="form.note" rows="2" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="Ghi chú thêm về đơn hàng..."></textarea>
            </div>
          </form>
        </div>
        
        <div class="lg:col-span-1">
          <div class="bg-white rounded-2xl shadow-xl p-6 sticky top-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Đơn hàng của bạn</h2>
            
            <div class="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar mb-6">
              <div v-for="item in cart.items" :key="item.id" class="flex items-center gap-3">
                <div class="relative">
                  <img :src="getImageUrl(item.image_url) || 'https://via.placeholder.com/60'" class="w-16 h-16 object-cover rounded-lg border border-gray-100" />
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
                <span>{{ (cart.totalPrice || 0).toLocaleString('vi-VN') }} ₫</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>Phí vận chuyển:</span>
                <span class="text-green-600 font-medium">Miễn phí</span>
              </div>
              
              <div v-if="checkout.appliedCoupon" class="flex justify-between font-medium text-green-600">
                <span>Giảm giá ({{ checkout.appliedCoupon.code }}):</span>
                <span>
                  {{ discountAmount > 0 ? '-' + discountAmount.toLocaleString('vi-VN') + ' ₫' : 'Đã áp dụng' }}
                </span>
              </div>
              <div class="flex justify-between font-bold text-xl mt-2 border-t pt-4 text-gray-900">
                <span>Tổng cộng:</span>
                <span class="text-red-600">{{ finalPrice.toLocaleString('vi-VN') }} ₫</span>
              </div>
              <div class="mt-6 flex flex-col gap-3">
                <button type="submit" form="checkout-form" class="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg">
                  Tiếp tục xác nhận
                </button>
                <router-link to="/cart" class="text-center text-gray-500 hover:text-blue-600 font-medium">Quay lại giỏ hàng</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-20 bg-white rounded-2xl shadow">
        <p class="text-gray-500 mb-4">Giỏ hàng của bạn đang trống</p>
        <router-link to="/products" class="text-blue-600 font-bold">Quay lại mua sắm</router-link>
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
import api from '@/api/axios'
import { getImageUrl } from '@/api/axios' // Import getImageUrl
import CheckoutProgress from '@/components/CheckoutProgress.vue'

const router = useRouter()
const cart = useCartStore()
const checkout = useCheckoutStore()
const authStore = useAuthStore()

const form = ref({
  customerName: checkout.checkoutInfo?.customerName || '',
  phone: checkout.checkoutInfo?.phone || '',
  email: checkout.checkoutInfo?.email || '',
  shippingAddress: checkout.checkoutInfo?.shippingAddress || '',
  note: checkout.checkoutInfo?.note || ''
})

const discountAmount = computed(() => {
  const coupon = checkout.appliedCoupon
  if (!coupon || !cart.totalPrice) return 0
  
  let discount = 0
  // Đồng bộ logic theo Backend (Promotion model)
  if (coupon.discount_type === 'PERCENT') {
    const val = parseFloat(coupon.discount_value) || 0
    discount = cart.totalPrice * (val / 100)
    if (coupon.max_discount_value && discount > parseFloat(coupon.max_discount_value)) {
      discount = parseFloat(coupon.max_discount_value)
    }
  } else {
    discount = parseFloat(coupon.discount_value) || 0
  }
  return Math.min(discount, cart.totalPrice)
})

const finalPrice = computed(() => Math.max(0, cart.totalPrice - discountAmount.value))

onMounted(async () => {
  if (!cart.items || cart.items.length === 0) {
    router.push('/cart')
    return
  }

  // Nếu chưa có thông tin trong store và đã đăng nhập, tự động lấy từ Profile
  if (!form.value.customerName && authStore.token) {
    try {
      const res = await api.get('/users/profile') 
      // Đảm bảo userData tồn tại trước khi truy cập các thuộc tính
      const userData = res.data || {}
      form.value = {
        customerName: userData.name || userData.customer_name || '',
        phone: userData.phone || userData.phone_number || '',
        email: userData.email || authStore.user?.email || '',
        shippingAddress: userData.address || '',
        note: ''
      }
    } catch (e) { console.error('Lỗi lấy profile:', e) }
  }
})

const submitInfo = () => {
  checkout.saveCheckoutInfo(form.value)
  router.push('/checkout-confirm')
}
</script>