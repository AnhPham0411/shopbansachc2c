# 🧑‍💻 Ngữ cảnh dự án: Libris Bookstore (C2C)

## 1. Thông tin chung
- **Tên:** Libris – Sàn mua bán sách cũ C2C (Customer-to-Customer)
- **Mô hình:** Thu phí hoa hồng 10% / giao dịch thành công, thanh toán trung gian (Escrow)
- **Stack:**
  - Frontend + Backend: **Next.js 16** (App Router) + **TypeScript**
  - Database: **MySQL** (XAMPP, port 3306) + **Prisma ORM 6.2**
  - Auth: **NextAuth v5** — dùng `auth()` từ `@/lib/auth`, KHÔNG dùng `getServerSession()`
  - Styling: **Tailwind CSS v4** + **Framer Motion** + **Lucide React**
  - Email OTP: **Nodemailer** + Gmail SMTP App Password (16 ký tự)
  - Tiền: lưu `DECIMAL(15,2)`, dùng `Decimal` từ `@prisma/client/runtime/library`
  - Route protection: `src/proxy.ts` — middleware NextAuth bảo vệ route theo role

---

## 2. Cấu trúc thư mục thực tế

```
src/
├── proxy.ts                       # Middleware bảo vệ route (NextAuth Edge Auth)
│                                  # Roles: isPublicRoute / seller (logged-in) / admin (ADMIN role)
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/       # Gửi OTP 6 số qua Gmail, hết hạn 1 giờ
│   │   └── reset-password/        # Nhập OTP + mật khẩu mới
│   │
│   ├── admin/
│   │   ├── layout.tsx             # Layout admin có AdminSidebar
│   │   ├── dashboard/             # Thống kê tổng quan hệ thống
│   │   ├── books/                 # Quản lý toàn bộ sách trên sàn
│   │   ├── chat/                  # Xem chat giữa users
│   │   ├── disputes/              # Phán quyết tranh chấp (Arbitration)
│   │   ├── finance/               # Duyệt lệnh rút tiền thủ công
│   │   ├── orders/                # Quản lý tất cả đơn hàng
│   │   ├── reviews/               # Quản lý đánh giá
│   │   ├── settings/              # Cài đặt hệ thống
│   │   ├── users/                 # Quản lý tài khoản user
│   │   └── vouchers/              # Tạo & quản lý mã giảm giá
│   │
│   ├── seller/
│   │   ├── layout.tsx             # Layout seller có SidebarNav
│   │   ├── SidebarNav.tsx         # Sidebar điều hướng seller
│   │   ├── page.tsx               # Dashboard tổng quan seller
│   │   ├── books/                 # Đăng / sửa / xóa sách
│   │   ├── offers/                # Quản lý đề nghị thương lượng từ buyer
│   │   ├── orders/                # Quản lý đơn: PENDING→CONFIRMED→PACKED→SHIPPING
│   │   ├── settings/
│   │   │   └── actions.ts         # Server Actions cài đặt seller (bank info, profile)
│   │   └── wallet/                # Ví điện tử, lịch sử giao dịch, rút tiền
│   │
│   ├── buyer/
│   │   ├── favorites/             # Danh sách yêu thích (Wishlist)
│   │   └── orders/                # Lịch sử mua, bấm "Đã nhận hàng", mở Dispute, hủy đơn
│   │
│   ├── books/                     # Public — không cần đăng nhập
│   │   └── [id]/
│   │       └── BookTabs.tsx       # Tab: Mô tả | Đánh giá | Thương lượng giá
│   │
│   ├── cart/                      # Giỏ hàng đa shop (Multi-shop Cart, localStorage)
│   ├── checkout/                  # Thanh toán: VNPay / MoMo / COD
│   ├── chat/
│   │   ├── page.tsx               # Server component wrapper
│   │   └── ChatClient.tsx         # Client component giao diện chat realtime
│   ├── collections/               # Bộ sưu tập / Wishlist
│   ├── notifications/             # Thông báo của user
│   │
│   └── api/
│       ├── auth/[...nextauth]/    # NextAuth handler (GET + POST)
│       ├── chat/                  # GET lấy messages, POST gửi tin nhắn
│       ├── checkout/              # POST tạo MasterOrder + SubOrders + Escrow
│       ├── payment/               # Callback VNPay / MoMo sau thanh toán
│       ├── proxy-image/           # Proxy ảnh ngoài tránh CORS / block
│       └── update-stock/          # Cập nhật stockQuantity sách
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx             # Thanh điều hướng chính (giỏ hàng, avatar, thông báo)
│   │   ├── NotificationBell.tsx   # Chuông thông báo realtime
│   │   └── LogoutButton.tsx       # Nút đăng xuất
│   ├── admin/
│   │   └── AdminSidebar.tsx       # Sidebar admin
│   ├── books/
│   │   ├── BookCard.tsx           # Card hiển thị sách (dùng ở nhiều trang)
│   │   ├── BookCatalog.tsx        # Danh sách + lọc + tìm kiếm sách
│   │   ├── OfferDialog.tsx        # Dialog gửi đề nghị thương lượng giá
│   │   └── PrivateNoteBox.tsx     # Ghi chú riêng tư của buyer về sách
│   ├── home/                      # Components trang chủ
│   └── providers/                 # Context providers (SessionProvider, Toaster...)
│
├── lib/
│   ├── prisma.ts                  # Prisma Client singleton (global cache dev-safe)
│   ├── auth.ts                    # NextAuth v5 config, export `auth()`
│   ├── auth.config.ts             # Providers, callbacks, session strategy
│   ├── auth-utils.ts              # Helper kiểm tra role, session
│   ├── auth-actions.ts            # requestPasswordReset(), resetPassword()
│   ├── cart.ts                    # Helper quản lý giỏ hàng (localStorage)
│   ├── dispute-actions.ts         # createDispute, sellerReply, adminResolve
│   ├── favorite-actions.ts        # toggleFavorite, getFavorites
│   ├── finance-actions.ts         # requestWithdrawal (Seller), approveWithdrawal (Admin)
│   ├── mail.ts                    # sendOTPByEmail() — Nodemailer + Gmail SMTP
│   ├── note-actions.ts            # saveNote, getNote (PrivateNote)
│   ├── notification-actions.ts    # createNotification, markAsRead, markAllRead
│   ├── offer-actions.ts           # sendOffer, acceptOffer, rejectOffer, expireOffer
│   ├── order-actions.ts           # completeOrder, confirmOrder, packOrder,
│   │                              #   updateTrackingCode, cancelOrder, updateOrderStatus
│   ├── review-actions.ts          # createReview, replyReview
│   ├── utils.ts                   # Tiện ích chung (formatCurrency, formatDate...)
│   └── voucher-actions.ts         # createVoucher, applyVoucher, deactivateVoucher
│
└── scripts/                       # Script chạy thủ công (ts-node)
    ├── find-missing-images.ts     # Tìm sách thiếu ảnh trong DB
    └── fix-all-images.ts          # Batch cập nhật URL ảnh hàng loạt
```

