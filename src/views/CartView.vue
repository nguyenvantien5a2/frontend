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
        <!-- Cart Items -->
        <div class="lg:w-2/3">
          <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div v-for="item in cartStore.items" :key="item.id" class="p-6 border-b last:border-b-0 flex flex-col sm:flex-row items-center gap-6">
              <img :src="getImageUrl(item.imageUrl) || 'https://via.placeholder.com/100'" class="w-24 h-24 object-cover rounded-lg" />
              
              <div class="flex-1 text-center sm:text-left">
                <h3 class="font-bold text-lg text-gray-900 mb-1">{{ item.name }}</h3>
                <p class="text-blue-600 font-medium">{{ item.price.toLocaleString('vi-VN') }} ₫</p>
                <p class="text-sm text-gray-500 mt-1">Kho: {{ item.stock }}</p>
              </div>

              <!-- Quantity Input -->
              <div class="flex items-center border border-gray-300 rounded-lg">
                <button @click="decreaseQuantity(item)" class="px-3 py-2 hover:bg-gray-100 text-gray-600 transition border-r border-gray-300 font-bold">-</button>
                <input 
                  type="number" 
                  v-model.number="item.quantity" 
                  @change="validateQuantity(item)"
                  class="w-14 text-center py-2 focus:outline-none appearance-none m-0 font-medium" 
                  min="1"
                />
                <button @click="increaseQuantity(item)" class="px-3 py-2 hover:bg-gray-100 text-gray-600 transition border-l border-gray-300 font-bold">+</button>
              </div>

              <!-- Total Price for Item -->
              <div class="font-bold text-gray-900 w-32 text-right hidden sm:block">
                {{ (item.price * item.quantity).toLocaleString('vi-VN') }} ₫
              </div>

              <!-- Remove Button (Trash Icon) -->
              <button @click="removeItem(item.id)" class="text-gray-400 hover:text-red-500 transition p-2 rounded-full hover:bg-red-50" title="Xóa sản phẩm">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Summary -->
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
            
            <!-- Coupon Input -->
            <div class="mb-6">
              <div class="flex gap-2">
                <input v-model="couponCode" type="text" placeholder="Nhập mã giảm giá" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <button type="button" @click="applyCoupon" class="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition font-medium">Áp dụng</button>
              </div>
              <p v-if="checkoutStore.appliedCoupon" class="text-green-600 text-sm mt-2 flex justify-between items-center">
                <span>Mã giảm giá ({{ checkoutStore.appliedCoupon.code }}):</span>
                <span class="flex items-center">
                  {{ discountAmount > 0 ? '-' + discountAmount.toLocaleString('vi-VN') + ' ₫' : 'Đã áp dụng' }}
                  <button @click="removeCoupon" class="ml-2 text-red-500 hover:text-red-700 focus:outline-none" title="Xóa mã giảm giá">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                </span>
              </p>

              <!-- Available Coupons List -->
              <div v-if="availablePromotions.length > 0" class="mt-4 border-t pt-4">
                <h4 class="font-semibold text-sm text-gray-700 mb-2">Mã có thể dùng:</h4>
                <div class="space-y-2">
                  <div 
                    v-for="promo in availablePromotions" 
                    :key="promo.id" 
                    @click="selectAndApplyCoupon(promo)"
                    class="flex justify-between items-center p-3 bg-gray-50 hover:bg-blue-50 border border-dashed rounded-lg cursor-pointer transition"
                  >
                    <div>
                      <span class="font-mono font-bold text-blue-700">{{ promo.code }}</span>
                      <p class="text-xs text-gray-500">{{ promo.description }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="border-t pt-4 flex justify-between items-center mb-8">
              <span class="font-bold text-lg">Tổng cộng</span>
              <span class="text-2xl font-bold text-red-600">{{ finalPrice.toLocaleString('vi-VN') }} ₫</span>
            </div>

            <router-link to="/checkout-info" class="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-bold py-4 rounded-xl transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              Tiến hành thanh toán
            </router-link>
            
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
import { ref, computed, onMounted } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useCheckoutStore } from '@/stores/checkout'
import { useToastStore } from '@/stores/toast'
import ToastNotification from '@/components/ToastNotification.vue'
import api, { getImageUrl } from '@/api/axios'

