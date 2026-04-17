import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import api from '@/api/axios'

// Lazy loading views
const HomeView = () => import('../views/Home.vue')
const LoginView = () => import('../views/Login.vue')
const RegisterView = () => import('../views/Register.vue')
const ProductDetailView = () => import('../views/ProductDetail.vue')
const ProductsView = () => import('../views/Products.vue')
const Profile = () => import('../views/Profile.vue')
const CartView = () => import('../views/Cart.vue')
const CheckoutInfo = () => import('../views/CheckoutInfo.vue')
const CheckoutConfirm = () => import('../views/CheckoutConfirm.vue')
const PromotionsView = () => import('../views/Promotions.vue')
const PaymentView = () => import('../views/Payment.vue')
const PaymentSuccessView = () => import('../views/PaymentSuccess.vue')
const MyOrders = () => import('../views/MyOrders.vue')

// Admin components
const AdminLayout = () => import('../layouts/AdminLayout.vue')
const DashboardView = () => import('../views/admin/Dashboard.vue')
const AdminProduct = () => import('../views/admin/AdminProduct.vue')
const AdminCategory = () => import('../views/admin/AdminCategory.vue')
const AdminPromotion = () => import('../views/admin/AdminPromotion.vue')
const AdminOrder = () => import('../views/admin/AdminOrder.vue')
const AdminUser = () => import('../views/admin/AdminUser.vue')

const routes = [
    { path: '/', name: 'home', component: HomeView },
    { path: '/cart', name: 'cart', component: CartView },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/register', name: 'register', component: RegisterView },
    { path: '/products/:id', name: 'product-detail', component: ProductDetailView },
    { path: '/products', name: 'products', component: ProductsView },
    { path: '/promotions', name: 'promotions', component: PromotionsView },
    { path: '/checkout', name: 'checkout-info', component: CheckoutInfo, meta: { requiresAuth: true } },
    { path: '/checkout-confirm', name: 'checkout-confirm', component: CheckoutConfirm, meta: { requiresAuth: true } },
    { path: '/payment', name: 'payment', component: PaymentView, meta: { requiresAuth: true } },
    { path: '/payment-success', name: 'payment-success', component: PaymentSuccessView, meta: { requiresAuth: true } },
    { path: '/my-orders', name: 'my-orders', component: MyOrders, meta: { requiresAuth: true } },

    {
        path: '/profile',
        name: 'profile',
        component: Profile,
        meta: { requiresAuth: true }
    },
    { 
        path: '/admin', 
        component: AdminLayout,
        meta: { 
            requiresAuth: true,
            requiresAdmin: true,
            hideHeaderFooter: true 
        },
        children: [
            { path: '', redirect: { name: 'admin-dashboard' } },
            { 
                path: 'dashboard', 
                name: 'admin-dashboard',
                component: DashboardView 
            },
            {
                path: 'products',
                name: 'admin-products',
                component: AdminProduct
            },
            {
                path: 'categories',
                name: 'admin-categories',
                component: AdminCategory
            },
            {
                path: 'promotions',
                name: 'admin-promotions',
                component: AdminPromotion
            },
            {
                path: 'orders',
                name: 'admin-orders',
                component: AdminOrder
            },
            {
                path: 'users',
                name: 'admin-users',
                component: AdminUser
            }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) return savedPosition;
        return { top: 0 };
    }
});

router.beforeEach(async (to, from) => {
    const authStore = useAuthStore();
    
    // Khôi phục thông tin user nếu reload trang
    if (authStore.token && !authStore.user?.role) {
        try {
            const res = await api.get('/users/profile');
            authStore.user = res.data;
        } catch (e) {
            authStore.logout();
        }
    }

    // Kiểm tra tài khoản bị khóa
    if (authStore.user?.locked) {
        authStore.logout();
        return { name: 'login', query: { message: 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên để được hỗ trợ.' } };
    }

    if (to.meta.requiresAuth && !authStore.token) {
        return { name: 'login', query: { redirect: to.fullPath } };
    }
    
    if (to.name === 'login' && authStore.token) {
        // Nếu đã đăng nhập mà cố vào trang login, đẩy về trang chủ hoặc trang được redirect
        const redirectPath = to.query.redirect || { name: 'home' };
        return redirectPath;
    }
    
    if (to.meta.requiresAdmin && authStore.user?.role !== 'ADMIN') {
        return { name: 'home' };
    }
    
    return true;
});

export default router;