---

## 3. Middleware bảo vệ route (`src/proxy.ts`)

```typescript
// File: src/proxy.ts
// Đây là NextAuth Edge middleware, KHÔNG import Prisma ở đây

export const proxy = auth((req) => {
  // Public routes (không cần đăng nhập):
  // "/", "/login", "/register", "/cart", "/forgot-password", "/reset-password", "/books/*"

  // Seller routes: cần đăng nhập (bất kỳ role)
  // Admin routes: cần role === "ADMIN"
  // Redirect về "/" nếu không đủ quyền
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

---

## 4. Database Schema đầy đủ (Prisma + MySQL)

### Enums
```prisma
enum Role              { ADMIN | USER }
enum BookCondition     { NEW_100 | LIKE_NEW | GOOD | OLD }
enum BookCategory      { LITERATURE | CHILDRENS | COMICS | TEXTBOOK | ECONOMY | SKILLS | OTHERS }
enum PaymentMethod     { VNPAY | MOMO | COD }
enum PaymentStatus     { PENDING | PAID | FAILED }
enum OrderStatus       { PENDING | CONFIRMED | PACKED | SHIPPING | DELIVERED | COMPLETED | DISPUTED | REFUNDED }
enum DisputeStatus     { PENDING_SELLER | PENDING_ADMIN | RESOLVED_REFUND | RESOLVED_PAY_SELLER | CLOSED }
enum TransactionType   { IN_ESCROW | ESCROW_RELEASE | DEDUCT_FEE | WITHDRAW_PENDING | WITHDRAW_SUCCESS | DIRECT_SALE | REFUND }
enum DiscountType      { PERCENTAGE | FIXED_AMOUNT }
enum Rank              { BRONZE | SILVER | GOLD | PLATINUM }
enum NotificationType  { INFO | ORDER | OFFER | PRICE_DROP | SYSTEM }
enum OfferStatus       { PENDING | ACCEPTED | REJECTED | EXPIRED }
```

### Users & Auth
```prisma
model User {
  id              String    @id @default(uuid())
  role            Role      @default(USER)     # ADMIN | USER
  name            String
  email           String    @unique
  passwordHash    String
  bankAccountInfo String?
  address         String?
  phoneNumber     String?
  points          Int       @default(0)        # Tích điểm: floor(subTotal / 1000) mỗi đơn
  rank            Rank      @default(BRONZE)
  isVerified      Boolean   @default(false)
  verificationDocs String?  @db.Text
  referralCode    String?   @unique
  referredById    String?
  resetToken      String?   @unique            # OTP 6 số quên mật khẩu
  resetTokenExpiry DateTime?                   # Hết hạn 1 giờ
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  # Relations: books, masterOrders, subOrders, wallets,
  #            buyerConversations, sellerConversations,
  #            notifications, offersMade, offersReceived,
  #            bundles, referrals, favorites, reviewReplies, privateNotes
}
```

### Books
```prisma
model Book {
  id            String
  sellerId      String
  title         String
  price         Decimal       @db.Decimal(15, 2)
  stockQuantity Int           @default(1)
  condition     BookCondition @default(GOOD)
  category      BookCategory  @default(OTHERS)
  author        String?
  description   String?       @db.Text
  imageUrl      String?       @db.Text
  isbn          String?
  # Relations: orderItems, reviews, conversations, favorites,
  #            priceHistory, offers, bundleItems
}
```

### Orders — Tách đơn đa shop
```prisma
model MasterOrder {
  # Đơn hàng tổng — 1 lần quẹt thẻ duy nhất
  id              String
  buyerId         String
  totalPayment    Decimal       @db.Decimal(15, 2)   # Tổng tiền thực tế quẹt
  paymentMethod   PaymentMethod
  paymentStatus   PaymentStatus @default(PENDING)
  transactionId   String?       # Mã giao dịch từ VNPay/MoMo
  discountAmount  Decimal       @default(0.00)
  voucherId       String?       # FK → Voucher (nullable)
  shippingAddress String?
  shippingName    String?
  shippingPhone   String?
  subOrders       SubOrder[]
}

