<template>
  <ToastNotification />
  <div class="min-h-screen bg-gray-50 py-10 font-sans">
    <div class="container mx-auto px-4 max-w-5xl">
      <!-- Breadcrumb -->
      <div class="flex items-center mb-8 text-sm text-gray-600">
        <router-link to="/" class="hover:text-blue-600 flex items-center transition-colors">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
          Trang chủ
        </router-link>
        <span class="mx-2 text-gray-400">/</span>
        <span class="font-semibold text-gray-900">Thông tin tài khoản</span>
      </div>

      <div class="flex flex-col md:flex-row gap-8">
        <!-- Sidebar -->
        <div class="w-full md:w-1/3">
          <div class="bg-white rounded-2xl shadow-sm p-6 text-center border border-gray-100">
            <div class="w-24 h-24 mx-auto mb-4 relative">
              <img v-if="user.avatar_url" :src="getImageUrl(user.avatar_url)" alt="Avatar" referrerpolicy="no-referrer" class="w-full h-full rounded-full object-cover border-2 border-blue-100">
              <div v-else class="w-full h-full bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold uppercase">
                {{ userInitials }}
              </div>
            </div>
            <h2 class="font-bold text-gray-900 text-lg truncate">{{ user.name || 'Người dùng' }}</h2>
            <p class="text-gray-500 text-sm mb-6 truncate">{{ user.email }}</p>
            
            <div class="space-y-2 text-left">
              <router-link to="/profile" class="flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                Thông tin tài khoản
              </router-link>
              <router-link to="/my-orders" class="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                Lịch sử đơn hàng
              </router-link>
              <button @click="showChangePasswordModal = true" class="w-full flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                Đổi mật khẩu
              </button>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="w-full md:w-2/3">
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="p-6 border-b border-gray-100">
              <h1 class="text-xl font-bold text-gray-900">Chi tiết hồ sơ</h1>
            </div>

            <div v-if="fetching" class="p-12 text-center">
              <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600 mx-auto mb-4"></div>
              <p class="text-gray-500">Đang tải thông tin...</p>
            </div>

            <div v-else class="p-4">
              <div v-if="hasIncompleteProfile" class="mb-4 rounded-2xl border border-yellow-200 bg-yellow-50 p-4 text-yellow-900">
                <p class="font-semibold">Bạn cần hoàn tất thông tin tài khoản trước khi tiếp tục.</p>
                <ul class="mt-1 list-disc list-inside text-sm space-y-1">
                  <li v-if="missingPhone">Vui lòng nhập số điện thoại.</li>
                  <li v-if="missingAddress">Vui lòng nhập địa chỉ giao hàng.</li>
                </ul>
              </div>
              <form @submit.prevent="updateProfile">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Tên đăng nhập</label>
                    <input :value="user.username" type="text" disabled class="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
                    <input v-model="form.name" type="text" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" required />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input v-model="form.email" type="email" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" required />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                    <input v-model="form.phone" type="tel" pattern="^(0[3|5|7|8|9])+([0-9]{8})$" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="Nhập số điện thoại (10 số, bắt đầu bằng 03,05,07,08,09)" />
                    <div v-if="form.phone && phoneValidationMessage" class="mt-1 text-sm" :class="phoneValidationMessage.includes('✓') ? 'text-green-600' : 'text-red-600'">
                      {{ phoneValidationMessage }}
                    </div>
                  </div>
                </div>

                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Địa chỉ giao hàng</label>
                  <textarea v-model="form.address" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="Số nhà, tên đường, phường/xã..."></textarea>
                </div>

                <div class="flex items-center justify-end">
                  <button type="submit" :disabled="loading" class="bg-blue-600 text-white px-8 py-2.5 rounded-lg font-bold hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition disabled:opacity-70 flex items-center">
                    <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Lưu thay đổi
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Change Password Modal -->
    <div v-if="showChangePasswordModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="showChangePasswordModal = false">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">
        <div class="p-6 border-b border-gray-100 flex justify-between items-center">
          <h1 class="text-xl font-bold text-gray-900">Đổi mật khẩu</h1>
          <button @click="showChangePasswordModal = false" class="text-gray-500 hover:text-gray-800 transition">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div class="p-8">
          <form @submit.prevent="handleChangePassword">
            <div class="space-y-4 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Mật khẩu hiện tại</label>
                <input v-model="passwordForm.currentPassword" type="password" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Mật khẩu mới</label>
                <input v-model="passwordForm.newPassword" type="password" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
            <div class="flex justify-end">
              <button type="submit" :disabled="passwordLoading" class="bg-gray-800 text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-900 transition disabled:opacity-50">
                {{ passwordLoading ? 'Đang xử lý...' : 'Cập nhật mật khẩu' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import api, { getImageUrl } from '@/api/axios'
import { useRouter } from 'vue-router'
import { useToastStore } from '@/stores/toast'
import ToastNotification from '@/components/ToastNotification.vue'

const authStore = useAuthStore()
const router = useRouter()
const toastStore = useToastStore()

const user = ref({})
const fetching = ref(true)
const loading = ref(false)
const passwordLoading = ref(false)
const showChangePasswordModal = ref(false)

const form = ref({
  name: '',
  email: '',
  phone: '',
  address: ''
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: ''
})

const userInitials = computed(() => {
  if (!user.value.name) return 'U'
  return user.value.name.split(' ').pop().charAt(0).toUpperCase()
})

const missingPhone = computed(() => !form.value.phone || !String(form.value.phone).trim())
const missingAddress = computed(() => !form.value.address || !String(form.value.address).trim())
const hasIncompleteProfile = computed(() => missingPhone.value || missingAddress.value)

// Computed property cho validation số điện thoại
const phoneValidationMessage = computed(() => {
  if (!form.value.phone) return ''
  
  const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/
  if (phoneRegex.test(form.value.phone)) {
    return '✓ Số điện thoại hợp lệ'
  } else {
    return 'Số điện thoại không hợp lệ (10 số, bắt đầu bằng 03,05,07,08,09)'
  }
})

onMounted(async () => {
  try {
    const res = await api.get('/users/profile')
    user.value = res.data
    form.value = {
      name: res.data.name || '',
      email: res.data.email || '',
      phone: res.data.phone || '',
      address: res.data.address || ''
    }
  } catch (err) {
    console.error('Lỗi tải hồ sơ:', err)
    toastStore.error('Không thể tải thông tin người dùng.')
  } finally {
    fetching.value = false
  }
})

const updateProfile = async () => {
  // Kiểm tra số điện thoại nếu có nhập
  if (form.phone && !/^(0[3|5|7|8|9])+([0-9]{8})$/.test(form.phone)) {
    toastStore.error('Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam (10 số, bắt đầu bằng 03,05,07,08,09)')
    return
  }

  try {
    // Gửi form bao gồm cả name, email, phone, address
    const res = await api.put('/users/profile', form.value)
    
    // Laravel trả về { message: "...", user: {...} }
    const updatedUser = res.data.user
    user.value = { ...user.value, ...updatedUser }

    // Cập nhật vào Pinia Store và LocalStorage thông qua action chuyên dụng
    authStore.updateUserData(updatedUser)

    toastStore.success('Cập nhật hồ sơ thành công!')

    if (!hasIncompleteProfile.value) {
      // Chỉ chuyển hướng khi người dùng đã nhập đủ thông tin liên hệ
      setTimeout(() => {
        router.push('/')
      }, 1200)
    } else {
      toastStore.info('Vui lòng hoàn thành các thông tin còn thiếu để sử dụng đầy đủ tính năng.')
    }
  } catch (err) {
    const msg = err.response?.data?.message || 'Lỗi khi cập nhật hồ sơ.'
    toastStore.error(msg)
  } finally {
    loading.value = false
  }
}

const handleChangePassword = async () => {
  passwordLoading.value = true
  try {
    await api.put('/users/change-password', passwordForm.value)
    toastStore.success('Đổi mật khẩu thành công!')
    passwordForm.value = { currentPassword: '', newPassword: '' }
    showChangePasswordModal = false
  } catch (err) {
    const msg = err.response?.data?.message || 'Mật khẩu hiện tại không đúng.'
    toastStore.error(msg)
  } finally {
    passwordLoading.value = false
  }
}
</script>