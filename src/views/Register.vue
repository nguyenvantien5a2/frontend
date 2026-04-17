<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
    <div class="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-gray-800">Đăng Ký Tài Khoản</h2>
        <p class="text-gray-600 mt-2">Tham gia LKMT Shop ngay hôm nay</p>
      </div>

      <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
        {{ error }}
      </div>
      <div v-if="success" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
        {{ success }}
      </div>

      <form @submit.prevent="handleRegister" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
          <input v-model="form.name" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Nhập họ và tên" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Tên đăng nhập</label>
          <input v-model="form.username" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Nhập tên đăng nhập" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input type="email" v-model="form.email" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Nhập email" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
          <input type="tel" v-model="form.phone" required pattern="^(0[3|5|7|8|9])+([0-9]{8})$" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Nhập số điện thoại (10 số, bắt đầu bằng 03,05,07,08,09)" />
          <div v-if="form.phone && phoneValidationMessage" class="mt-1 text-sm" :class="phoneValidationMessage.includes('✓') ? 'text-green-600' : 'text-red-600'">
            {{ phoneValidationMessage }}
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Mật khẩu</label>
          <div class="relative">
            <input :type="showPassword ? 'text' : 'password'" v-model="form.password" required pattern="^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Nhập mật khẩu (tối thiểu 8 ký tự, có ít nhất 1 ký tự đặc biệt)" />
            <button type="button" @click="showPassword = !showPassword" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">
              <svg v-if="!showPassword" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.022 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" /></svg>
              <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
            </button>
          </div>
          <div v-if="form.password && passwordValidationMessage" class="mt-1 text-sm" :class="passwordValidationMessage.includes('✓') ? 'text-green-600' : 'text-red-600'">
            {{ passwordValidationMessage }}
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Xác nhận mật khẩu</label>
          <div class="relative">
            <input :type="showConfirmPassword ? 'text' : 'password'" v-model="form.confirmPassword" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Nhập lại mật khẩu" />
            <button type="button" @click="showConfirmPassword = !showConfirmPassword" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">
              <svg v-if="!showConfirmPassword" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.022 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" /></svg>
              <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
            </button>
          </div>
        </div>

        <div class="md:col-span-2">
          <button type="submit" :disabled="loading" class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 rounded-lg transition duration-200">
            {{ loading ? 'Đang đăng ký...' : 'Đăng Ký' }}
          </button>
        </div>
      </form>

      <div class="relative flex items-center py-6">
        <div class="flex-grow border-t border-gray-200"></div>
        <span class="flex-shrink mx-4 text-sm text-gray-500">Hoặc đăng ký với</span>
        <div class="flex-grow border-t border-gray-200"></div>
      </div>

      <div class="flex justify-center">
        <GoogleLogin :callback="handleGoogleLogin" />
      </div>

      <p class="text-center mt-8 text-gray-600">
        Đã có tài khoản?
        <router-link to="/login" class="text-blue-600 hover:underline font-medium">Đăng nhập</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api/axios'
import { GoogleLogin } from 'vue3-google-login'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  name: '',
  username: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: ''
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const error = ref(null)
const success = ref(null)

// Computed properties cho validation mật khẩu
const passwordHasMinLength = computed(() => form.password.length >= 8)
const passwordHasSpecialChar = computed(() => /[!@#$%^&*]/.test(form.password))
const passwordValidationMessage = computed(() => {
  if (!form.password) return ''
  
  if (passwordHasSpecialChar.value && !passwordHasMinLength.value) {
    return 'Cần nhập đủ 8 ký tự'
  }
  if (!passwordHasSpecialChar.value && passwordHasMinLength.value) {
    return 'Cần có ít nhất 1 ký tự đặc biệt (!@#$%^&*)'
  }
  if (passwordHasSpecialChar.value && passwordHasMinLength.value) {
    return '✓ Mật khẩu hợp lệ'
  }
  return 'Cần ít nhất 8 ký tự và 1 ký tự đặc biệt (!@#$%^&*)'
})

// Computed property cho validation số điện thoại
const phoneValidationMessage = computed(() => {
  if (!form.phone) return ''
  
  const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/
  if (phoneRegex.test(form.phone)) {
    return '✓ Số điện thoại hợp lệ'
  } else {
    return 'Số điện thoại không hợp lệ (10 số, bắt đầu bằng 03,05,07,08,09)'
  }
})

const handleRegister = async () => {
  if (form.password !== form.confirmPassword) {
    error.value = 'Mật khẩu xác nhận không khớp'
    return
  }

  // Kiểm tra mật khẩu có ít nhất 8 ký tự và có ít nhất 1 ký tự đặc biệt
  if (form.password.length < 8 || !/[!@#$%^&*]/.test(form.password)) {
    error.value = 'Mật khẩu phải có ít nhất 8 ký tự và chứa ít nhất 1 ký tự đặc biệt (!@#$%^&*)'
    return
  }

  loading.value = true
  error.value = null
  success.value = null

  try {
    const res = await api.post('/register', {
      name: form.name,
      username: form.username,
      email: form.email,
      phone: form.phone,
      password: form.password
    })
    success.value = res.data.message || 'Đăng ký thành công! Đang chuyển hướng...'
    setTimeout(() => router.push('/login'), 2000)
  } catch (err) {
    error.value = err.response?.data?.message || 'Đăng ký thất bại. Vui lòng kiểm tra lại.'
  } finally {
    loading.value = false
  }
}

const handleGoogleLogin = async (response) => {
  loading.value = true
  error.value = null
  try {
    const res = await api.post('/auth/google', {
      credential: response.credential
    })
    
    const { access_token, user } = res.data
    authStore.user = user
    authStore.login(access_token, user.name || user.username)

    const hasFullInfo = !!(user.phone && user.address && String(user.address || '').trim());

    if (user.role === 'ADMIN') {
      await router.push({ name: 'admin-dashboard' })
    } else if (!hasFullInfo) {
      await router.push({ name: 'profile' })
    } else {
      await router.push({ name: 'home' })
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Đăng nhập bằng Google thất bại.'
  } finally {
    loading.value = false
  }
}
</script>