model SubOrder {
  # Đơn hàng con — 1 SubOrder = 1 Seller
  id            String
  masterOrderId String
  sellerId      String
  subTotal      Decimal     @db.Decimal(15, 2)   # Tổng tiền sách của shop này
  platformFee   Decimal     @db.Decimal(15, 2)   # 10% phí sàn (lưu bằng VNĐ cụ thể)
  netAmount     Decimal     @db.Decimal(15, 2)   # 90% Seller nhận = subTotal - platformFee
  trackingCode  String?     # Mã vận đơn (GHTK, GHN, Viettel Post...)
  status        OrderStatus @default(PENDING)
  orderItems    OrderItem[]
  dispute       Dispute?
  review        Review?
  walletTransactions WalletTransaction[]
}

model OrderItem {
  subOrderId      String
  bookId          String
  quantity        Int
  priceAtPurchase Decimal   @db.Decimal(15, 2)   # LƯU CỨNG giá lúc mua
}
```

### Ví điện tử & Sổ cái (Ledger)
```prisma
model Wallet {
  userId           String   @unique   # 1 User = 1 Wallet
  availableBalance Decimal  @db.Decimal(15, 2)   # Tiền có thể dùng / rút
  escrowBalance    Decimal  @db.Decimal(15, 2)   # Tiền bị giam chờ giao hàng
}

