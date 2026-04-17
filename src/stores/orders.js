import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api/axios'

export const useOrdersStore = defineStore('orders', () => {
  const orders = ref([])

  async function fetchOrders() {
    try {
      console.log('📦 Fetching orders từ backend...')
      const response = await api.get('/my-orders')
      console.log('📊 Response data:', response.data)
      console.log('📊 Response status:', response.status)
      // Laravel paginate trả về mảng nằm trong property 'data'
      orders.value = response.data.data || response.data
      console.log('✅ Orders loaded:', orders.value.length, 'orders found')
      return orders.value
    } catch (err) {
      console.error('❌ Lỗi fetch orders:', err)
      console.error('❌ Error status:', err.response?.status)
      console.error('❌ Error data:', err.response?.data)
      throw err
    }
  }

  async function createOrder(orderData) {
    try {
      console.log('📦 Creating order:', orderData)
      const response = await api.post('/orders', orderData)
      console.log('✅ Order created:', response.data)
      orders.value.push(response.data)
      return response.data
    } catch (err) {
      console.error('❌ Lỗi create order:', err)
      throw err
    }
  }

  return { orders, fetchOrders, createOrder }
})
