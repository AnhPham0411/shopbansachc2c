MASTER PRODUCT PLAN: SÀN TMĐT MUA BÁN SÁCH C2C
1. TỔNG QUAN DỰ ÁN (PROJECT BRIEF)
Tên sản phẩm: Nền tảng mua bán sách C2C có hỗ trợ thanh toán trung gian.

Định vị lĩnh vực: Thương mại điện tử (eCommerce), Hậu cần (Logistics) và Phần mềm doanh nghiệp.

Nguồn lực dự kiến: 12 giờ làm việc/tuần/nhân sự.

Thời gian ra mắt (Time-to-market): 17 Tuần.

2. BÀI TOÁN & TẦM NHÌN SẢN PHẨM (PROBLEM & VISION)
(Được trích xuất khắt khe từ Mục 3.1 & 3.5 của tài liệu)

Vấn đề (Pain-points): Nhu cầu trao đổi sách cũ/mới để thúc đẩy kinh tế tuần hoàn là rất lớn, nhưng giao dịch cá nhân nhỏ lẻ (C2C) trên mạng đối diện rủi ro lừa đảo cực cao (chuyển tiền không giao hàng). Các cá nhân bán nhỏ lẻ không có bộ công cụ quản lý bán hàng minh bạch.

Giải pháp (Solution): Đưa cơ chế Thanh toán trung gian (Escrow) vào cốt lõi hệ thống. Hệ thống sẽ đóng vai trò giữ tiền của người mua, và chỉ giải ngân cho người bán khi người mua nhận được hàng.

Mô hình lợi nhuận: Nền tảng tự động hóa quy trình thu phí hoa hồng cố định 10% trên mỗi giao dịch thành công. Người bán nhận 90% doanh thu chiết khấu trực tiếp vào ví hệ thống.

3. KIẾN TRÚC CÔNG NGHỆ (TECH STACK - DEMO LOCAL)
(Đã chốt cấu trúc tối ưu cho việc chạy demo máy cục bộ):

Frontend & Backend: Next.js 16+ (App Router).
- Ngôn ngữ: TypeScript.
- Styling: Tailwind CSS.

Database (Cơ sở dữ liệu): MySQL.
- ORM: Prisma (Quản lý schema và truy vấn dữ liệu).
- Công cụ quản lý: Prisma Studio (Dùng để xem/sửa dữ liệu trực tiếp trên trình duyệt).

Tích hợp (API): Thanh toán đa phương thức (VNPay/MoMo/COD) - Luồng xử lý giao dịch linh hoạt.

Vận hành Local: Git, Node.js (pnpm/npm).

4. CHÂN DUNG NGƯỜI DÙNG & TÍNH NĂNG LÕI (USER ROLES & CORE FEATURES)
(Quy hoạch từ Mục 3.4)

👤 Role 1: Chủ sàn / Quản trị viên (Admin)

Phân quyền cao nhất, quản trị toàn diện nền tảng.

Quản lý cơ chế đối soát tài chính: Tự động tính toán, khấu trừ phí nền tảng (hoa hồng nền tảng) trên các giao dịch.

👤 Role 2: Người bán (Seller)

Đăng ký gian hàng & Đăng bán sản phẩm.

Quản lý Ví điện tử hệ thống (E-Wallet): Tự động nhận 90% doanh thu (đã trừ 10% phí hoa hồng sàn) cộng vào ví ảo sau khi đơn hàng hoàn thành.

Chức năng tạo lệnh rút tiền (Cash-out) từ ví hệ thống và theo dõi lịch sử đối soát số dư.

👤 Role 3: Người mua (Buyer)

Tìm kiếm, xem thông tin sách và trao đổi trực tiếp với người bán qua Chat.

Giỏ hàng đa shop (Multi-shop Cart): Cho phép mua nhiều sách từ nhiều Shop khác nhau trong cùng 1 lần thanh toán.

Đa dạng phương thức thanh toán: Trả trước (VNPay/MoMo) hoặc Trả sau (COD - Thanh toán cho Shipper).

Đánh giá & Phản hồi (Rating & Review): Đánh giá độ uy tín của người bán sau khi nhận hàng.

5. LỘ TRÌNH THỰC THI (WBS - 17 TUẦN)
(Chuyển hóa từ Mục 4 thành các Sprint chuẩn của doanh nghiệp Agile)

Phase 1: Khảo sát & R&D (Tuần 1 - Tuần 4)

Nghiệp vụ: Phân tích sâu cách Shopee, Oreka vận hành luồng giao dịch C2C, luồng tiền và chính sách thu phí.

Kỹ thuật: Đọc tài liệu API thanh toán tích hợp. Đánh giá ưu điểm của MySQL cho bài toán tài chính.

Phase 2: Thiết kế Hệ thống (Tuần 4 - Tuần 5)

