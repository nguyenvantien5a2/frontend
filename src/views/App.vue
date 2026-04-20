<script setup>
import { RouterView, useRoute } from 'vue-router'
import Navbar from '@/components/Navbar.vue' // Kiểm tra lại đường dẫn/tên file nếu bạn dùng Header.vue
import Footer from '@/components/Footer.vue'
import ToastNotification from '@/components/ToastNotification.vue'

const route = useRoute()
</script>

<template>
  <ToastNotification />
  <!-- Chỉ hiển thị Navbar nếu route KHÔNG có meta.hideHeaderFooter -->
  <Navbar v-if="!route.meta.hideHeaderFooter" />

  <RouterView />

  <!-- Chỉ hiển thị Footer nếu route KHÔNG có meta.hideHeaderFooter -->
  <Footer v-if="!route.meta.hideHeaderFooter" />
</template>