# ⚠️ LUẬT VÀNG: Bảng này CHỈ INSERT — TUYỆT ĐỐI KHÔNG UPDATE / DELETE
model WalletTransaction {
  walletId            String
  referenceSubOrderId String?       # FK → SubOrder (nullable)
  type                TransactionType
  # IN_ESCROW:        Tiền buyer vào escrow Admin khi thanh toán
  # ESCROW_RELEASE:   Giải ngân 90% cho Seller khi đơn COMPLETED
  # DEDUCT_FEE:       Thu 10% phí sàn vào Admin
  # WITHDRAW_PENDING: Seller yêu cầu rút (trừ available tạm thời)
  # WITHDRAW_SUCCESS: Admin đã chuyển khoản thật → chốt vĩnh viễn
  # DIRECT_SALE:      Admin bán sách (không qua escrow)
  # REFUND:           Hoàn tiền 100% cho Buyer khi hủy/tranh chấp thắng
  amount              Decimal       @db.Decimal(15, 2)   # Dương = cộng, Âm = trừ
  description         String?
}
```

### Chat
```prisma
model Conversation {
  buyerId     String
  sellerId    String
  bookId      String?   # Conversation gắn với sách cụ thể (nullable)
  lastMessage String?   @db.Text
  lastMsgAt   DateTime
  messages    Message[]
  @@unique([buyerId, sellerId, bookId])
}

model Message {
  conversationId String
  senderId       String
  content        String  @db.Text
  isRead         Boolean @default(false)
}
```

### Tính năng nâng cao
```prisma
model Dispute {
  subOrderId  String        @unique
  reason      String
  description String        @db.Text
  images      String?       @db.Text   # JSON array URL ảnh bằng chứng
  status      DisputeStatus @default(PENDING_SELLER)
  sellerReply String?       @db.Text
}

model Review {
  # Chỉ tạo được khi SubOrder.status = COMPLETED
  subOrderId String  @unique
  bookId     String
  rating     Int               # 1–5 sao
  comment    String?
  replies    ReviewReply[]
}

model Offer {
  buyerId   String
  sellerId  String
  bookId    String
  amount    Decimal   @db.Decimal(15, 2)   # Giá đề xuất của buyer
  status    OfferStatus @default(PENDING)
  message   String?   @db.Text
}

model Voucher {
  code           String        @unique
  discountType   DiscountType  @default(PERCENTAGE)
  discountValue  Decimal       @db.Decimal(15, 2)
  minOrderAmount Decimal       @default(0.00)
  maxDiscount    Decimal?      @db.Decimal(15, 2)
  expiryDate     DateTime?
  usageLimit     Int           @default(100)
  usedCount      Int           @default(0)
  isActive       Boolean       @default(true)
  minRank        Rank          @default(BRONZE)   # Rank tối thiểu để dùng
}

model Notification {
  userId    String
  title     String
  message   String   @db.Text
  type      NotificationType @default(INFO)
  isRead    Boolean  @default(false)
  link      String?  # URL điều hướng khi click thông báo
}