System Design: Vẽ sơ đồ Use case, sơ đồ Thực thể liên kết (ERD) cho Database.

Đặc tả luồng: Bắt buộc vẽ Sơ đồ tuần tự (Sequence Diagram) chi tiết cho luồng thanh toán Escrow và luồng chia hoa hồng.

UI/UX: Thiết kế giao diện Mockup cho 3 cổng: Mua hàng, Quản lý gian hàng (Seller) và Quản trị hệ thống (Admin).

Phase 3: Phát triển & Lập trình (Tuần 5 - Tuần 13)

Code hệ thống API quản lý User, API Sản phẩm. Code Frontend/Backend.

Trọng điểm Code (Giải quyết logic siêu nặng): Xây dựng luồng tách đơn hàng đa shop, tích hợp cổng thanh toán trực tuyến. Viết logic tính toán hoa hồng tự động và tính năng rút tiền từ ví.

Phase 4: Kiểm thử, Nghiệm thu & Triển khai (Tuần 14 - Tuần 17)

Testing: Kiểm thử chức năng, hiệu năng, UX. Đặc biệt tập trung test độ chính xác của dòng tiền và đối soát hoa hồng ở các kịch bản Edge-cases (ví dụ: Khách hủy đơn, rớt mạng lúc thanh toán).

Bàn giao (Deliverables): Web hoàn chỉnh 3 quyền. Gói triển khai Docker. Báo cáo đồ án, Test case, Video Demo sản phẩm.

⚠️ GÓC NHÌN QUẢN TRỊ RỦI RO TỪ PM (Dành riêng cho bạn)
Để dự án này không bị "vỡ trận" lúc đang code, bạn phải kiểm soát gắt gao team Kỹ thuật ở Phase 3 with 2 bài toán sống còn:

Bài toán Tách đơn hàng (Multi-shop Cart Splitting): Khách hàng quẹt thẻ thanh toán 1 lần duy nhất 500k cho 3 quyển sách của 3 Shop khác nhau. Hệ thống DB của bạn bắt buộc phải ghi nhận 1 Lệnh thanh toán tổng, nhưng đẻ ra được 3 Đơn hàng con (Sub-order). Nếu thiết kế Database sai chỗ này từ Phase 2, lúc chia tiền hoa hồng sẽ bị kẹt toàn bộ hệ thống.

Logic Giam tiền (Escrow Logic): Tiền phải nằm ở trạng thái Đóng băng (Frozen/Escrow).
- Với thanh toán trả trước: Sàn giữ 100% tiền.
- Với thanh toán COD: Tiền giữ tại Đơn vị vận chuyển (GHTK/GHN) và chỉ giải ngân về ví Seller sau khi bên vận chuyển đối soát chuyển tiền về Sàn.
- Giải ngân: Chỉ kích hoạt hàm logic Cộng 90% tiền vào ví ảo của Seller và 10% vào ví Admin khi người mua bấm "Đã nhận hàng" hoặc hết thời gian khiếu nại.

Logic Hoàn tiền tự động (Automatic Refund): Khi đơn hàng bị hủy do hết hàng hoặc người mua hủy đúng quy định, hệ thống tự động hoàn trả số tiền đã thanh toán vào "Ví khả dụng" của Buyer trên sàn để khách hàng có thể tái sử dụng ngay lập tức.
PHẦN 1: BÓC TÁCH 5 LỖ HỔNG NGHIỆP VỤ BẮT BUỘC PHẢI BỔ SUNG
Nếu chỉ làm theo đúng gạch đầu dòng của tài liệu trường, dự án sẽ gặp các "điểm mù" sau:

1. Lỗ hổng Giải ngân (Logistics Trigger): Làm sao biết "Người mua đã nhận được hàng"?

Vấn đề: Hệ thống giữ tiền (Escrow) và đợi người mua bấm "Đã nhận hàng" mới nhả tiền cho người bán. Nhưng thực tế 80% người mua nhận xong sẽ... vứt đó, quên vào web bấm nút. Tiền của người bán sẽ bị hệ thống giam vĩnh viễn?

PM Đề xuất:

Bắt buộc người bán phải nhập Mã vận đơn (Tracking Code) (VD: mã GHTK, Viettel Post) lên hệ thống để Admin có căn cứ kiểm tra.

Thiết kế luồng Hạ cánh mềm (Auto-Complete/Timeout): Sau 7 ngày kể từ khi đơn chuyển trạng thái "Đã gửi hàng", nếu người mua không có khiếu nại, hệ thống phải tự động quét (Cronjob), chốt đơn thành công và giải ngân tiền cho Seller.

2. Lỗ hổng C2C: Tranh chấp & Hoàn tiền (Dispute & Refund)

