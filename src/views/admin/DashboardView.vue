<!-- e:\0. Database\tbnv\frontend\src\views\admin\DashboardView.vue -->
<template>
  <div>
    <h2 class="text-3xl font-bold text-gray-800 mb-8">Tổng Quan Hệ Thống</h2>

    <div v-if="loading" class="text-center py-10">
      <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600 mx-auto"></div>
    </div>

    <div v-else>
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Card Doanh Thu -->
        <div class="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
          <div class="text-gray-500 text-sm font-medium uppercase">Doanh thu</div>
          <div class="text-2xl font-bold text-gray-800 mt-2">
            {{ formatCurrency(stats.revenue || 0) }}
          </div>
        </div>

        <!-- Card Đơn Hàng -->
        <div class="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
          <div class="text-gray-500 text-sm font-medium uppercase">Tổng đơn hàng</div>
          <div class="text-2xl font-bold text-gray-800 mt-2">{{ stats.totalOrders || 0 }}</div>
        </div>

        <!-- Card Sản Phẩm -->
        <div class="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
          <div class="text-gray-500 text-sm font-medium uppercase">Sản phẩm</div>
          <div class="text-2xl font-bold text-gray-800 mt-2">{{ stats.totalProducts || 0 }}</div>
        </div>

        <!-- Card Thành Viên -->
        <div class="bg-white p-6 rounded-xl shadow-sm border-l-4 border-orange-500">
          <div class="text-gray-500 text-sm font-medium uppercase">Thành viên</div>
          <div class="text-2xl font-bold text-gray-800 mt-2">{{ stats.totalUsers || 0 }}</div>
        </div>
      </div>

      <!-- Grid Biểu đồ -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <!-- Biểu đồ doanh thu (Chiếm 2/3) -->
        <div class="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative">
           <!-- Loading overlay for chart -->
          <div v-if="chartLoading" class="absolute inset-0 bg-white/70 flex items-center justify-center z-20 rounded-xl">
            <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600"></div>
          </div>

          <div class="flex items-center justify-between mb-6">
            <h3 class="font-bold text-lg text-gray-800">{{ chartTitle }}</h3>
            
            <!-- Period Filter -->
            <div class="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
              <button 
                v-for="period in periodOptions" 
                :key="period.value"
                @click="changePeriod(period.value)"
                :class="[
                  'px-3 py-1 text-sm font-medium rounded-md transition-colors whitespace-nowrap',
                  selectedPeriod === period.value ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:bg-gray-200'
                ]"
              >
                {{ period.label }}
              </button>
            </div>
          </div>

          <div class="flex h-80">
            <!-- Trục dọc (Y-Axis) -->
            <div class="flex flex-col justify-between text-xs font-bold text-gray-900 pr-4 py-2 text-right w-24 border-r border-gray-100 font-mono">
              <span>{{ formatCurrency(maxRevenue) }}</span>
              <span>{{ formatCurrency(maxRevenue * 0.75) }}</span>
              <span>{{ formatCurrency(maxRevenue * 0.5) }}</span>
              <span>{{ formatCurrency(maxRevenue * 0.25) }}</span>
              <span>0 ₫</span>
            </div>

            <!-- Khu vực biểu đồ -->
            <div class="flex-1 flex flex-col relative pl-4">
              <!-- Grid lines ngang -->
              <div class="absolute inset-0 flex flex-col justify-between pl-4 pointer-events-none">
                <div class="border-t border-gray-100 w-full h-0 mt-2"></div>
                <div class="border-t border-gray-100 w-full h-0"></div>
                <div class="border-t border-gray-100 w-full h-0"></div>
                <div class="border-t border-gray-100 w-full h-0"></div>
                <div class="border-b border-gray-100 w-full h-0 mb-8"></div>
              </div>

              <!-- Các cột (Bars) -->
              <div class="flex-1 flex items-end justify-between gap-4 z-10 pb-8">
                <div v-for="(value, key) in stats.revenueChart" :key="key" class="flex flex-col items-center flex-1 relative group h-full justify-end">
                  <!-- Tooltip -->
                  <div class="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition z-20 whitespace-nowrap pointer-events-none shadow-lg">
                    {{ formatCurrency(value) }}
                  </div>
                  
                  <!-- Bar Container -->
                  <div class="w-full bg-blue-50 rounded-t-md relative overflow-hidden group-hover:bg-blue-100 transition-colors h-full flex items-end">
                     <div class="w-full bg-blue-500 rounded-t-md transition-all duration-500 group-hover:bg-blue-600 relative" :style="{ height: calculateHeight(value) + '%' }"></div>
                  </div>
                  
                  <!-- Trục ngang (X-Axis Label) -->
                  <div class="absolute -bottom-6 text-xs text-gray-900 font-bold whitespace-nowrap">
                    {{ formatDate(key) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="text-center text-xs text-gray-400 mt-2 font-bold uppercase tracking-wider">{{ xAxisLabel }}</div>
        </div>

        <!-- Biểu đồ tròn danh mục (Chiếm 1/3) -->
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <h3 class="font-bold text-lg text-gray-800 mb-6">Tỷ lệ danh mục</h3>
          
          <div class="flex-1 flex flex-col items-center justify-center">
            <!-- Donut Chart -->
            <div class="relative w-48 h-48 rounded-full shadow-inner" :style="pieChartStyle">
              <!-- Lỗ tròn ở giữa để tạo hiệu ứng Donut -->
              <div class="absolute inset-0 m-auto w-28 h-28 bg-white rounded-full flex flex-col items-center justify-center shadow-sm">
                <span class="text-3xl font-bold text-gray-800">{{ stats.totalProducts || 0 }}</span>
                <span class="text-xs text-gray-500 font-medium uppercase">Sản phẩm</span>
              </div>
            </div>

            <!-- Chú thích (Legend) -->
            <div class="mt-8 w-full space-y-3">
              <div v-for="(item, index) in pieChartData" :key="index" class="flex items-center justify-between text-sm group hover:bg-gray-50 p-1 rounded transition">
                <div class="flex items-center">
                  <div class="w-3 h-3 rounded-full mr-3 shadow-sm" :style="{ backgroundColor: item.color }"></div>
                  <span class="text-gray-600 font-medium">{{ item.name }}</span>
                </div>
                <div class="flex items-center">
                  <span class="font-bold text-gray-800 mr-2">{{ item.count }}</span>
                  <span class="text-xs font-bold text-gray-900 w-10 text-right">({{ Math.round(item.percentage) }}%)</span>
                </div>
              </div>
              <div v-if="pieChartData.length === 0" class="text-center text-gray-400 text-sm py-4">
                Chưa có dữ liệu danh mục
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Recent Orders Table -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 class="font-bold text-lg text-gray-800">Đơn Hàng Gần Đây</h3>
              <router-link to="/admin/orders" class="text-blue-600 hover:text-blue-800 text-sm font-medium">Xem tất cả</router-link>
            </div>
            <div class="overflow-x-auto flex-1">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">ID</th>
                      <th class="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Khách</th>
                      <th class="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase">Tổng</th>
                      <th class="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">TT</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="order in stats.recentOrders" :key="order.id" class="hover:bg-gray-50">
                      <td class="px-4 py-3 text-sm font-semibold text-gray-700">#{{ order.id }}</td>
                      <td class="px-4 py-3 text-sm text-gray-900 truncate max-w-[100px]" :title="order.customerName">{{ order.customerName }}</td>
                      <td class="px-4 py-3 text-sm font-bold text-right text-gray-700">
                        {{ formatCurrency(order.totalPrice) }}
                      </td>
                      <td class="px-4 py-3 text-center">
                        <span :class="statusClass(order.status)" class="px-2 py-1 rounded-full text-[10px] font-bold uppercase">
                          {{ statusText(order.status) }}
                        </span>
                      </td>
                    </tr>
                    <tr v-if="!stats.recentOrders || stats.recentOrders.length === 0">
                      <td colspan="4" class="px-6 py-8 text-center text-gray-500">Chưa có đơn hàng nào.</td>
                    </tr>
                  </tbody>
                </table>
            </div>
          </div>

          <!-- Low Stock Products Table -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 class="font-bold text-lg text-red-600 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                Sắp Hết Hàng
              </h3>
              <router-link to="/admin/products" class="text-blue-600 hover:text-blue-800 text-sm font-medium">Nhập hàng</router-link>
            </div>
            <div class="overflow-x-auto flex-1">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                        <th class="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase">Sản phẩm</th>
                        <th class="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase">Kho</th>
                        <th class="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase">Giá bán</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="product in stats.lowStockProducts" :key="product.id" class="hover:bg-gray-50">
                        <td class="px-4 py-3 text-sm text-gray-900">
                            <div class="flex items-center">
                                <div class="h-8 w-8 rounded bg-gray-100 mr-3 flex-shrink-0 overflow-hidden border border-gray-200">
                                    <img :src="getImageUrl(product.imageUrl)" class="h-full w-full object-cover" onerror="this.style.display='none'" />
                                </div>
                                <span class="line-clamp-1 font-medium" :title="product.name">{{ product.name }}</span>
                            </div>
                        </td>
                        <td class="px-4 py-3 text-center text-sm font-bold text-red-600 bg-red-50">{{ product.stock }}</td>
                        <td class="px-4 py-3 text-right text-sm text-gray-500">{{ formatCurrency(product.price) }}</td>
                    </tr>
                     <tr v-if="!stats.lowStockProducts || stats.lowStockProducts.length === 0">
                        <td colspan="3" class="px-6 py-8 text-center text-gray-500 text-sm">
                            <div class="flex flex-col items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
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

const stats = ref({})
const loading = ref(true)
const chartLoading = ref(false)
const selectedPeriod = ref('last7days')

const periodOptions = [
  { value: 'today', label: 'Hôm nay' },
  { value: 'last7days', label: '7 ngày qua' },
  { value: 'last30days', label: '30 ngày qua' }
]

const fetchDashboardData = async (period) => {
  const isInitialLoad = loading.value;
  if (!isInitialLoad) {
    chartLoading.value = true
  }

  try {
    const res = await api.get('/admin/dashboard/stats', { params: { period } })
    if (isInitialLoad) {
      stats.value = res.data
    } else {
      // Chỉ cập nhật dữ liệu biểu đồ để tránh giật lag toàn trang
      stats.value.revenueChart = res.data.revenueChart
    }
  } catch (error) {
    console.error(`Lỗi tải dữ liệu cho kỳ ${period}:`, error)
  } finally {
    if (isInitialLoad) {
      loading.value = false
    }
    chartLoading.value = false
  }
}

const changePeriod = (newPeriod) => {
  if (selectedPeriod.value === newPeriod) return
  selectedPeriod.value = newPeriod
  fetchDashboardData(newPeriod)
}

onMounted(() => {
  fetchDashboardData(selectedPeriod.value)
})

const maxRevenue = computed(() => {
  if (!stats.value.revenueChart) return 0
  const values = Object.values(stats.value.revenueChart)
  return Math.max(...values) || 0
})

const xAxisLabel = computed(() => {
  return selectedPeriod.value === 'today' ? 'Thời gian (Giờ)' : 'Thời gian (Ngày)'
})

const chartTitle = computed(() => {
  const option = periodOptions.find(p => p.value === selectedPeriod.value)
  return `Biểu đồ doanh thu (${option?.label.toLowerCase() || ''})`
})


// Pie Chart Logic
const pieColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6']

const pieChartData = computed(() => {
  if (!stats.value.productCategoryRatio) return []
  
  const total = Object.values(stats.value.productCategoryRatio).reduce((a, b) => a + b, 0)
  if (total === 0) return []

  return Object.entries(stats.value.productCategoryRatio).map(([name, count], index) => {
    return {
      name,
      count,
      percentage: (count / total) * 100,
      color: pieColors[index % pieColors.length]
    }
  })
})

const pieChartStyle = computed(() => {
  if (pieChartData.value.length === 0) return { background: '#f3f4f6' }
  
  let currentAngle = 0
  const segments = pieChartData.value.map(item => {
    const start = currentAngle
    const angle = (item.count / stats.value.totalProducts) * 360
    currentAngle += angle
    return `${item.color} ${start}deg ${currentAngle}deg`
  })

  return {
    background: `conic-gradient(${segments.join(', ')})`
  }
})

// Helpers
const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0)
}

