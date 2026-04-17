<template>
  <ToastNotification />
  <div class="min-h-screen bg-gray-50 py-10">
    <div class="container mx-auto px-4 max-w-6xl">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Giỏ Hàng Của Bạn</h1>

      <div v-if="cartStore.items.length === 0" class="text-center py-20 bg-white rounded-2xl shadow-sm">
        <div class="text-6xl mb-4">🛒</div>
        <p class="text-xl text-gray-500 mb-6">Giỏ hàng đang trống</p>
        <router-link to="/" class="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition">
          Tiếp tục mua sắm
        </router-link>
      </div>

      <div v-else class="flex flex-col lg:flex-row gap-8">
        <!-- Danh sách sản phẩm -->
        <div class="lg:w-2/3">
          <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div v-for="item in cartStore.items" :key="item.id" class="p-6 border-b last:border-b-0 flex flex-col sm:flex-row items-center gap-6">
              <img :src="getImageUrl(item.image_url) || 'https://via.placeholder.com/100'" class="w-24 h-24 object-cover rounded-lg" alt="Sản phẩm" />
              
              <div class="flex-1 text-center sm:text-left">
                <h3 class="font-bold text-lg text-gray-900 mb-1">{{ item.name }}</h3>
                <p class="text-blue-600 font-medium">{{ item.price.toLocaleString('vi-VN') }} ₫</p>
                <p class="text-sm text-gray-500 mt-1">Kho: {{ item.stock }}</p>
              </div>

              <!-- Điều chỉnh số lượng -->
              <div class="flex items-center border border-gray-300 rounded-lg">
                <button @click="decreaseQuantity(item)" class="px-3 py-2 hover:bg-gray-100 text-gray-600 transition border-r border-gray-300 font-bold">-</button>
                <input 
                  type="number" 
                  :value="item.quantity"
                  @change="e => handleQuantityInput(item, e.target.value)"
                  class="w-14 text-center py-2 focus:outline-none appearance-none m-0 font-medium" 
                  min="1"
                />
                <button @click="increaseQuantity(item)" class="px-3 py-2 hover:bg-gray-100 text-gray-600 transition border-l border-gray-300 font-bold">+</button>
              </div>

              <!-- Thành tiền sản phẩm -->
              <div class="font-bold text-gray-900 w-32 text-right hidden sm:block">
                {{ (item.price * item.quantity).toLocaleString('vi-VN') }} ₫
              </div>

              <!-- Nút xóa -->
              <button @click="removeItem(item.id)" class="text-gray-400 hover:text-red-500 transition p-2 rounded-full hover:bg-red-50" title="Xóa sản phẩm">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Tóm tắt đơn hàng -->
        <div class="lg:w-1/3">
          <div class="bg-white rounded-2xl shadow-sm p-6 sticky top-4">
            <h2 class="text-xl font-bold text-gray-900 mb-6">Tổng quan đơn hàng</h2>
            
            <div class="flex justify-between mb-4 text-gray-600">
              <span>Tạm tính</span>
              <span>{{ cartStore.totalPrice.toLocaleString('vi-VN') }} ₫</span>
            </div>
            <div class="flex justify-between mb-6 text-gray-600">
              <span>Phí vận chuyển</span>
              <span class="text-green-600 font-medium">Miễn phí</span>
            </div>
            
            <!-- Nhập mã giảm giá -->
            <div class="mb-6">
              <div class="flex gap-2">
                <input v-model="couponCode" @keyup.enter="applyCoupon" type="text" placeholder="Nhập mã giảm giá" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase" />
                <button type="button" @click="applyCoupon" class="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition font-medium">Áp dụng</button>
              </div>
              
              <div v-if="checkoutStore.appliedCoupon" class="bg-blue-50 border border-blue-100 rounded-lg p-3 mt-4">
                <div class="flex justify-between items-center text-sm">
                   <span class="text-blue-800 font-bold">Mã: {{ checkoutStore.appliedCoupon.code }}</span>
                   <button @click="removeCoupon" class="text-red-500 hover:text-red-700 text-xs font-medium">Gỡ bỏ</button>
                </div>
                <p class="text-xs text-blue-600 mt-1">Giảm: {{ discountAmount.toLocaleString('vi-VN') }} ₫</p>
              </div>
            </div>

            <div class="border-t pt-4 flex justify-between items-center mb-8">
              <span class="font-bold text-lg">Tổng cộng</span>
              <span class="text-2xl font-bold text-red-600">{{ finalPrice.toLocaleString('vi-VN') }} ₫</span>
            </div>

            <button @click="handleCheckout" class="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-bold py-4 rounded-xl transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              Tiến hành thanh toán
            </button>
            
            <router-link to="/" class="block w-full text-center text-gray-500 font-medium mt-4 hover:text-blue-600 transition">
              Tiếp tục mua sắm
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useCheckoutStore } from '@/stores/checkout'
import { useToastStore } from '@/stores/toast'
import { useAuthStore } from '@/stores/auth'
import ToastNotification from '@/components/ToastNotification.vue'
import api, { getImageUrl } from '@/api/axios'