Vấn đề: Mua sách cũ rủi ro cực cao. Người mua trả tiền mua sách thật nhưng nhận về sách photo, rách nát thì sao? Tiền đang bị hệ thống giam, luồng cãi nhau diễn ra thế nào?

PM Đề xuất:

Phải có Luồng khiếu nại. Người mua có nút "Yêu cầu hoàn tiền / Trả hàng" (hiệu lực trong 3 ngày từ khi nhận), bắt buộc upload ảnh/video bằng chứng mở hộp.

Lúc này, tiền của đơn hàng lập tức bị Đóng băng cứng (Hold), luồng Auto-Complete ở mục 1 bị ngắt.

Có giao diện Tòa án trung tâm (Arbitration) for Admin: Admin xem bằng chứng 2 bên và bấm phán quyết: Hoàn tiền cho Buyer hoặc Bác bỏ khiếu nại, chuyển tiền cho Seller.

3. Lỗ hổng Rút tiền (Cash-out) & Tính thanh khoản

Vấn đề: Người bán có 500k trong ví, họ bấm "Rút tiền về thẻ Vietcombank". Nếu hệ thống gọi API ngân hàng tự động chuyển ngay, lỡ web bị bug nhân đôi số dư, Sàn sẽ bị hacker vét sạch tiền thật (rửa tiền).

PM Đề xuất: Mọi lệnh rút tiền phải sinh ra một "Yêu cầu rút tiền" (Withdrawal Request) trạng thái Pending. Hệ thống sẽ trừ tiền khả dụng trong ví (chuyển sang trạng thái chờ). Admin/Kế toán duyệt lệnh, tự chuyển khoản bằng tay ngoài đời, rồi lên Admin Dashboard bấm Đã duyệt & Đã chuyển. Tuyệt đối không tự động hóa 100% chỗ này.

4. Lỗ hổng Đánh giá Tín nhiệm (Rating & Review)

Vấn đề: Tài liệu gốc hoàn toàn thiếu hệ thống Review. Mua bán C2C mà không biết người bán có uy tín hay không thì không ai dám nạp tiền quẹt thẻ.

PM Đề xuất: Bổ sung tính năng Review (1-5 sao) và Comment bắt buộc. Chỉ những ai đã mua thành công (Đơn hàng trạng thái Completed) mới được phép Review Seller.

5. Lỗ hổng Tranh chấp tồn kho (Race Condition)

Vấn đề: Sách cũ C2C thường chỉ có Tồn kho = 1. Nếu 2 khách hàng cùng bỏ cuốn đó vào giỏ và cùng ấn nút Thanh toán qua VNPay ở cùng 1 phần ngàn giây. Ai sẽ mua được?

PM Đề xuất: Yêu cầu Dev làm cơ chế Khóa tồn kho tạm thời (Soft-lock / Pessimistic Locking). Khi khách chuyển sang trang VNPay, sách đó bị khóa giam trong 15 phút (khách khác vào sẽ thấy chữ "Đang có người giao dịch"). Quá 15 phút không thanh toán, nhả sách lại ra chợ.

PHẦN 2: CẢNH BÁO KỸ THUẬT "SỐNG CÒN" CHO TEAM DEV
Là PM, bạn phải vạch ranh giới đỏ này trong buổi họp Kick-off với Tech team:

Kiểu dữ liệu Tiền tệ: Tuyệt đối KHÔNG dùng kiểu FLOAT hay DOUBLE để lưu Tiền trong Database (code máy tính tính toán số thập phân rất ngu, ví dụ 1000 * 3.3% sẽ ra 33.299999). Tiền Việt Nam phải lưu bằng kiểu BIGINT (Số nguyên - INT) hoặc DECIMAL(15,2).

Bảo vệ bằng ACID Transaction: Khi đơn hàng thành công, luồng chia tiền sẽ diễn ra. Hệ thống phải chạy 3 lệnh: (1) Trừ tiền giam giữ, (2) Cộng ví Seller, (3) Thu phí hoa hồng Admin. Bắt buộc: Cả 3 lệnh này phải nằm chung 1 gói Database Transaction. Lỡ cộng tiền cho Seller xong mà đứt cáp rớt mạng, hệ thống phải tự động ROLLBACK (hoàn tác) về 0. Cấm để lệch dòng tiền.

Tính Lũy đẳng (Idempotency) của cổng thanh toán: VNPay/MoMo đôi khi bị kẹt mạng, bắn thông báo "Thành công" 3 lần cho cùng 1 hóa đơn. Dev phải code logic chặn: Nếu đơn này đã đổi sang trạng thái PAID rồi, mọi request tới sau đều phải vứt đi, tránh việc cộng tiền vào ví Seller 3 lần.