const cartStore = useCartStore()
const checkoutStore = useCheckoutStore()
const toastStore = useToastStore()
const couponCode = ref('')
const availablePromotions = ref([])

// Đọc mã coupon từ store khi component được tải
onMounted(() => {
  couponCode.value = checkoutStore.appliedCoupon?.code || ''
})

onMounted(async () => {
  try {
    const res = await api.get('/promotions')
    if (res.data && Array.isArray(res.data)) {
      availablePromotions.value = res.data
      console.log('✅ Danh sách khuyến mãi từ API:', res.data)
    }
  } catch (err) {
    console.error('Lỗi tải khuyến mãi (sẽ dùng dữ liệu mẫu):', err)
  } finally {
    if (availablePromotions.value.length === 0) {
      availablePromotions.value = [
        { id: 1, title: 'Siêu Sale Khai Trương', description: 'Giảm giá 20% cho toàn bộ đơn hàng.', discountPercent: 20, code: 'HELLO2024' },
        { id: 2, title: 'Miễn Phí Vận Chuyển', description: 'Freeship cho đơn hàng từ 500k.', discountPercent: null, code: 'FREESHIP' }
      ]
    }
  }
})

const discountAmount = computed(() => {
  if (!checkoutStore.appliedCoupon || !checkoutStore.appliedCoupon.discountPercent) return 0
  const discountValue = checkoutStore.appliedCoupon.discountPercent / 100
  return Math.round(cartStore.totalPrice * discountValue)
})

const finalPrice = computed(() => Math.max(0, cartStore.totalPrice - discountAmount.value))

function applyCoupon() {
  const code = couponCode.value.trim().toUpperCase()
  
  if (!code) {
    checkoutStore.clearCoupon() // Xóa coupon nếu input rỗng
    return
  }

  // Debug: In ra console để kiểm tra dữ liệu
  console.log('🔍 Mã nhập vào:', code)
  console.log('📋 Danh sách mã khả dụng:', availablePromotions.value)

  // Sửa lỗi: Thêm kiểm tra p.code tồn tại để tránh lỗi "Cannot read properties of undefined"
  const promo = availablePromotions.value.find(p => p.code && p.code.toUpperCase() === code)

  if (promo) {
    checkoutStore.applyCoupon(promo) // Lưu coupon vào store
    toastStore.success(`Áp dụng mã ${promo.code} thành công!`)
  } else {
    checkoutStore.clearCoupon() // Xóa coupon khỏi store nếu không hợp lệ
    couponCode.value = ''
    toastStore.error('Mã giảm giá không hợp lệ hoặc đã hết hạn.')
  }
}

function selectAndApplyCoupon(promo) {
  couponCode.value = promo.code
  applyCoupon()
}

function removeCoupon() {
  checkoutStore.clearCoupon()
  couponCode.value = ''
  toastStore.info('Đã xóa mã giảm giá')
}

function increaseQuantity(item) {
  if (item.quantity < item.stock) {
    item.quantity++
  } else {
    toastStore.warning(`Chỉ còn ${item.stock} sản phẩm trong kho!`)
  }
}

function decreaseQuantity(item) {
  if (item.quantity > 1) {
    item.quantity--
  } else {
    removeItem(item.id)
  }
}

function validateQuantity(item) {
  if (item.quantity < 1 || isNaN(item.quantity)) {
    item.quantity = 1
  } else if (item.quantity > item.stock) {
    item.quantity = item.stock
    toastStore.warning(`Số lượng không được vượt quá tồn kho (${item.stock})`)
  }
}

function removeItem(id) {
  cartStore.removeFromCart(id)
  toastStore.success('Đã xóa sản phẩm khỏi giỏ hàng')
}
</script>

<style scoped>
/* Ẩn nút tăng giảm mặc định của input number */
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