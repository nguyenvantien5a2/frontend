<template>
  <div class="max-w-6xl mx-auto px-3 mb-6">
    <div class="flex items-center justify-between">
      <div class="flex-1 text-center">
        <div :class="['w-10 h-10 mx-auto rounded-full flex items-center justify-center text-base font-bold border-2', 
                     currentStep >= 1 ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-200 text-gray-600 border-gray-300']">
          1
        </div>
        <p class="mt-1 text-xs font-medium" :class="currentStep >= 1 ? 'text-blue-600' : 'text-gray-500'">Điền thông tin</p>
      </div>

      <div class="flex-1 h-1 bg-gray-300 relative">
        <div :class="['absolute h-full', currentStep >= 2 ? 'bg-blue-600 w-full' : 'bg-gray-300 w-0']" style="transition: width 0.5s"></div>
      </div>

      <div class="flex-1 text-center">
        <div :class="['w-10 h-10 mx-auto rounded-full flex items-center justify-center text-base font-bold border-2', 
                     currentStep >= 2 ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-200 text-gray-600 border-gray-300']">
          2
        </div>
        <p class="mt-1 text-xs font-medium" :class="currentStep >= 2 ? 'text-blue-600' : 'text-gray-500'">Xác nhận thông tin</p>
      </div>

      <div class="flex-1 h-1 bg-gray-300 relative">
        <div :class="['absolute h-full', currentStep >= 3 ? 'bg-blue-600 w-full' : 'bg-gray-300 w-0']" style="transition: width 0.5s"></div>
      </div>

      <div class="flex-1 text-center">
        <div :class="['w-10 h-10 mx-auto rounded-full flex items-center justify-center text-base font-bold border-2', 
                     currentStep >= 3 ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-200 text-gray-600 border-gray-300']">
          3
        </div>
        <p class="mt-1 text-xs font-medium" :class="currentStep >= 3 ? 'text-blue-600' : 'text-gray-500'">Thanh toán</p>
      </div>

      <div class="flex-1 h-1 bg-gray-300 relative">
        <div :class="['absolute h-full', currentStep >= 4 ? 'bg-blue-600 w-full' : 'bg-gray-300 w-0']" style="transition: width 0.5s"></div>
      </div>

      <div class="flex-1 text-center">
        <div :class="['w-10 h-10 mx-auto rounded-full flex items-center justify-center text-base font-bold border-2', 
                     currentStep >= 4 ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-200 text-gray-600 border-gray-300']">
          4
        </div>
        <p class="mt-1 text-xs font-medium" :class="currentStep >= 4 ? 'text-blue-600' : 'text-gray-500'">Hoàn tất</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  currentStep: {
    type: Number,
    required: true
  }
})
</script>