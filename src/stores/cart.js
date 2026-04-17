import { defineStore } from 'pinia'
import { useToastStore } from './toast'

export const useCartStore = defineStore('cart', {
  state: () => ({
    // Khởi tạo giỏ hàng từ localStorage nếu có để giữ dữ liệu khi F5 trang
    items: JSON.parse(localStorage.getItem('cart') || '[]')
  }),

  getters: {
    // Tính tổng tiền tạm tính của giỏ hàng
    totalPrice: (state) => {
      return state.items.reduce((total, item) => {
        return total + (item.price * (item.quantity || 1))
      }, 0)
    },
    // Tính tổng số lượng sản phẩm (dùng cho badge trên Header)
    cartCount: (state) => {
      return state.items.reduce((total, item) => total + (item.quantity || 0), 0)
    }
  },

  actions: {
    // Cập nhật số lượng sản phẩm (được gọi từ Cart.vue)
    updateQuantity(productId, quantity) {
      const item = this.items.find(i => i.id === productId)
      if (item) {
        item.quantity = parseInt(quantity)
        this.persistCart()
      }
    },

    // Xóa sản phẩm khỏi giỏ hàng
    removeFromCart(productId) {
      this.items = this.items.filter(item => item.id !== productId)
      this.persistCart()
    },

    // Thêm sản phẩm vào giỏ (nếu đã có thì tăng số lượng)
    addToCart(product) {
      const toast = useToastStore()
      const existingItem = this.items.find(item => item.id === product.id)
      if (existingItem) {
        if (existingItem.quantity < product.stock) {
          existingItem.quantity++
          toast.success(`Đã tăng số lượng ${product.name} trong giỏ hàng`)
        }
      } else {
        this.items.push({
          ...product,
          quantity: 1
        })
        toast.success(`Đã thêm ${product.name} vào giỏ hàng`)
      }
      this.persistCart()
    },

    // Xóa sạch giỏ hàng
    clearCart() {
      this.items = []
      this.persistCart()
    },

    // Lưu trạng thái giỏ hàng vào localStorage
    persistCart() {
      localStorage.setItem('cart', JSON.stringify(this.items))
    }
  }
})