const router = useRouter()
const cartStore = useCartStore()
const checkoutStore = useCheckoutStore()
const toastStore = useToastStore()
const authStore = useAuthStore()
const couponCode = ref('')

onMounted(() => {
  couponCode.value = checkoutStore.appliedCoupon?.code || ''
})

// Tính toán số tiền giảm giá dựa trên chính sách từ Backend (PERCENT hoặc FIXED)
const discountAmount = computed(() => {
  const coupon = checkoutStore.appliedCoupon
  if (!coupon) return 0
  
  let discount = 0
  if (coupon.discount_type === 'PERCENT') {
    discount = cartStore.totalPrice * (coupon.discount_value / 100)
    // Áp dụng mức giảm tối đa nếu có (giống logic Laravel)
    if (coupon.max_discount_value && discount > coupon.max_discount_value) {
      discount = coupon.max_discount_value
    }
  } else {
    discount = coupon.discount_value || 0
  }
  
  // Đảm bảo số tiền giảm không vượt quá tổng giá trị giỏ hàng
  return Math.min(discount, cartStore.totalPrice)
})

const finalPrice = computed(() => Math.max(0, cartStore.totalPrice - discountAmount.value))

// Xác thực coupon thông qua Backend để đảm bảo tính chính xác về thời gian/hạn mức
async function applyCoupon() {
  const code = couponCode.value.trim().toUpperCase()
  
  if (!code) {
    checkoutStore.clearCoupon()
    return
  }

  try {
    const response = await api.post('/check-coupon', {
      code: code,
      subtotal: cartStore.totalPrice
    })
    
    // Dữ liệu trả về từ OrderController@checkCoupon
    const { coupon } = response.data
    checkoutStore.applyCoupon(coupon)
    toastStore.success(`Áp dụng mã ${code} thành công!`)
  } catch (err) {
    checkoutStore.clearCoupon()
    const errorMsg = err.response?.data?.message || 'Mã giảm giá không hợp lệ.'
    toastStore.error(errorMsg)
  }
}

function removeCoupon() {
  checkoutStore.clearCoupon()
  couponCode.value = ''
  toastStore.info('Đã xóa mã giảm giá')
}

function increaseQuantity(item) {
  const newQty = (item.quantity || 1) + 1
  if (newQty <= item.stock) {
    cartStore.updateQuantity(item.id, newQty)
  } else {
    toastStore.warning(`Chỉ còn ${item.stock} sản phẩm trong kho!`)
  }
}

function decreaseQuantity(item) {
  const newQty = (item.quantity || 1) - 1
  if (newQty >= 1) {
    cartStore.updateQuantity(item.id, newQty)
  } else {
    removeItem(item.id)
  }
}

function handleQuantityInput(item, value) {
  let newQty = parseInt(value)
  
  if (isNaN(newQty) || newQty < 1) {
    newQty = 1
  } else if (newQty > item.stock) {
    newQty = item.stock
    toastStore.warning(`Số lượng không được vượt quá tồn kho (${item.stock})`)
  }
  
  cartStore.updateQuantity(item.id, newQty)
}

function removeItem(id) {
  cartStore.removeFromCart(id)
  toastStore.success('Đã xóa sản phẩm khỏi giỏ hàng')
}

function handleCheckout() {
  if (!authStore.token) {
    toastStore.warning('Vui lòng đăng nhập để tiến hành thanh toán')
    router.push('/login')
    return
  }
  
  // Sử dụng name để an toàn hơn và tránh lỗi "No match found" nếu đổi path sau này
  router.push({ name: 'checkout-info' })
}

// Watcher: Nếu tổng tiền giảm xuống dưới mức tối thiểu của coupon, tự động hủy coupon
watch(() => cartStore.totalPrice, (newTotal) => {
  const coupon = checkoutStore.appliedCoupon
  if (coupon && newTotal < (coupon.min_order_value || 0)) {
    checkoutStore.clearCoupon()
    toastStore.warning('Mã giảm giá đã bị gỡ do giỏ hàng không đủ giá trị tối thiểu.')
  }
})
</script>

<style scoped>
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  appearance: none;
  margin: 0; 
}
input[type=number] {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>