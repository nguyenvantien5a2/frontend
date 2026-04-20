<template>
    <div class="container mx-auto p-6">
        <h1 class="text-3xl font-bold mb-8">Thanh toán đơn hàng</h1>

        <div v-if="cart.items.length === 0" class="text-center py-20 bg-white rounded-lg shadow">
            <p class="text-xl text-gray-500 mb-4">Giỏ hàng của bạn đang trống.</p>
            <router-link to="/" class="text-blue-600 hover:underline">Quay lại mua sắm</router-link>
        </div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Cột trái: Thông tin khách hàng -->
            <div class="lg:col-span-2 space-y-6">
                <div class="bg-white p-6 rounded-lg shadow-md">
                    <h2 class="text-xl font-semibold mb-4 border-b pb-2">Thông tin giao hàng</h2>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-gray-700">Họ và tên</label>
                            <input v-model="form.customer_name" type="text" class="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400" required>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-gray-700">Số điện thoại</label>
                                <input v-model="form.phone" type="text" class="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400" required>
                            </div>
                            <div>
                                <label class="block text-gray-700">Địa chỉ email (không bắt buộc)</label>
                                <input v-model="form.email" type="email" class="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400">
                            </div>
                        </div>
                        <div>
                            <label class="block text-gray-700">Địa chỉ nhận hàng</label>
                            <textarea v-model="form.shipping_address" rows="3" class="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400" required></textarea>
                        </div>
                        <div>
                            <label class="block text-gray-700">Ghi chú đơn hàng</label>
                            <input v-model="form.note" type="text" class="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400">
                        </div>
                    </div>
                </div>
            </div>

            <!-- Cột phải: Tóm tắt đơn hàng -->
            <div class="lg:col-span-1">
                <div class="bg-white p-6 rounded-lg shadow-md sticky top-4">
                    <h2 class="text-xl font-semibold mb-4 border-b pb-2">Đơn hàng của bạn</h2>
                    
                    <div class="max-h-60 overflow-y-auto mb-4 space-y-3">
                        <div v-for="item in cart.items" :key="item.product_id" class="flex justify-between text-sm">
                            <span class="text-gray-600">{{ item.name }} x{{ item.quantity }}</span>
                            <span class="font-medium">{{ (item.price * item.quantity).toLocaleString('vi-VN') }}đ</span>
                        </div>
                    </div>

                    <div class="border-t pt-4 space-y-2">
                        <div class="flex justify-between">
                            <span>Tạm tính:</span>
                            <span>{{ cart.totalPrice.toLocaleString('vi-VN') }}đ</span>
                        </div>
                        
                        <!-- Phần mã giảm giá -->
                        <div class="py-2">
                            <div class="flex gap-2">
                                <input v-model="couponCode" placeholder="Mã giảm giá" class="border p-2 rounded text-sm flex-1">
                                <button @click="applyCoupon" :disabled="!couponCode || checkingCoupon" 
                                    class="bg-gray-800 text-white px-3 py-1 rounded text-sm hover:bg-black disabled:bg-gray-400">
                                    Áp dụng
                                </button>
                            </div>
                            <p v-if="couponMessage" :class="['text-xs mt-1', couponSuccess ? 'text-green-600' : 'text-red-600']">
                                {{ couponMessage }}
                            </p>
                        </div>

                        <div v-if="discountAmount > 0" class="flex justify-between text-green-600">
                            <span>Giảm giá:</span>
                            <span>-{{ discountAmount.toLocaleString('vi-VN') }}đ</span>
                        </div>
                        
                        <div class="flex justify-between text-xl font-bold border-t pt-4 text-blue-600">
                            <span>Tổng cộng:</span>
                            <span>{{ Math.max(0, cart.totalPrice - discountAmount).toLocaleString('vi-VN') }}đ</span>
                        </div>
                    </div>

                    <button @click="handlePlaceOrder" :disabled="loading" 
                        class="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition duration-200 disabled:bg-blue-300">
                        {{ loading ? 'Đang xử lý...' : 'XÁC NHẬN ĐẶT HÀNG' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart';
import { useAuthStore } from '../stores/auth';
import axiosClient from '../api/axios';

const cart = useCartStore();
const auth = useAuthStore();
const router = useRouter();

const loading = ref(false);
const checkingCoupon = ref(false);
const couponCode = ref('');
const couponMessage = ref('');
const couponSuccess = ref(false);
const discountAmount = ref(0);

const form = reactive({
    customer_name: auth.user?.name || '',
    phone: auth.user?.phone || '',
    email: auth.user?.email || '',
    shipping_address: '',
    note: ''
});

const applyCoupon = async () => {
    checkingCoupon.value = true;
    couponMessage.value = '';
    try {
        const response = await axiosClient.post('/check-coupon', {
            code: couponCode.value,
            subtotal: cart.totalPrice
        });
        discountAmount.value = response.data.discount_amount;
        couponSuccess.value = true;
        couponMessage.value = `Áp dụng mã thành công! Giảm ${discountAmount.value.toLocaleString('vi-VN')}đ`;
    } catch (err) {
        discountAmount.value = 0;
        couponSuccess.value = false;
        couponMessage.value = err.response?.data?.message || 'Mã giảm giá không hợp lệ';
    } finally {
        checkingCoupon.value = false;
    }
};

const handlePlaceOrder = async () => {
    loading.value = true;
    try {
        const payload = {
            ...form,
            coupon_code: couponSuccess.value ? couponCode.value : null,
            details: cart.items.map(item => ({ product_id: item.product_id, quantity: item.quantity }))
        };
        await axiosClient.post('/orders', payload);
        alert('Đặt hàng thành công!');
        cart.clearCart();
        router.push('/');
    } catch (err) {
        alert(err.response?.data?.message || 'Có lỗi xảy ra khi đặt hàng');
    } finally {
        loading.value = false;
    }
};
</script>