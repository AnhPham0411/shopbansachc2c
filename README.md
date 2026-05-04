# 📚 Libris Bookstore – Hệ thống trao đổi sách C2C

Nền tảng mua bán sách cũ trực tuyến theo mô hình C2C (Customer-to-Customer), được xây dựng bằng **Next.js 16**, **Prisma ORM**, **MySQL** và **NextAuth v5**.

---

## 🧰 Yêu cầu hệ thống

Trước khi bắt đầu, hãy đảm bảo máy tính đã cài đặt:

| Công cụ | Phiên bản tối thiểu | Tải về |
|---------|-------------------|--------|
| **Node.js** | v18.x trở lên | [nodejs.org](https://nodejs.org) |
| **npm** | v9.x trở lên | (đi kèm Node.js) |
| **XAMPP** (MySQL) | 3.3.0 trở lên | [apachefriends.org](https://www.apachefriends.org) |
| **Git** | Bất kỳ | [git-scm.com](https://git-scm.com) |

---

## 🚀 Hướng dẫn cài đặt và chạy dự án

### Bước 1 – Clone dự án về máy

```bash
git clone https://github.com/AnhPham0411/shopbansachc2c.git
cd shopbansachc2c
```

---

### Bước 2 – Cài đặt các thư viện

```bash
npm install
```

> Lệnh này sẽ tự động cài tất cả dependencies trong `package.json` (Next.js, Prisma, NextAuth, Nodemailer, v.v.)

---

### Bước 3 – Khởi động MySQL với XAMPP

1. Mở **XAMPP Control Panel**
2. Nhấn **Start** tại dòng **Apache** và **MySQL**
3. Mở trình duyệt, truy cập: `http://localhost/phpmyadmin`
4. Tạo database mới tên **`bookstore_db`**:
   - Nhấn **New** ở cột trái
   - Nhập tên: `bookstore_db`
   - Chọn **Collation**: `utf8mb4_unicode_ci`
   - Nhấn **Create**

---

### Bước 4 – Tạo file cấu hình môi trường

Tạo file `.env` tại thư mục gốc của dự án với nội dung sau:

```env
# Kết nối MySQL (XAMPP mặc định: user=root, không có password)
DATABASE_URL="mysql://root:@127.0.0.1:3306/bookstore_db"

# Bảo mật cho NextAuth (có thể dùng bất kỳ chuỗi ngẫu nhiên nào)
AUTH_SECRET="your-super-secret-random-string-here"
NEXTAUTH_URL="http://localhost:3000"
AUTH_URL="http://localhost:3000/api/auth"

# Gmail để gửi OTP khôi phục mật khẩu
GMAIL_USER="your-email@gmail.com"
GMAIL_APP_PASSWORD="xxxx xxxx xxxx xxxx"
```

> **Lưu ý về `GMAIL_APP_PASSWORD`:**
> Đây **không phải** mật khẩu Gmail thông thường. Cần tạo **App Password** riêng:
> 1. Vào [myaccount.google.com/security](https://myaccount.google.com/security)
> 2. Bật **Xác minh 2 bước**
> 3. Tìm **App passwords** → Tạo mật khẩu cho **Mail**
> 4. Copy 16 ký tự được cấp và dán vào `.env`

---

### Bước 5 – Khởi tạo cơ sở dữ liệu

**5a. Đẩy schema lên MySQL** (tạo toàn bộ bảng):

```bash
npx prisma db push
```

**5b. Seed dữ liệu mẫu** (tài khoản admin, sách mẫu, v.v.):

```bash
npx prisma db seed
```

> Sau khi seed xong, bạn có thể đăng nhập bằng tài khoản:
> - **Admin:** `admin@libris.com` / `admin123`
> - **User mẫu:** `tuan@gmail.com` / `123456`

---

### Bước 6 – Chạy ứng dụng

```bash
npm run dev
```

Mở trình duyệt và truy cập: **[http://localhost:3000](http://localhost:3000)**

---

## 📁 Cấu trúc thư mục chính

```
shopbansachc2c/
├── prisma/
│   ├── schema.prisma       # Định nghĩa cấu trúc database
│   └── seed.ts             # Dữ liệu mẫu khởi tạo
├── src/
│   ├── app/
│   │   ├── (auth)/         # Trang đăng nhập, đăng ký, quên mật khẩu
│   │   ├── admin/          # Trang quản trị hệ thống
│   │   ├── seller/         # Dashboard người bán
│   │   ├── buyer/          # Trang người mua
│   │   ├── books/          # Danh sách & chi tiết sách
│   │   ├── cart/           # Giỏ hàng
│   │   ├── checkout/       # Thanh toán
│   │   └── api/            # API Routes
│   ├── components/         # Các component dùng chung
│   └── lib/                # Utilities, Prisma client, mail, actions
├── .env                    # Biến môi trường (KHÔNG commit lên Git)
└── package.json
```

---

## ✨ Tính năng chính

- 🔐 **Xác thực:** Đăng ký / Đăng nhập / Quên mật khẩu (gửi OTP qua Gmail)
- 📚 **Sách:** Đăng bán, tìm kiếm, lọc theo danh mục, trạng thái sách
- 🛒 **Mua hàng:** Giỏ hàng, thanh toán COD / VNPay / MoMo
- 💬 **Chat:** Nhắn tin thời gian thực giữa người mua và người bán
- 💰 **Ví điện tử:** Quản lý số dư, rút tiền
- 🏷️ **Đặt giá:** Người mua có thể thương lượng giá với người bán
- ⭐ **Đánh giá:** Review sau khi mua hàng
- 🔔 **Thông báo:** Hệ thống thông báo realtime
- 🎫 **Voucher:** Mã giảm giá theo hạng thành viên
- 👑 **Admin:** Quản lý người dùng, đơn hàng, tranh chấp

---

## 🛠️ Các lệnh hữu ích

```bash
# Chạy môi trường phát triển
npm run dev

# Mở Prisma Studio (xem/sửa dữ liệu trực quan)
npx prisma studio

# Cập nhật lại database khi sửa schema
npx prisma db push

# Seed lại dữ liệu mẫu
npx prisma db seed

# Build production
npm run build
npm run start
```

---

## ❓ Xử lý lỗi thường gặp

| Lỗi | Nguyên nhân | Cách xử lý |
|-----|-------------|------------|
| `Can't connect to database` | MySQL chưa chạy | Mở XAMPP → Start MySQL |
| `Database bookstore_db not found` | Chưa tạo DB | Tạo DB trong phpMyAdmin |
| `Module not found` | Chưa cài dependencies | Chạy `npm install` |
| `Invalid login` khi gửi OTP | App Password sai | Tạo lại App Password Gmail |
| Port 3000 bị chiếm | Ứng dụng khác đang dùng | Chạy `npm run dev -- -p 3001` |

---

## 📄 Công nghệ sử dụng

- **Framework:** Next.js 16 (App Router)
- **Database:** MySQL + Prisma ORM 6.2
- **Authentication:** NextAuth v5
- **Styling:** Tailwind CSS v4
- **Animation:** Framer Motion
- **Email:** Nodemailer + Gmail SMTP
- **UI Icons:** Lucide React