const formatDate = (dateString) => {
    if (!dateString) return ''
    // Xử lý cho trường hợp 'today' (key là giờ, vd: "08")
    if (/^\d{2}$/.test(dateString)) {
        return `${dateString}h`
    }
    const date = new Date(dateString)
    return `${date.getDate()}/${date.getMonth() + 1}`
}

const calculateHeight = (value) => {
    if (maxRevenue.value === 0) return 0
    // Đảm bảo hiển thị ít nhất 1 chút nếu có giá trị > 0 nhưng rất nhỏ
    if (value > 0 && (value / maxRevenue.value) * 100 < 1) return 1
    return (value / maxRevenue.value) * 100
}

const statusClass = (status) => {
  const classes = { PENDING: 'bg-yellow-100 text-yellow-800', CONFIRMED: 'bg-blue-100 text-blue-800', SHIPPED: 'bg-purple-100 text-purple-800', DELIVERED: 'bg-green-100 text-green-800', CANCELLED: 'bg-red-100 text-red-800' }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const statusText = (status) => {
  const texts = { PENDING: 'Chờ', CONFIRMED: 'Đã xác nhận', SHIPPED: 'Đang giao', DELIVERED: 'Hoàn tất', CANCELLED: 'Hủy' }
  return texts[status] || status
}
</script>