# Các model phụ:
model Favorite      # Buyer lưu sách yêu thích; @@unique([userId, bookId])
model PriceHistory  # Lịch sử thay đổi giá sách (tự động ghi khi seller sửa giá)
model Bundle        # Gói sách combo (Seller tạo, discountPercentage)
model BundleItem    # Sách trong gói combo; @@unique([bundleId, bookId])
model PrivateNote   # Ghi chú riêng tư buyer về 1 sách; @@unique([userId, bookId])
```

---

## 5. Server Actions (src/lib/)

| File | Chức năng chính |
|------|----------------|
| `auth-actions.ts` | `requestPasswordReset()`, `resetPassword()` |
| `order-actions.ts` | `completeOrder`, `confirmOrder`, `packOrder`, `updateTrackingCode`, `cancelOrder`, `updateOrderStatus` |
| `finance-actions.ts` | `requestWithdrawal` (Seller), `approveWithdrawal` (Admin) |
| `dispute-actions.ts` | `createDispute`, `sellerReply`, `adminResolve` (RESOLVED_REFUND / RESOLVED_PAY_SELLER) |
| `offer-actions.ts` | `sendOffer`, `acceptOffer`, `rejectOffer`, `expireOffer` |
| `voucher-actions.ts` | `createVoucher`, `applyVoucher`, `deactivateVoucher` |
| `review-actions.ts` | `createReview`, `replyReview` |
| `favorite-actions.ts` | `toggleFavorite`, `getFavorites` |
| `note-actions.ts` | `saveNote`, `getNote` |
| `notification-actions.ts` | `createNotification`, `markAsRead`, `markAllRead` |
| `seller/settings/actions.ts` | Cập nhật profile, bank info |

---

## 6. API Routes (src/app/api/)

| Route | Method | Mục đích |
|-------|--------|----------|
| `/api/auth/[...nextauth]` | GET, POST | NextAuth handler |
| `/api/chat` | GET, POST | Lấy/gửi tin nhắn |
| `/api/checkout` | POST | Tạo MasterOrder + SubOrders + Escrow |
| `/api/payment` | POST | Callback VNPay / MoMo |
| `/api/proxy-image` | GET | Proxy ảnh ngoài (tránh CORS/block) |
| `/api/update-stock` | POST | Cập nhật stockQuantity sách |

---

## 7. Business Logic đầy đủ

### Luồng Escrow (Thanh toán trung gian)
```
Buyer quẹt thẻ (VNPay/MoMo/COD):
  → MasterOrder.paymentStatus = PAID
  → SubOrder.status = PENDING
  → Admin.wallet.escrowBalance += subTotal  (tiền đóng băng trong escrow)
  → WalletTransaction INSERT type=IN_ESCROW

Seller xử lý đơn:
  PENDING → CONFIRMED → PACKED → nhập trackingCode → SHIPPING → DELIVERED

Buyer bấm "Đã nhận hàng" HOẶC Auto-Complete sau 7 ngày từ DELIVERED:
  → SubOrder.status = COMPLETED
  → prisma.$transaction([
      Seller.wallet.availableBalance += netAmount (90%),
      Admin.wallet.escrowBalance -= subTotal,
      WalletTransaction INSERT type=ESCROW_RELEASE (Seller),
      WalletTransaction INSERT type=DEDUCT_FEE (Admin giữ 10%),
      Buyer.points += floor(subTotal / 1000),  // Tích điểm
      Cập nhật Buyer.rank theo mốc điểm,       // Rank up nếu đủ điểm
    ])
```

### Mốc tích điểm & xếp hạng
| Rank | Điểm tối thiểu |
|------|----------------|
| BRONZE | 0 |
| SILVER | 1.000 |
| GOLD | 5.000 |
| PLATINUM | 10.000 |

### Luồng hủy đơn & hoàn tiền (ACID Transaction)
```
cancelOrder():
  → SubOrder.status = REFUNDED
  → Admin.wallet.escrowBalance -= subTotal
  → Buyer.wallet.availableBalance += subTotal  (hoàn 100%)
  → WalletTransaction INSERT type=REFUND (Buyer)
  → Khôi phục stockQuantity cho từng OrderItem
  ⚠️ Chỉ hủy được khi status < SHIPPING (chưa có tracking)
```

### Luồng rút tiền (Cash-out)
```
Seller tạo lệnh rút:
  → Kiểm tra availableBalance >= amount
  → availableBalance -= amount  (giữ tạm, KHÔNG xóa)
  → WalletTransaction INSERT type=WITHDRAW_PENDING

Admin duyệt (chuyển khoản thật bên ngoài hệ thống):
  → Bấm "Đã chuyển" → WalletTransaction INSERT type=WITHDRAW_SUCCESS
  ⚠️ TUYỆT ĐỐI KHÔNG tự động hoá bước chuyển khoản thật ra ngân hàng
