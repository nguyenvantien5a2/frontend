# LKMT Store - Frontend (Vue.js 3 + Vite)

Hệ thống cửa hàng kinh doanh linh kiện máy tính LKMT. Dự án này được xây dựng bằng Vue.js 3, tích hợp với hệ thống API Laravel phía Backend.

## Công nghệ sử dụng

- **Core:** Vue.js 3 (Composition API)
- **Build Tool:** Vite
- **State Management:** Pinia
- **Routing:** Vue Router
- **Styling:** Tailwind CSS & SCSS
- **HTTP Client:** Axios (với interceptors xử lý Token Sanctum)
- **Xác thực:** Laravel Sanctum & Google OAuth 2.0

## Cấu trúc thư mục mô tả

```text
frontend/
├── public/              # Tài nguyên tĩnh (favicon, logo, icons)
├── src/
│   ├── assets/          # Hình ảnh, global CSS/SCSS
│   ├── components/      # Các component dùng chung
│   │   ├── common/      # Button, Input, Modal, Table (Reusable)
│   │   ├── layout/      # Header, Footer, Sidebar (User & Admin)
│   │   └── product/     # ProductCard, ProductFilter
│   ├── services/        # Lớp giao tiếp API (Axios instance)
│   │   ├── auth.service.js      # Login, Register, Google Auth
│   │   ├── product.service.js   # CRUD Product, Low Stock
│   │   ├── order.service.js     # Checkout, Order History, Coupon
│   │   └── admin.service.js     # Dashboard stats, User management
│   ├── stores/          # Quản lý trạng thái Pinia (auth, cart, product)
│   ├── views/           # Các trang (Pages)
│   │   ├── auth/        # Login, Register
│   │   ├── user/        # Home, Detail, Cart, Checkout, Profile, My Orders
│   │   └── admin/       # Dashboard, Manage Products, Orders, Coupons, Users
│   ├── router/          # Cấu hình Vue Router (Guards cho Admin/User)
│   ├── utils/           # Helper functions (formatCurrency, formatDate)
│   ├── App.vue          # Component gốc
│   └── main.js          # Điểm khởi chạy ứng dụng & Cấu hình Google Auth
├── .env                 # Biến môi trường (API URL, Client ID)
├── package.json         # Danh sách thư viện phụ thuộc
└── vite.config.js       # Cấu hình Vite
```

## Tính năng chính (Đã khớp với Backend)

### 👤 Phân hệ Người dùng (Customer)
- **Trang chủ & Cửa hàng:** Hiển thị sản phẩm mới nhất, lọc theo danh mục, tìm kiếm (ILIKE).
- **Giỏ hàng & Khuyến mãi:** Tích hợp kiểm tra mã giảm giá (`/api/check-coupon`) trước khi đặt hàng.
- **Đặt hàng (Checkout):** Quy trình thanh toán lưu thông tin khách hàng và chi tiết sản phẩm.
- **Xác thực:** 
    - Đăng ký/Đăng nhập chuẩn Laravel.
    - **Google Login:** Tích hợp lấy `credential` gửi về `/api/auth/google`.
- **Cá nhân:** Xem lịch sử đơn hàng, chi tiết đơn hàng và cập nhật profile/mật khẩu.

### Phân hệ Quản trị (Admin)
- **Dashboard:** Thống kê doanh thu và đơn hàng qua `DashboardController`.
- **Quản lý Sản phẩm:** 
    - Thêm/Sửa sản phẩm với hình ảnh (sử dụng `FormData` để gửi JSON `product` và file `image`).
    - Theo dõi sản phẩm sắp hết hàng (Low stock).
- **Quản lý Đơn hàng:** Cập nhật trạng thái (Pending, Processing, Delivered, Cancelled).
- **Quản lý Khuyến mãi:** Tạo và quản lý mã giảm giá theo % hoặc số tiền cố định.
- **Quản lý Người dùng:** Khóa/Mở khóa tài khoản người dùng và phân quyền.

## Cài đặt và Chạy dự án

1. **Cài đặt thư viện:**
   ```bash
   npm install
   ```

2. **Cấu hình môi trường:**
   Tạo file `.env` dựa trên cấu hình Backend:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api
   VITE_GOOGLE_CLIENT_ID=your_google_id.apps.googleusercontent.com
   ```

3. **Chạy ở chế độ phát triển:**
   ```bash
   npm run dev
   ```

4. **Build cho môi trường thực tế:**
   ```bash
   npm run build
   ```

## Lưu ý kỹ thuật cho Dev

- **Lưu trữ Token:** Token được lưu trong `localStorage` và tự động đính kèm vào Header qua Axios Interceptor.
- **Xử lý Ảnh:** Backend trả về URL qua `asset('storage/...')`, Frontend cần hiển thị chính xác các đường dẫn này.
- **Cập nhật Sản phẩm:** Khi cập nhật sản phẩm ở Admin, hãy lưu ý Backend sử dụng `json_decode` cho field `product` trong request.

---