PHẦN 3: ĐỀ XUẤT KIẾN TRÚC DATABASE CỐT LÕI (CORE ERD)
Bài toán khó nhất của dự án này là Giỏ hàng đa Shop (Khách mua 3 quyển của Shop A, 2 quyển của Shop B nhưng chỉ quẹt thẻ 1 lần). Tôi thiết kế cho bạn cấu trúc CSDL Quan hệ MySQL với mô hình Cha - Con và Kế toán Sổ cái (Ledger). Bạn in cái này đưa thẳng cho Backend Dev.

Cụm 1: Nền tảng (Platform)
users: id, role (admin, buyer, seller), name, email, password_hash, bank_account_info.

books: id, seller_id (FK), title, price, stock_quantity, condition (Enum: Mới 100%, Like New, Khá, Cũ - rất quan trọng với C2C).

Cụm 2: Tách đơn hàng (Cart Splitting) - Trái tim hệ thống
master_orders (Đơn hàng Tổng - Dùng để làm việc với VNPay):

id (PK)

buyer_id (FK)

total_payment (Tổng tiền khách quẹt 1 lần)

payment_method (VNPAY, MoMo, COD)

payment_status (Pending, Paid, Failed)

transaction_id (Mã giao dịch từ VNPay hoặc mã thu hộ COD)

sub_orders (Đơn hàng Con - Dùng để chia về cho từng Seller xử lý Escrow):

id (PK)

master_order_id (FK)

seller_id (FK)

sub_total (Tiền sách của riêng Shop này)

platform_fee (Tiền phí sàn thu - PM note: Lưu cứng bằng VNĐ lúc tạo đơn, không lưu % để tránh sau này đổi chính sách làm sai lệch dữ liệu cũ).

net_amount (Tiền thực nhận của Seller = sub_total - platform_fee)

tracking_code (Mã vận đơn)

status (Pending, Shipping, Delivered, Completed, Disputed, Refunded). -> Rule: Chỉ khi status = 'Completed', tiền mới được nhả vào ví Seller.

order_items (Chi tiết giỏ hàng): id, sub_order_id, book_id, quantity, price_at_purchase (Lưu cứng giá lúc mua).

Cụm 3: Ví điện tử trung gian & Sổ cái (Ledger)
Nguyên tắc kế toán: Không bao giờ chỉ cộng/trừ rỗng không vào số dư, mọi biến động 1 đồng cũng phải sinh ra "Sao kê" (Log).

wallets (Ví - Mỗi User/Admin có 1 dòng):

id (PK), user_id (FK)

available_balance (Tiền khả dụng: Có thể đem đi mua hàng tiếp hoặc Rút về ngân hàng).

escrow_balance (Tiền đóng băng: Khách đã quẹt thẻ, đang giao hàng, chờ đối soát).

wallet_transactions (Sổ cái sao kê):

RULE: Bảng này CẤM UPDATE / DELETE. Chỉ được quyền INSERT.

id (PK), wallet_id (FK), reference_sub_order_id (Liên kết với đơn hàng nào)

type (IN_ESCROW, ESCROW_RELEASE, DEDUCT_FEE, WITHDRAW_PENDING, WITHDRAW_SUCCESS, REFUND)

amount (+/- Số tiền)

description ("Cộng tiền bán sách Đắc Nhân Tâm từ đơn hàng #123").

---

## 6. HƯỚNG DẪN CÀI ĐẶT CHẠY DEMO LOCAL (QUAN TRỌNG)
Dành cho việc kiểm tra và demo sản phẩm trên máy cá nhân:

### Bước 1: Chuẩn bị môi trường
- Cài đặt **Node.js** (Phiên bản LTS).
- Cài đặt **MySQL Server** (Hoặc dùng XAMPP/Laragon). Tạo một database trống tên là `bookstore_db`.

### Bước 2: Cấu hình biến môi trường
1. Mở file `.env`.
2. Chỉnh sửa dòng `DATABASE_URL` theo đúng thông tin MySQL của bạn:
   `DATABASE_URL="mysql://root:password@localhost:3306/bookstore_db"`
   *(Thay `root` và `password` bằng user/pass MySQL của bạn)*.

### Bước 3: Cài đặt và Khởi tạo Database
```bash
# Cài đặt các gói phụ thuộc
npm install

# Đồng bộ cấu trúc Database từ file schema.prisma vào MySQL
npx prisma db push

# (Tùy chọn) Generate Prisma Client
npx prisma generate
```

### Bước 4: Chạy ứng dụng
```bash
# Chạy server ở chế độ development
npm run dev
```
- Truy cập ứng dụng tại: `http://localhost:3000`

### Bước 5: Quản lý dữ liệu (Demo)
Để thêm/sửa/xóa dữ liệu nhanh mà không cần qua giao diện web, chạy lệnh:
```bash
npx prisma studio
```
- Truy cập: `http://localhost:5555` để quản trị database trực quan.