```

### Luồng tranh chấp (Dispute)
```
Buyer mở Dispute (trong vòng 3 ngày từ DELIVERED):
  → SubOrder.status = DISPUTED
  → Tiền bị khóa cứng, Auto-Complete 7 ngày bị ngắt
  → Buyer upload ảnh/video bằng chứng

Seller phản hồi → Admin xem xét → Phán quyết:
  → RESOLVED_REFUND:      Hoàn 100% cho Buyer (buyer thắng)
  → RESOLVED_PAY_SELLER:  Giải ngân 90% cho Seller (seller thắng)
```

---

## 8. Luật kỹ thuật bắt buộc

- ✅ Tiền lưu `DECIMAL(15,2)`, dùng `Decimal` từ `@prisma/client/runtime/library`
- ✅ KHÔNG dùng `FLOAT` / `DOUBLE` cho tiền bao giờ
- ✅ Mọi thao tác ví dùng `prisma.$transaction(async (tx) => {...})` — ACID
- ✅ `WalletTransaction` chỉ **INSERT**, KHÔNG UPDATE/DELETE bao giờ
- ✅ Chặn idempotency: Kiểm tra `status === 'COMPLETED'` trước khi giải ngân
- ✅ Server Actions: `"use server"` ở đầu **file** (không phải đầu function)
- ✅ Auth: `const session = await auth()` — import `auth` từ `@/lib/auth` (NextAuth v5)
- ✅ Sau mỗi mutation: gọi `revalidatePath(...)` để cập nhật UI
- ✅ Giá sách lưu vào `OrderItem.priceAtPurchase`, **KHÔNG** đọc `Book.price` lại
- ✅ Middleware (`proxy.ts`): KHÔNG import Prisma hoặc bcrypt — chỉ dùng NextAuth Edge
- ✅ App Router: KHÔNG dùng Pages Router, KHÔNG dùng `getServerSession`

---

## 9. Biến môi trường (.env)

```env
DATABASE_URL="mysql://root:@127.0.0.1:3306/bookstore_db"
AUTH_SECRET="your-random-secret"
NEXTAUTH_URL="http://localhost:3000"
AUTH_URL="http://localhost:3000/api/auth"
GMAIL_USER="your-email@gmail.com"
GMAIL_APP_PASSWORD="xxxx xxxx xxxx xxxx"   # App Password 16 ký tự từ Google Account
```

---

## 10. Lệnh CLI thường dùng

```bash
npm run dev              # Dev server tại localhost:3000
npx prisma db push       # Đồng bộ schema.prisma → MySQL
npx prisma db seed       # Seed dữ liệu mẫu
npx prisma studio        # GUI xem/sửa DB tại localhost:5555
npx prisma generate      # Regenerate Prisma Client sau khi sửa schema
npm run build            # Build production
```

---

## 11. Tài khoản mẫu (sau `npx prisma db seed`)

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@libris.com` | `admin123` |
| Seller/Buyer | `tuan@gmail.com` | `123456` |

---

## 12. Yêu cầu của tôi

> **[VIẾT YÊU CẦU CỦA BẠN VÀO ĐÂY]**

**File liên quan:** _(ví dụ: `src/lib/order-actions.ts`, `src/app/seller/wallet/page.tsx`)_

**Lỗi gặp phải:** _(paste stack trace vào đây nếu có)_

---

> ⚠️ **Lưu ý quan trọng cho AI:**
> - Dự án dùng **Next.js App Router** — KHÔNG phải Pages Router
> - Server Actions: directive `"use server"` ở đầu file
> - Auth: `const session = await auth()` — NextAuth **v5**, import từ `@/lib/auth`
> - API Routes nằm trong `src/app/api/`, dùng `export async function GET/POST(req: Request)`
> - Tailwind CSS **v4** (cú pháp có thể khác v3, hạn chế dùng `@apply` phức tạp)
> - Prisma: import `{ prisma }` từ `@/lib/prisma`, dùng `tx` bên trong `$transaction`
> - Middleware `proxy.ts`: Edge Runtime — KHÔNG import Prisma, bcrypt, hay Node.js modules
