<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Sidebar -->
    <aside :class="['bg-gray-900 text-white flex flex-col flex-shrink-0 transition-all duration-300 h-full sticky top-0', isCollapsed ? 'w-20' : 'w-64']">
      <div class="h-16 flex items-center justify-between px-4 border-b border-gray-800">
        <h1 v-if="!isCollapsed" class="text-xl font-bold text-blue-500 whitespace-nowrap">LKMT Admin</h1>
        <h1 v-else class="text-xl font-bold text-blue-500 mx-auto">LK</h1>
        <button @click="toggleSidebar" class="text-gray-400 hover:text-white focus:outline-none ml-auto" v-if="!isCollapsed">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
        <button @click="toggleSidebar" class="text-gray-400 hover:text-white focus:outline-none mx-auto" v-else>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
        <router-link to="/admin/dashboard" active-class="bg-blue-600 text-white" :class="['px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition flex items-center', isCollapsed ? 'justify-center' : '']">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" :class="isCollapsed ? '' : 'mr-3'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <span v-if="!isCollapsed">Tổng quan</span>
        </router-link>
        <router-link to="/admin/products" active-class="bg-blue-600 text-white" :class="['px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition flex items-center', isCollapsed ? 'justify-center' : '']">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" :class="isCollapsed ? '' : 'mr-3'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <span v-if="!isCollapsed">Sản phẩm</span>
        </router-link>
        <router-link to="/admin/categories" active-class="bg-blue-600 text-white" :class="['px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition flex items-center', isCollapsed ? 'justify-center' : '']">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" :class="isCollapsed ? '' : 'mr-3'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          <span v-if="!isCollapsed">Danh mục</span>
        </router-link>
        <router-link to="/admin/promotions" active-class="bg-blue-600 text-white" :class="['px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition flex items-center', isCollapsed ? 'justify-center' : '']">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" :class="isCollapsed ? '' : 'mr-3'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <span v-if="!isCollapsed">Khuyến mãi</span>
        </router-link>
        <router-link to="/admin/orders" active-class="bg-blue-600 text-white" :class="['px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition flex items-center', isCollapsed ? 'justify-center' : '']">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" :class="isCollapsed ? '' : 'mr-3'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          <span v-if="!isCollapsed">Đơn hàng</span>
        </router-link>
        <router-link to="/admin/users" active-class="bg-blue-600 text-white" :class="['px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition flex items-center', isCollapsed ? 'justify-center' : '']">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" :class="isCollapsed ? '' : 'mr-3'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span v-if="!isCollapsed">Người dùng</span>
        </router-link>
      </nav>

      <div class="p-4 border-t border-gray-800">
        <button @click="logout" class="w-full flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" :class="isCollapsed ? '' : 'mr-2'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span v-if="!isCollapsed">Đăng xuất</span>
        </button>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col">
      <main class="flex-1 bg-gray-50 overflow-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router' 
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'

const router = useRouter()
const authStore = useAuthStore()
const toastStore = useToastStore()
const isCollapsed = ref(false)

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

const logout = async () => {
  try {
    await authStore.logout()
    toastStore.success('Bạn đã đăng xuất thành công.')
  } catch (error) {
    console.error('Logout failed:', error)
  } finally {
    router.replace({ name: 'login' })
  }
}
</script>