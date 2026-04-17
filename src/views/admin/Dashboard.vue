<template>
  <div class="p-6">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-[400px]">
      <div class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600 font-medium">Đang tải dữ liệu...</p>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else class="space-y-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Revenue Card -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 uppercase tracking-wider">Doanh Thu</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">{{ formatCurrency(stats.revenue || 0) }}</p>
            </div>
            <div class="bg-green-100 p-3 rounded-full">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Orders Card -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 uppercase tracking-wider">Tổng Đơn Hàng</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.totalOrders || 0 }}</p>
            </div>
            <div class="bg-blue-100 p-3 rounded-full">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Products Card -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 uppercase tracking-wider">Sản Phẩm</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.totalProducts || 0 }}</p>
            </div>
            <div class="bg-purple-100 p-3 rounded-full">
              <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Users Card -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 uppercase tracking-wider">Thành Viên</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.totalUsers || 0 }}</p>
            </div>
            <div class="bg-orange-100 p-3 rounded-full">
              <svg class="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Revenue Chart -->
        <div class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-gray-900">{{ chartTitle }}</h3>
            <div class="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
              <button
                v-for="period in periodOptions"
                :key="period.value"
                @click="changePeriod(period.value)"
                :class="[
                  'px-4 py-2 text-sm font-medium rounded-md transition-all',
                  selectedPeriod === period.value ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-200'
                ]"
              >
                {{ period.label }}
              </button>
            </div>
          </div>

          <!-- Chart Loading -->
          <div v-if="chartLoading" class="flex items-center justify-center h-80">
            <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600"></div>
          </div>

          <!-- Chart Content -->
          <div v-else class="relative">
            <div class="flex h-80">
              <!-- Y-Axis -->
              <div class="flex flex-col justify-between text-xs font-bold text-gray-500 pr-4 py-2 text-right w-20">
                <span>{{ formatCurrency(maxRevenue) }}</span>
                <span>{{ formatCurrency(maxRevenue * 0.75) }}</span>
                <span>{{ formatCurrency(maxRevenue * 0.5) }}</span>
                <span>{{ formatCurrency(maxRevenue * 0.25) }}</span>
                <span>0 ₫</span>
              </div>

              <!-- Chart Area -->
              <div class="flex-1 flex flex-col relative">
                <!-- Grid Lines -->
                <div class="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  <div class="border-t border-gray-100 w-full"></div>
                  <div class="border-t border-gray-100 w-full"></div>
                  <div class="border-t border-gray-100 w-full"></div>
                  <div class="border-t border-gray-100 w-full"></div>
                  <div class="border-b border-gray-100 w-full"></div>
                </div>

                <!-- Bars -->
                <div class="flex-1 flex items-end justify-between gap-2 pb-8">
                  <div
                    v-for="(value, key) in stats.revenueChart"
                    :key="key"
                    class="flex-1 flex flex-col items-center relative group"
                  >
                    <!-- Tooltip -->
                    <div class="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {{ formatCurrency(value) }}
                    </div>

                    <!-- Bar -->
                    <div
                      class="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors min-h-[4px]"
                      :style="{ height: calculateHeight(value) + '%' }"
                    ></div>

                    <!-- X-Axis Label -->
                    <span class="absolute -bottom-6 text-xs font-medium text-gray-600">
                      {{ formatDate(key) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- X-Axis Title -->
            <div class="text-center text-xs text-gray-500 font-medium mt-4 uppercase tracking-wider">
              {{ xAxisLabel }}
            </div>
          </div>
        </div>

        <!-- Category Distribution -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-6">Tỷ Lệ Danh Mục</h3>

          <div class="grid grid-cols-1 gap-8 lg:grid-cols-[1.05fr_1fr]">
            <div class="flex flex-col items-center">
              <!-- Pie Chart -->
              <div class="relative w-48 h-48 mb-6">
                <div
                  class="w-full h-full rounded-full shadow-inner"
                  :style="pieChartStyle"
                ></div>
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="text-center">
                    <div class="text-2xl font-bold text-gray-900">{{ stats.totalProducts || 0 }}</div>
                    <div class="text-xs text-gray-500 uppercase">Sản Phẩm</div>
                  </div>
                </div>
              </div>

              <div class="text-sm text-gray-500 text-center px-4">
                Biểu đồ tròn hiển thị tỷ lệ số sản phẩm theo danh mục. Mỗi danh mục có màu riêng để dễ phân biệt.
              </div>
            </div>

            <div class="flex flex-col justify-between">
              <div>
                <div class="text-sm font-medium text-gray-600 uppercase tracking-wide mb-4">Số sản phẩm theo danh mục</div>
                <div class="flex items-end gap-3 h-44">
                  <div
                    v-for="item in barChartData"
                    :key="item.name"
                    class="flex-1 flex flex-col items-center"
                  >
                    <div
                      :style="{ height: calculateCategoryHeight(item.count) + '%', backgroundColor: item.color }"
                      class="w-full rounded-t-3xl transition-all"
                    ></div>
                    <span class="mt-3 text-xs text-center text-gray-700 leading-tight">{{ item.name }}</span>
                    <span class="text-xs font-bold text-gray-900">{{ item.count }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-2 mt-8">
            <div
              v-for="(item, index) in pieChartData"
              :key="index"
              class="flex items-center justify-between text-sm"
            >
              <div class="flex items-center">
                <div class="w-3 h-3 rounded-full mr-2" :style="{ backgroundColor: item.color }"></div>
                <span class="text-gray-700">{{ item.name }}</span>
              </div>
              <div class="text-right">
                <span class="font-medium text-gray-900">{{ item.count }} sản phẩm</span>
                <span class="text-xs text-gray-500 block">{{ Math.round(item.percentage) }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tables Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Recent Orders -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 class="text-lg font-bold text-gray-900">Đơn Hàng Gần Đây</h3>
            <router-link
              to="/admin/orders"
              class="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Xem tất cả →
            </router-link>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">ID</th>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Khách Hàng</th>
                  <th class="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase">Tổng Tiền</th>
                  <th class="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase">Trạng Thái</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr
                  v-for="order in stats.recentOrders"
                  :key="order.id"
                  class="hover:bg-gray-50"
                >
                  <td class="px-6 py-4 text-sm font-semibold text-gray-900">#{{ order.id }}</td>
                  <td class="px-6 py-4 text-sm text-gray-700">{{ order.customerName }}</td>
                  <td class="px-6 py-4 text-sm font-bold text-right text-gray-900">
                    {{ formatCurrency(order.totalPrice) }}
                  </td>
                  <td class="px-6 py-4 text-center">
                    <span
                      :class="statusClass(order.status)"
                      class="px-2 py-1 rounded-full text-xs font-bold uppercase"
                    >
                      {{ statusText(order.status) }}
                    </span>
                  </td>
                </tr>
                <tr v-if="!stats.recentOrders || stats.recentOrders.length === 0">
                  <td colspan="4" class="px-6 py-8 text-center text-gray-500">
                    Chưa có đơn hàng nào
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Low Stock Products -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 class="text-lg font-bold text-red-600 flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
              Sản Phẩm Sắp Hết Hàng
            </h3>
            <router-link
              to="/admin/products"
              class="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Nhập hàng →
            </router-link>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Sản Phẩm</th>
                  <th class="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase">Tồn Kho</th>
                  <th class="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase">Giá Bán</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr
                  v-for="product in stats.lowStockProducts"
                  :key="product.id"
                  class="hover:bg-gray-50"
                >
                  <td class="px-6 py-4 text-sm text-gray-900">
                    <div class="flex items-center">
                      <img
                        :src="getImageUrl(product.imageUrl)"
                        class="w-10 h-10 rounded-lg object-cover mr-3"
                        :alt="product.name"
                      />
                      <span class="font-medium">{{ product.name }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <span class="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-bold">
                      {{ product.stock }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm font-medium text-right text-gray-900">
                    {{ formatCurrency(product.price) }}
                  </td>
                </tr>
                <tr v-if="!stats.lowStockProducts || stats.lowStockProducts.length === 0">
                  <td colspan="3" class="px-6 py-8 text-center text-gray-500">
                    <div class="flex flex-col items-center">
                      <svg class="w-8 h-8 text-green-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      Kho hàng ổn định
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api, { getImageUrl } from '@/api/axios'

// Reactive data
const stats = ref({})
const loading = ref(true)
const chartLoading = ref(false)
const selectedPeriod = ref('last7days')

// Period options
const periodOptions = [
  { value: 'today', label: 'Hôm nay' },
  { value: 'last7days', label: '7 ngày qua' },
  { value: 'last30days', label: '30 ngày qua' }
]

// Fetch dashboard data
const fetchData = async (period, isInitial = false) => {
  if (isInitial) loading.value = true
  else chartLoading.value = true

  try {
    const { data } = await api.get('/admin/dashboard/stats', { params: { period } })
    if (isInitial) stats.value = data
    else stats.value.revenueChart = data.revenueChart
  } catch (err) {
    console.error('Lỗi tải Dashboard:', err)
  } finally {
    loading.value = false
    chartLoading.value = false
  }
}

// Change period
const changePeriod = (val) => {
  selectedPeriod.value = val
  fetchData(val)
}

// Lifecycle
onMounted(() => {
  fetchData(selectedPeriod.value, true)
})

// Computed properties
const maxRevenue = computed(() => {
  const values = Object.values(stats.value.revenueChart || {})
  return Math.max(...values, 0) || 1000000
})

const calculateHeight = (value) => {
  if (maxRevenue.value === 0) return 0
  return (value / maxRevenue.value) * 100
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  if (/^\d{2}$/.test(dateString)) {
    return `${dateString}h`
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const [year, month, day] = dateString.split('-')
    return `${Number(day)}/${Number(month)}`
  }
  const date = new Date(dateString)
  return `${date.getDate()}/${date.getMonth() + 1}`
}

const chartTitle = computed(() => {
  const option = periodOptions.find(p => p.value === selectedPeriod.value)
  return `Biểu đồ doanh thu ${option?.label.toLowerCase() || ''}`
})

const xAxisLabel = computed(() => {
  return selectedPeriod.value === 'today' ? 'Thời gian (Giờ)' : 'Thời gian (Ngày)'
})

const pieColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

const pieChartData = computed(() => {
  if (!stats.value.productCategoryRatio) return []

  const validEntries = Object.entries(stats.value.productCategoryRatio)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])

  const total = validEntries.reduce((sum, [, count]) => sum + count, 0)
  if (total === 0) return []

  return validEntries.map(([name, count], index) => ({
    name,
    count,
    percentage: (count / total) * 100,
    color: pieColors[index % pieColors.length]
  }))
})

const barChartData = computed(() => {
  return [...pieChartData.value].sort((a, b) => b.count - a.count)
})

const maxCategoryCount = computed(() => {
  if (barChartData.value.length === 0) return 1
  return Math.max(...barChartData.value.map(item => item.count), 1)
})

const calculateCategoryHeight = (count) => {
  if (!maxCategoryCount.value) return 0
  return (count / maxCategoryCount.value) * 100
}

const pieChartStyle = computed(() => {
  if (pieChartData.value.length === 0) return { background: '#f3f4f6' }

  let currentAngle = 0
  const segments = pieChartData.value.map(item => {
    const start = currentAngle
    const angle = (item.percentage / 100) * 360
    currentAngle += angle
    return `${item.color} ${start}deg ${currentAngle}deg`
  })

  return {
    background: `conic-gradient(${segments.join(', ')})`
  }
})

// Helper functions
const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0)
}

const statusClass = (status) => {
  const classes = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    SHIPPED: 'bg-purple-100 text-purple-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const statusText = (status) => {
  const texts = {
    PENDING: 'Chờ',
    CONFIRMED: 'Xác nhận',
    SHIPPED: 'Giao hàng',
    DELIVERED: 'Hoàn tất',
    CANCELLED: 'Hủy'
  }
  return texts[status] || status
}
</script>