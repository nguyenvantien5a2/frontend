<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4 max-w-6xl">
      <CheckoutProgress :current-step="2" />
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <!-- Cột trái: Thông tin & Thanh toán -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white rounded-2xl shadow-xl p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg class="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Xác nhận thông tin
            </h2>

            <div class="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-4">
              <div class="flex flex-col sm:flex-row sm:justify-between border-b border-gray-200 pb-3">
                <span class="text-gray-700 text-sm font-medium uppercase">Người nhận</span>
                <span class="font-bold text-gray-900 text-right">{{ info.customerName }} — {{ info.phone }}</span>
              </div>
              <div class="flex flex-col sm:flex-row sm:justify-between border-b border-gray-200 pb-3">
                <span class="text-gray-700 text-sm font-medium uppercase">Địa chỉ giao hàng</span>
                <span class="font-medium text-gray-700 text-right sm:max-w-xs">{{ info.shippingAddress }}</span>
              </div>
              <div class="flex flex-col sm:flex-row sm:justify-between border-b border-gray-200 pb-3">
                <span class="text-gray-700 text-sm font-medium uppercase">Email</span>
                <span class="font-medium text-gray-700">{{ info.email }}</span>
              </div>
              <div class="flex flex-col sm:flex-row sm:justify-between">
                <span class="text-gray-700 text-sm font-medium uppercase">Ghi chú</span>
                <span class="font-medium text-gray-700 italic">{{ info.note || 'Không có ghi chú' }}</span>
              </div>
            </div>

            <!-- Chọn phương thức thanh toán -->
            <div class="mt-10 border-t pt-8">
              <h3 class="text-xl font-bold text-gray-900 mb-6">Phương thức thanh toán</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button type="button" @click="paymentMethod = 'MoMo'" 
                  :class="paymentMethod === 'MoMo' ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-100' : 'border-gray-200 hover:border-blue-300'" 
                  class="p-6 border-2 rounded-2xl text-center transition-all group">
                  <img src="/images/logoMomo.jpg" class="h-12 mx-auto mb-3 object-contain rounded-lg shadow-sm" alt="MoMo" />
                  <span class="font-bold text-gray-900 group-hover:text-blue-600">Ví điện tử MoMo</span>
                </button>

                <button type="button" @click="paymentMethod = 'COD'" 
                  :class="paymentMethod === 'COD' ? 'border-green-600 bg-green-50 ring-2 ring-green-100' : 'border-gray-200 hover:border-green-300'" 
                  class="p-6 border-2 rounded-2xl text-center transition-all group">
                  <svg class="w-12 h-12 mx-auto mb-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span class="font-bold text-gray-900 group-hover:text-green-600">Thanh toán khi nhận hàng (COD)</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Cột phải: Sidebar Tóm tắt đơn hàng (Sticky) -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-2xl shadow-xl p-6 sticky top-6">
            <h2 class="text-xl font-bold text-gray-900 mb-4">Đơn hàng của bạn</h2>
            
            <div class="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar mb-6">
              <div v-for="item in cart.items" :key="item.id" class="flex items-center gap-3">
                <div class="relative overflow-visible">
                  <img :src="getImageUrl(item.image_url) || 'https://via.placeholder.com/60'" class="w-16 h-16 object-cover rounded-lg border border-gray-100" />
                  <span class="absolute -top-2 -right-2 bg-gray-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">{{ item.quantity }}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="text-sm font-medium text-gray-900 truncate">{{ item.name }}</h3>
                  <p class="text-sm text-gray-700">
                    {{ Number(item.price).toLocaleString('vi-VN', { maximumFractionDigits: 0 }) }} ₫
                  </p>
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
                <span>
                  {{ discountAmount > 0 ? '-' + discountAmount.toLocaleString('vi-VN') + ' ₫' : 'Đã áp dụng' }}
                </span>
              </div>
              <div class="flex justify-between font-bold text-xl mt-2 border-t pt-4 text-gray-900">
                <span>Tổng cộng:</span>
                <span class="text-red-600">{{ finalPrice.toLocaleString('vi-VN') }} ₫</span>
              </div>
            </div>

            <div class="mt-6 flex flex-col gap-3">
              <button @click="handlePlaceOrder" :disabled="loading" 
                class="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg">
                {{ loading ? 'Đang xử lý...' : 'Xác nhận đặt hàng' }}
              </button>
              <router-link to="/checkout-info" class="text-center text-gray-700 hover:text-blue-600 font-medium">Quay lại chỉnh sửa</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useCheckoutStore } from '@/stores/checkout'
import { useToastStore } from '@/stores/toast'
import api, { getImageUrl } from '@/api/axios'
import CheckoutProgress from '@/components/CheckoutProgress.vue'

const router = useRouter()
const cart = useCartStore()
const checkout = useCheckoutStore()
const toast = useToastStore()

const loading = ref(false)
const paymentMethod = ref('MoMo') // Mặc định là MoMo

const info = computed(() => checkout.checkoutInfo)

const discountAmount = computed(() => {
  const coupon = checkout.appliedCoupon
  if (!coupon) return 0
  
  let discount = 0
  // Đồng bộ logic tính toán với CheckoutInfo.vue và Backend
  if (coupon.discount_type === 'PERCENT') {
    const val = parseFloat(coupon.discount_value) || 0
    discount = cart.totalPrice * (val / 100)
    if (coupon.max_discount_value && discount > parseFloat(coupon.max_discount_value)) {
      discount = parseFloat(coupon.max_discount_value)
    }
  } else {
    discount = parseFloat(coupon.discount_value) || 0
  }
  
  // Đảm bảo số tiền giảm không vượt quá tổng giá trị giỏ hàng
  return Math.min(discount, cart.totalPrice)
})
const finalPrice = computed(() => Math.max(0, cart.totalPrice - discountAmount.value))

const handlePlaceOrder = async () => {
  if (paymentMethod.value === 'MoMo') {
    router.push('/payment')
    return
  }

  loading.value = true
  try {

    // Ánh xạ chính xác các trường Backend Laravel yêu cầu
    const orderData = {
      customer_name: info.value.customerName, 
      phone: info.value.phone,
      shipping_address: info.value.shippingAddress, 
      note: info.value.note || '',
      payment_method: paymentMethod.value,
      coupon_code: checkout.appliedCoupon?.code || null,
      details: cart.items.map(item => ({
        product_id: item.id || item.product_id,
        quantity: item.quantity
      }))
    }

    const response = await api.post('/orders', orderData)
    toast.success('Đặt hàng thành công! Cảm ơn bạn đã ủng hộ.')
    
    // Dọn dẹp giỏ hàng và store checkout
    cart.clearCart()
    cart.persistCart()
    checkout.resetCheckout()
    
    router.push('/payment-success')
  } catch (err) {
    toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi đặt hàng')
  } finally { loading.value = false }
}
</script>