# 🥐 MaiKery — Tiệm Bánh Nhà Làm

![MaiKery Banner](file:///Users/admin/Documents/maikery/public/maikery_banner.png)

Chào mừng bạn đến với **MaiKery**, nền tảng thương mại điện tử hiện đại dành cho tiệm bánh ngọt. Dự án được xây dựng với mục tiêu mang lại trải nghiệm mua sắm mượt mà, sang trọng và đậm chất "nhà làm".

## 🚀 Tính Năng Chính

### 🛍️ Dành cho Khách hàng
- **Cửa hàng trực tuyến:** Duyệt danh mục bánh đa dạng với hình ảnh chất lượng cao.
- **Giỏ hàng thông minh:** Thêm, xóa, cập nhật số lượng dễ dàng.
- **Thanh toán nhanh:** Hỗ trợ mã giảm giá và thông tin giao hàng.
- **Hóa đơn VietQR:** Tự động tạo mã QR thanh toán qua ngân hàng (VietQR) chuẩn xác cho từng đơn hàng.
- **Quản lý tài khoản:** Xem lịch sử mua hàng và thông tin cá nhân.

### ⚙️ Dành cho Admin (Quản trị)
- **Dashboard tổng quan:** Theo dõi doanh thu, số đơn hàng và tình trạng giao hàng.
- **Quản lý sản phẩm:** Thêm mới, chỉnh sửa, ẩn/hiện sản phẩm.
- **Quản lý đơn hàng:** Cập nhật trạng thái thanh toán và vận chuyển.
- **Mã giảm giá:** Tạo mã giảm giá tự động.
- **Cấu hình hệ thống:** Thiết lập thông tin ngân hàng để nhận thanh toán QR.

## 🛠️ Công Nghệ Sử Dụng

- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion.
- **Backend:** Next.js API Routes.
- **Database:** PostgreSQL (Supabase/Neon).
- **ORM:** Prisma.
- **Authentication:** NextAuth.js.
- **QR Code:** VietQR API integration.

## 📦 Hướng Dẫn Cài Đặt

### 1. Clone dự án
```bash
git clone <repository-url>
cd maikery
```

### 2. Cài đặt dependency
```bash
npm install
```

### 3. Cấu hình biến môi trường
Tạo file `.env.local` và điền các thông tin sau:
```env
DATABASE_URL="your-postgresql-url"
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Khởi tạo Database
```bash
npx prisma migrate dev
```

### 5. Chạy dự án
```bash
npm run dev
```

## 🔐 Tài khoản dùng thử

| Vai trò | Email | Mật khẩu |
|---|---|---|
| **Admin** | `admin@maikery.vn` | `admin123` |
| **Khách hàng** | `customer@maikery.vn` | `password123` |

---
Thiết kế và phát triển bởi Antigravity.
