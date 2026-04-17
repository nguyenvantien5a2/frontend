<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Chỉ hiển thị Navbar nếu route không yêu cầu ẩn -->
    <Navbar v-if="!route.meta.hideHeaderFooter" />
    
    <main :class="{'py-4': !route.meta.hideHeaderFooter}" class="min-h-[calc(100vh-400px)]">
      <router-view />
    </main>

    <!-- Chỉ hiển thị Footer nếu route không yêu cầu ẩn -->
    <Footer v-if="!route.meta.hideHeaderFooter" />

    <!-- Component hiển thị thông báo toàn cục -->
    <ToastNotification />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import ToastNotification from './components/ToastNotification.vue';

const route = useRoute();
</script>

<style>
/* Bạn có thể để trống hoặc thêm CSS dùng chung ở đây */
</style>
