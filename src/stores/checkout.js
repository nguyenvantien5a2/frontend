import { defineStore } from 'pinia'

export const useCheckoutStore = defineStore('checkout', {
  state: () => ({
    // Lưu coupon vào localStorage để đồng bộ với giỏ hàng khi F5
    appliedCoupon: JSON.parse(localStorage.getItem('applied_coupon') || 'null'),
    // Khởi tạo cấu trúc mặc định để tránh lỗi undefined và tăng tính phản ứng
    checkoutInfo: JSON.parse(localStorage.getItem('checkout_info')) || {
      customerName: '',
      phone: '',
      email: '',
      shippingAddress: '',
      note: ''
    }
  }),

  actions: {
    saveCheckoutInfo(info) {
      // Merge thông tin cũ và mới để tránh mất dữ liệu
      this.checkoutInfo = { ...this.checkoutInfo, ...info }
      localStorage.setItem('checkout_info', JSON.stringify(this.checkoutInfo))
    },

    applyCoupon(coupon) {
      this.appliedCoupon = coupon
      localStorage.setItem('applied_coupon', JSON.stringify(coupon))
    },

    clearCoupon() {
      this.appliedCoupon = null
      localStorage.removeItem('applied_coupon')
    },

    // Reset toàn bộ thông tin sau khi đặt hàng thành công
    resetCheckout() {
      this.appliedCoupon = null
      this.checkoutInfo = {
        customerName: '',
        phone: '',
        email: '',
        shippingAddress: '',
        note: ''
      }
      localStorage.removeItem('applied_coupon')
      localStorage.removeItem('checkout_info')
    }
  }
})