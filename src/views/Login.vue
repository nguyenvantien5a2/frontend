<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-gray-800">Đăng Nhập</h2>
        <p class="text-gray-600 mt-2">Chào mừng quay trở lại LKMT Shop</p>
      </div>

      <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
        {{ error }}
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Tên đăng nhập</label>
          <input
            type="text"
            v-model="form.username"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="Nhập username"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Mật khẩu</label>
          <div class="relative">
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="form.password"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Nhập mật khẩu"
            />
          <button type="button"
            @click="showPassword = !showPassword"
            class="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-gray-700"
          >
            <!-- Eye OFF (mắt có gạch) -->
            <svg
              v-if="!showPassword"
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.98 8.223A10.477 10.477 0 002 12c1.636 4.06 5.478 7 10 7
                  1.878 0 3.626-.507 5.112-1.388M6.228 6.228
                  A10.45 10.45 0 0112 5c4.522 0 8.364 2.94 10 7
                  a10.523 10.523 0 01-4.043 5.027M15 12
                  a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 3l18 18" />
            </svg>

            <!-- Eye ON -->
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.458 12C3.732 7.943 7.522 5 12 5
                  c4.478 0 8.268 2.943 9.542 7
                  -1.274 4.057-5.022 7-9.542 7
                  -4.478 0-8.268-2.943-9.542-7z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>

          </div>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 rounded-lg transition duration-200"
        >
          {{ loading ? 'Đang đăng nhập...' : 'Đăng Nhập' }}
        </button>
      </form>

      <!-- Divider -->
      <div class="relative flex items-center py-6">
        <div class="flex-grow border-t border-gray-200"></div>
        <span class="flex-shrink mx-4 text-sm text-gray-500">Hoặc đăng nhập với</span>
        <div class="flex-grow border-t border-gray-200"></div>
      </div>

      <!-- Google Login: Đảm bảo bọc trong div riêng và tách biệt hoàn toàn với form -->
      <div class="flex justify-center mt-2">
        <GoogleLogin :callback="handleGoogleLogin" type="standard" />
      </div>

      <p class="text-center mt-8 text-gray-600">
        Chưa có tài khoản?
        <router-link to="/register" class="text-blue-600 hover:underline font-medium">
          Đăng ký ngay
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { GoogleLogin } from 'vue3-google-login'
import { useAuthStore } from '@/stores/auth'
import api from '@/api/axios'

const form = reactive({
  username: '',
  password: ''
})
const showPassword = ref(false)
const loading = ref(false)
const error = ref(null)
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

onMounted(() => {
  // Hiển thị message từ query parameter (ví dụ: tài khoản bị khóa)
  if (route.query.message) {
    error.value = route.query.message
  }
})

const handleLogin = async () => {
  loading.value = true
  error.value = null

  // Debug: Kiểm tra dữ liệu trước khi gửi
  console.log('Đang gửi dữ liệu:', form);

  if (!form.username || !form.password) {
    error.value = 'Vui lòng nhập đầy đủ thông tin';
    loading.value = false;
    return;
  }

  try {
    // Đảm bảo gửi object với key chính xác mà backend mong đợi
    const payload = {
      username: String(form.username).trim(),
      password: String(form.password)
    };
    
    // Gọi trực tiếp action login của store
    const response = await authStore.login(payload);
    const user = response.data.user;

    // Kiểm tra tài khoản bị khóa
    if (user.locked) {
      error.value = 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên để được hỗ trợ.';
      return;
    }

    // 2. Điều hướng (Sử dụng handleRedirect đã tách riêng)
    await handleRedirect(user)
  } catch (err) {
    if (err.response?.status === 422 && err.response.data.errors) {
      const errors = err.response.data.errors;
      error.value = Object.values(errors).flat().join(', ');
    } else {
      error.value = err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại!';
    }
    console.error(err)
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

    // Kiểm tra tài khoản bị khóa
    if (user.locked) {
      error.value = 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên để được hỗ trợ.';
      return;
    }

    // Dùng hàm setAuth để lưu thông tin từ Google
    authStore.setAuth(access_token, user);

    // 2. Điều hướng
    await handleRedirect(user)
  } catch (err) {
    console.error('Full Error:', err.response?.data);
    // Nếu là lỗi validate (422), Laravel thường trả về object errors
    if (err.response?.status === 422 && err.response.data.errors) {
      const errors = err.response.data.errors;
      error.value = Object.values(errors).flat().join(', ');
    } else {
      error.value = err.response?.data?.message || 'Đăng nhập bằng Google thất bại.';
    }
  } finally {
    loading.value = false
  }
}

const handleRedirect = async (user) => {
  if (user.role === 'ADMIN') {
    return router.push({ name: 'admin-dashboard' });
  } else {
    // Nếu thiếu thông tin, dẫn họ vào Profile để nhắc cập nhật
    // Nhưng vì ta đã xóa Guard ở bước 1, họ hoàn toàn có thể click menu đi trang khác.
    if (!user.phone || !user.address) {
      return router.push('/profile');
    }
    
    // Nếu đủ thông tin thì về trang chủ hoặc trang đang xem dở
    const redirectPath = route.query.redirect || '/';
    return router.push(redirectPath);
  }
}
</script>