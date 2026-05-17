# Tài liệu API chi tiết - Hệ thống Bán sách C2C

Tài liệu này mô tả chi tiết toàn bộ API hiện có trong dự án và các màn hình quản trị Admin kèm trường dữ liệu cần nhập, dựa trên mã nguồn hiện tại.

---

## 1. Tổng quan

- **Kiểu API chính**: REST API dùng `Next.js Route Handlers`
- **Xác thực**:
  - Một số API công khai, không cần đăng nhập
  - Một số API yêu cầu session đăng nhập
  - Một số chức năng Admin yêu cầu tài khoản có quyền `ADMIN`
- **Định dạng dữ liệu**:
  - Chủ yếu dùng `JSON`
  - Một số chức năng Admin dùng `FormData` thông qua Server Actions

---

## 2. REST APIs

### 2.1 Đăng ký tài khoản mới
- *Endpoint*: `POST /api/auth/register`
- *Mô tả*: Tạo tài khoản người dùng mới và khởi tạo ví tiền mặc định.
- *Yêu cầu xác thực*: Không
- *Request Body*:

  | Trường | Kiểu | Bắt buộc | Mô tả |
  | :--- | :--- | :--- | :--- |
  | `email` | String | Có | Địa chỉ email duy nhất |
  | `password` | String | Có | Mật khẩu người dùng |
  | `name` | String | Có | Họ tên người dùng |

- *Luồng xử lý*:
  1. Kiểm tra đủ `email`, `password`, `name`
  2. Kiểm tra email đã tồn tại hay chưa
  3. Mã hóa mật khẩu
  4. Tạo user mới với role mặc định là `USER`
  5. Tạo ví mặc định với `availableBalance = 0`, `escrowBalance = 0`

- *Phản hồi thành công*:
  - `201 Created`
  ```json
  {
    "message": "Đăng ký thành công",
    "userId": "clxxx..."
  }
  ```

- *Phản hồi lỗi*:
  - `400 Bad Request`
  ```json
  {
    "error": "Vui lòng nhập đầy đủ thông tin"
  }
  ```

  - `400 Bad Request`
  ```json
  {
    "error": "Email này đã được sử dụng"
  }
  ```

  - `500 Internal Server Error`
  ```json
  {
    "error": "Đã có lỗi xảy ra. Vui lòng thử lại sau."
  }
  ```

---

### 2.2 Đăng nhập / xác thực phiên làm việc
- *Endpoint*: `GET /api/auth/[...nextauth]`
- *Mô tả*: Endpoint nội bộ của NextAuth để xử lý session, callback, CSRF, provider flow.
- *Yêu cầu xác thực*: Không cố định, tùy action con của NextAuth.
- *Request Parameters*: Phụ thuộc NextAuth.
- *Phản hồi*: Phụ thuộc flow của NextAuth.

- *Endpoint*: `POST /api/auth/[...nextauth]`
- *Mô tả*: Endpoint nội bộ của NextAuth để đăng nhập, đăng xuất, callback xác thực.
- *Yêu cầu xác thực*: Tùy action.
- *Request Body*: Phụ thuộc cấu hình NextAuth.
- *Phản hồi*: Phụ thuộc flow của NextAuth.

> Ghi chú: Dự án hiện đang export trực tiếp `GET`, `POST` từ `@/lib/auth`, nên tài liệu chi tiết cho từng action con của NextAuth cần đối chiếu thêm cấu hình xác thực thực tế trong hệ thống.

---

### 2.3 Lấy gợi ý tìm kiếm sách
- *Endpoint*: `GET /api/books/suggestions?q=...`
- *Mô tả*: Trả về tối đa 5 sách gợi ý theo tên sách hoặc tác giả.
- *Yêu cầu xác thực*: Không
- *Query Parameters*:

  | Trường | Kiểu | Bắt buộc | Mô tả |
  | :--- | :--- | :--- | :--- |
  | `q` | String | Có | Từ khóa tìm kiếm |

- *Luồng xử lý*:
  1. Đọc query `q`
  2. Nếu `q` rỗng, trả về mảng rỗng
  3. Tìm sách theo `title` hoặc `author`
  4. Giới hạn tối đa 5 kết quả

- *Phản hồi thành công*:
  - `200 OK`
  ```json
  [
    {
      "id": "book_001",
      "title": "Đắc Nhân Tâm",
      "author": "Dale Carnegie",
      "imageUrl": "https://..."
    }
  ]
  ```

- *Phản hồi lỗi*:
  - `500 Internal Server Error`
  ```json
  {
    "error": "Internal Server Error"
  }
  ```

---

### 2.4 Lấy danh sách danh mục
- *Endpoint*: `GET /api/categories`
- *Mô tả*: Lấy toàn bộ danh mục sách, sắp xếp tăng dần theo tên.
- *Yêu cầu xác thực*: Không
- *Request Body*: Không có

- *Phản hồi thành công*:
  - `200 OK`
  ```json
  [
    {
      "id": "cat_001",
      "name": "Văn học",
      "slug": "van-hoc"
    }
  ]
  ```

- *Phản hồi lỗi*:
  - `500 Internal Server Error`
  ```json
  {
    "error": "Internal Server Error"
  }
  ```

---

### 2.5 Tạo đơn hàng / thanh toán
- *Endpoint*: `POST /api/checkout`
- *Mô tả*: Tạo đơn hàng tổng, tách đơn theo seller, áp dụng voucher, phân bổ doanh thu và cập nhật tồn kho.
- *Yêu cầu xác thực*: Có, phải đăng nhập
- *Request Body*:

  | Trường | Kiểu | Bắt buộc | Mô tả |
  | :--- | :--- | :--- | :--- |
  | `items` | Array | Có | Danh sách sản phẩm đặt mua |
  | `items[].id` | String | Có | ID sách |
  | `items[].sellerId` | String | Có | ID người bán |
  | `items[].title` | String | Có | Tên sách |
  | `items[].quantity` | Number | Có | Số lượng mua |
  | `items[].price` | Number | Có | Giá gửi từ client, nhưng server sẽ kiểm tra lại |
  | `paymentMethod` | String | Không | Phương thức thanh toán, mặc định `COD` |
  | `voucherCode` | String | Không | Mã voucher áp dụng |
  | `shippingInfo` | Object | Có | Thông tin giao hàng |
  | `shippingInfo.name` | String | Có | Tên người nhận |
  | `shippingInfo.phone` | String | Có | Số điện thoại người nhận |
  | `shippingInfo.address` | String | Có | Địa chỉ giao hàng |

- *Luồng xử lý chính*:
  1. Kiểm tra người dùng đã đăng nhập
  2. Kiểm tra giỏ hàng không rỗng
  3. Không cho user tự mua sách của chính mình
  4. Kiểm tra từng sách có tồn tại hay không
  5. Nếu có offer được chấp nhận, dùng giá offer thay cho giá gốc
  6. Tính tổng tiền hàng
  7. Nếu có `voucherCode`, tính giảm giá theo sách hỗ trợ voucher
  8. Tạo `masterOrder`
  9. Tăng `usedCount` cho voucher nếu áp dụng thành công
  10. Tạo `subOrder` cho từng seller
  11. Phân bổ doanh thu cho admin và seller
  12. Trừ tồn kho sách

- *Phản hồi thành công*:
  - `200 OK`
  ```json
  {
    "message": "Đặt hàng thành công",
    "orderId": "order_001"
  }
  ```

- *Phản hồi lỗi*:
  - `401 Unauthorized`
  ```json
  {
    "error": "Unauthorized"
  }
  ```

  - `400 Bad Request`
  ```json
  {
    "error": "Giỏ hàng trống"
  }
  ```

  - `400 Bad Request`
  ```json
  {
    "error": "Bạn không thể tự mua sách của chính mình (Tên sách)"
  }
  ```

  - `400 Bad Request`
  ```json
  {
    "error": "Sách Tên sách không tồn tại"
  }
  ```

  - `500 Internal Server Error`
  ```json
  {
    "error": "Đã có lỗi xảy ra khi thanh toán"
  }
  ```

  - `500 Internal Server Error`
  ```json
  {
    "error": "Sách Tên sách đã hết hàng hoặc không đủ số lượng."
  }
  ```

---

### 2.6 Lấy danh sách hội thoại chat
- *Endpoint*: `GET /api/chat/conversations`
- *Mô tả*: Lấy danh sách hội thoại của người dùng hiện tại. Nếu là Admin thì có thể thấy toàn bộ hội thoại.
- *Yêu cầu xác thực*: Có, phải đăng nhập
- *Request Body*: Không có

- *Phản hồi thành công*:
  - `200 OK`
  ```json
  [
    {
      "id": "conv_001",
      "buyerId": "user_buyer",
      "sellerId": "user_seller",
      "bookId": "book_001",
      "lastMessage": "Xin chào",
      "lastMsgAt": "2026-05-13T08:00:00.000Z",
      "buyer": {
        "id": "user_buyer",
        "name": "Nguyễn Văn A"
      },
      "seller": {
        "id": "user_seller",
        "name": "Trần Văn B"
      },
      "book": {
        "id": "book_001",
        "title": "Đắc Nhân Tâm",
        "imageUrl": "https://..."
      },
      "_count": {
        "messages": 2
      }
    }
  ]
  ```

- *Phản hồi lỗi*:
  - `401 Unauthorized`
  ```json
  {
    "error": "Unauthorized"
  }
  ```

  - `500 Internal Server Error`
  ```json
  {
    "error": "..."
  }
  ```

---

### 2.7 Tạo hoặc tìm hội thoại chat
- *Endpoint*: `POST /api/chat/conversations`
- *Mô tả*: Tạo mới hội thoại giữa buyer và seller, hoặc trả lại hội thoại cũ nếu đã tồn tại.
- *Yêu cầu xác thực*: Có, phải đăng nhập
- *Request Body*:

  | Trường | Kiểu | Bắt buộc | Mô tả |
  | :--- | :--- | :--- | :--- |
  | `sellerId` | String | Có | ID người bán |
  | `bookId` | String | Không | ID sách liên quan đến hội thoại |

- *Ràng buộc*:
  - Người dùng không được chat với chính mình
  - Nếu đã có hội thoại trùng `buyerId`, `sellerId`, `bookId` thì trả lại hội thoại đó

- *Phản hồi thành công*:
  - `200 OK`
  ```json
  {
    "id": "conv_001",
    "buyerId": "user_buyer",
    "sellerId": "user_seller",
    "bookId": "book_001"
  }
  ```

- *Phản hồi lỗi*:
  - `401 Unauthorized`
  ```json
  {
    "error": "Unauthorized"
  }
  ```

  - `400 Bad Request`
  ```json
  {
    "error": "Thiếu sellerId"
  }
  ```

  - `400 Bad Request`
  ```json
  {
    "error": "Bạn không thể chat với chính mình"
  }
  ```

  - `500 Internal Server Error`
  ```json
  {
    "error": "..."
  }
  ```

---

### 2.8 Lấy tin nhắn của hội thoại
- *Endpoint*: `GET /api/chat/conversations/[id]/messages`
- *Mô tả*: Lấy danh sách tin nhắn theo hội thoại và tự động đánh dấu đã đọc các tin nhắn gửi tới user hiện tại.
- *Yêu cầu xác thực*: Có, phải đăng nhập
- *Path Parameters*:

  | Trường | Kiểu | Bắt buộc | Mô tả |
  | :--- | :--- | :--- | :--- |
  | `id` | String | Có | ID hội thoại |

- *Phản hồi thành công*:
  - `200 OK`
  ```json
  [
    {
      "id": "msg_001",
      "conversationId": "conv_001",
      "senderId": "user_buyer",
      "content": "Sách còn không ạ?",
      "isRead": true,
      "createdAt": "2026-05-13T08:10:00.000Z"
    }
  ]
  ```

- *Phản hồi lỗi*:
  - `401 Unauthorized`
  ```json
  {
    "error": "Unauthorized"
  }
  ```

  - `404 Not Found`
  ```json
  {
    "error": "Không tìm thấy cuộc hội thoại"
  }
  ```

  - `500 Internal Server Error`
  ```json
  {
    "error": "..."
  }
  ```

---

### 2.9 Gửi tin nhắn mới
- *Endpoint*: `POST /api/chat/conversations/[id]/messages`
- *Mô tả*: Gửi tin nhắn mới vào hội thoại và cập nhật `lastMessage`, `lastMsgAt`.
- *Yêu cầu xác thực*: Có, phải đăng nhập
- *Path Parameters*:

  | Trường | Kiểu | Bắt buộc | Mô tả |
  | :--- | :--- | :--- | :--- |
  | `id` | String | Có | ID hội thoại |

- *Request Body*:

  | Trường | Kiểu | Bắt buộc | Mô tả |
  | :--- | :--- | :--- | :--- |
  | `content` | String | Có | Nội dung tin nhắn |

- *Phản hồi thành công*:
  - `200 OK`
  ```json
  {
    "id": "msg_001",
    "conversationId": "conv_001",
    "senderId": "user_buyer",
    "content": "Tôi muốn hỏi về sách này"
  }
  ```

- *Phản hồi lỗi*:
  - `401 Unauthorized`
  ```json
  {
    "error": "Unauthorized"
  }
  ```

  - `400 Bad Request`
  ```json
  {
    "error": "Tin nhắn không được để trống"
  }
  ```

  - `500 Internal Server Error`
  ```json
  {
    "error": "..."
  }
  ```

---

### 2.10 Lấy số tin nhắn chưa đọc
- *Endpoint*: `GET /api/chat/unread`
- *Mô tả*: Lấy tổng số tin nhắn chưa đọc của user hiện tại.
- *Yêu cầu xác thực*: Nếu chưa đăng nhập vẫn gọi được, nhưng sẽ trả `count = 0`
- *Request Body*: Không có

- *Phản hồi thành công*:
  - `200 OK`
  ```json
  {
    "count": 5
  }
  ```

- *Phản hồi khi chưa đăng nhập hoặc lỗi hệ thống*:
  - `200 OK`
  ```json
  {
    "count": 0
  }
  ```

---

### 2.11 Proxy ảnh từ nguồn ngoài
- *Endpoint*: `GET /api/proxy-image?url=...`
- *Mô tả*: Tải ảnh từ URL bên ngoài rồi trả lại ảnh cho frontend, tránh lỗi chặn hotlink hoặc lỗi nguồn ảnh.
- *Yêu cầu xác thực*: Không
- *Query Parameters*:

  | Trường | Kiểu | Bắt buộc | Mô tả |
  | :--- | :--- | :--- | :--- |
  | `url` | String | Có | URL ảnh nguồn |

- *Phản hồi thành công*:
  - `200 OK`
  - Header `Content-Type` lấy từ ảnh gốc
  - Header `Cache-Control: public, max-age=31536000, immutable`

- *Phản hồi lỗi*:
  - `400 Bad Request`
  ```text
  Missing URL
  ```

  - Nếu fetch ảnh thất bại: trả về status lỗi tương ứng từ nguồn ảnh
  ```text
  Failed to fetch image: <statusText>
  ```

  - Nếu lỗi runtime: redirect tới ảnh placeholder

---

### 2.12 Cập nhật toàn bộ tồn kho về 10
- *Endpoint*: `GET /api/update-stock`
- *Mô tả*: Cập nhật `stockQuantity = 10` cho toàn bộ sách trong hệ thống.
- *Yêu cầu xác thực*: Hiện tại **không có kiểm tra quyền** trong mã nguồn.
- *Cảnh báo*: Đây là API có khả năng thay đổi dữ liệu hàng loạt.

- *Phản hồi thành công*:
  - `200 OK`
  ```json
  {
    "success": true,
    "updatedCount": 25
  }
  ```

- *Phản hồi lỗi*:
  - `500 Internal Server Error`
  ```json
  {
    "success": false,
    "error": "..."
  }
  ```

---

## 3. Chức năng Admin và trường dữ liệu cần nhập

> Phần này mô tả các chức năng trang Admin hiện có trong mã nguồn, gồm form nhập liệu và action xử lý phía server.

### 3.1 Trang Admin tổng
- *Route giao diện*: `/admin`
- *Mô tả*: Tự động chuyển hướng sang `/admin/dashboard`.
- *Nhập liệu*: Không có

---

### 3.2 Quản lý sách Admin
- *Route giao diện*: `/admin/books`
- *Chức năng chính*:
  - Thêm sách mới
  - Sửa sách
  - Xóa sách

#### Form thêm / sửa sách
- *Action tạo mới*: `createBookAdmin(formData)`
- *Action cập nhật*: `updateBookAdmin(id, formData)`
- *Trường nhập liệu*:

  | Trường | Kiểu | Bắt buộc | Mô tả |
  | :--- | :--- | :--- | :--- |
  | `title` | String | Có | Tên sách |
  | `author` | String | Không | Tác giả |
  | `imageUrl` | String | Không | Link ảnh bìa |
  | `description` | String | Không | Mô tả chi tiết sách |
  | `price` | Number | Có | Giá bán |
  | `stockQuantity` | Number | Có | Số lượng tồn kho |
  | `condition` | Enum | Có | Tình trạng sách |
  | `categoryId` | String | Có trên giao diện | ID danh mục |

- *Giá trị `condition` hỗ trợ*:

  | Giá trị | Ý nghĩa |
  | :--- | :--- |
  | `NEW_100` | Mới 100% |
  | `LIKE_NEW` | Like New (99%) |
  | `GOOD` | Khá (80-90%) |
  | `OLD` | Cũ |

- *Kiểm tra dữ liệu phía server*:
  - `title` bắt buộc
  - `price` phải là số hợp lệ
  - `stockQuantity` phải là số hợp lệ và không nhỏ hơn `0`
  - Khi tạo mới, nếu thiếu `title` hoặc `price` sẽ báo lỗi

- *Phản hồi action thành công*:
  ```json
  {
    "success": true
  }
  ```

- *Phản hồi action lỗi*:
  ```json
  {
    "success": false,
    "error": "Tiêu đề và giá là bắt buộc"
  }
  ```

  hoặc

  ```json
  {
    "success": false,
    "error": "Giá không hợp lệ"
  }
  ```

  hoặc

  ```json
  {
    "success": false,
    "error": "Số lượng không được nhỏ hơn 0"
  }
  ```

#### Xóa sách
- *Action*: `deleteBookAdmin(id)`
- *Tham số*:

  | Trường | Kiểu | Bắt buộc | Mô tả |
  | :--- | :--- | :--- | :--- |
  | `id` | String | Có | ID sách cần xóa |
  |
- *Phản hồi thành công*:
  ```json
  {
    "success": true
  }
  ```

- *Phản hồi lỗi*:
  ```json
  {
    "success": false,
    "error": "Không thể xóa sách"
  }
  ```

---

### 3.3 Quản lý danh mục Admin
- *Route giao diện*: `/admin/categories`
- *Chức năng chính*:
  - Thêm danh mục
  - Xóa danh mục
  - Giao diện sửa đã có, nhưng backend sửa chưa hoàn thiện

#### Form thêm danh mục
- *Action*: `createCategory(formData)`
- *Trường nhập liệu*:

  | Trường | Kiểu | Bắt buộc | Mô tả |
  | :--- | :--- | :--- | :--- |
  | `name` | String | Có | Tên danh mục |

- *Xử lý server*:
  - Tạo thêm `slug` tự động từ `name`
  - Chuẩn hóa chữ thường, bỏ dấu, thay khoảng trắng bằng `-`

- *Phản hồi thành công*:
  ```json
  {
    "success": true
  }
  ```

- *Phản hồi lỗi*:
  ```json
  {
    "error": "Tên danh mục không được để trống"
  }
  ```

  hoặc

  ```json
  {
    "error": "Tên danh mục hoặc slug đã tồn tại"
  }
  ```

#### Xóa danh mục
- *Action*: `deleteCategory(id)` hoặc `deleteCategoryForm(formData)`
- *Trường nhập liệu / tham số*:

  | Trường | Kiểu | Bắt buộc | Mô tả |
  | :--- | :--- | :--- | :--- |
  | `id` | String | Có | ID danh mục cần xóa |

#### Tạo danh mục mặc định
- *Action*: `seedCategories()`
- *Mô tả*: Tạo sẵn nhóm danh mục mặc định nếu chưa tồn tại.
- *Danh mục mặc định*:
  - Văn học
  - Thiếu nhi
  - Truyện tranh
  - Sách giáo khoa
  - Kinh tế
  - Kỹ năng sống
  - Khác

---

### 3.4 Quản lý voucher Admin
- *Route giao diện*: `/admin/vouchers`
- *Form tạo voucher hiện tại nằm trong*: `/admin/settings` thông qua component `VoucherForm`
- *Action xử lý*: `createVoucher(data)`

#### Form tạo voucher
- *Trường nhập liệu trên giao diện*:

  | Trường | Kiểu | Bắt buộc | Mô tả |
  | :--- | :--- | :--- | :--- |
  | `code` | String | Có | Mã voucher, sẽ được lưu dạng in hoa |
  | `description` | String | Không | Mô tả chương trình |
  | `discountType` | String | Có | `PERCENTAGE` hoặc `FIXED_AMOUNT` |
  | `discountValue` | Number | Có | Giá trị giảm |
  | `minOrderAmount` | Number | Không | Giá trị đơn hàng tối thiểu, mặc định `0` |
  | `maxDiscount` | Number | Không | Mức giảm tối đa, dùng khi giảm theo % |
  | `usageLimit` | Number | Không | Số lượt sử dụng tối đa, mặc định `100` |
  | `expiryDate` | Date | Không | Ngày hết hạn |

- *Trường có hỗ trợ ở backend nhưng chưa có input riêng trên form hiện tại*:

  | Trường | Kiểu | Bắt buộc | Mô tả |
  | :--- | :--- | :--- | :--- |
  | `minRank` | String | Không | Hạng thành viên tối thiểu, mặc định `BRONZE` |

- *Phản hồi action thành công*:
  ```json
  {
    "success": true,
    "voucher": {
      "id": "voucher_001",
      "code": "LIBRIS10"
    }
  }
  ```

- *Phản hồi action lỗi*:
  ```json
  {
    "success": false,
    "error": "Không thể tạo mã giảm giá"
  }
  ```

#### Đổi trạng thái voucher
- *Action*: `toggleVoucherStatus(id, isActive)`
- *Trường / tham số*:

  | Trường | Kiểu | Bắt buộc | Mô tả |
  | :--- | :--- | :--- | :--- |
  | `id` | String | Có | ID voucher |
  | `isActive` | Boolean | Có | Trạng thái mới |

#### Xóa voucher
- *Action*: `deleteVoucher(id)`
- *Trường / tham số*:

  | Trường | Kiểu | Bắt buộc | Mô tả |
  | :--- | :--- | :--- | :--- |
  | `id` | String | Có | ID voucher cần xóa |

---

### 3.5 Quản lý khiếu nại Admin
- *Route giao diện*: `/admin/disputes`
- *Chức năng chính*: Admin xử lý khiếu nại đơn hàng.
- *Component thao tác*: `AdminDisputeAction`
- *Action xử lý*: `resolveDisputeByAdmin(subOrderId, decision)`

#### Trường dữ liệu / tham số xử lý
| Trường | Kiểu | Bắt buộc | Mô tả |
| :--- | :--- | :--- | :--- |
| `subOrderId` | String | Có | ID đơn hàng con đang bị khiếu nại |
| `decision` | String | Có | `REFUND_BUYER` hoặc `PAY_SELLER` |

#### Ý nghĩa quyết định
- `REFUND_BUYER`: Hoàn tiền cho buyer
- `PAY_SELLER`: Bác khiếu nại, giải ngân tiền cho seller

#### Phản hồi action thành công
```json
{
  "success": true
}
```

#### Phản hồi action lỗi
```json
{
  "success": false,
  "error": "Không tìm thấy khiếu nại."
}
```

---

### 3.6 Các trang Admin hiện có trong dự án

Các route Admin hiện đang có trong mã nguồn:

| Route | Mô tả ngắn |
| :--- | :--- |
| `/admin/dashboard` | Trang tổng quan quản trị |
| `/admin/books` | Quản lý sách |
| `/admin/categories` | Quản lý danh mục |
| `/admin/chat` | Khu vực chat admin |
| `/admin/disputes` | Quản lý khiếu nại |
| `/admin/finance` | Quản lý tài chính |
| `/admin/orders` | Quản lý đơn hàng |
| `/admin/reviews` | Quản lý đánh giá |
| `/admin/settings` | Cài đặt hệ thống, chứa form voucher |
| `/admin/users` | Quản lý người dùng |
| `/admin/vouchers` | Quản lý voucher |

> Trong lần rà soát này, các form nhập liệu xác định rõ từ mã nguồn gồm: quản lý sách, danh mục, voucher và xử lý khiếu nại.

---

## 4. Các Server Actions liên quan nghiệp vụ khác

### 4.1 Kiểm tra voucher trước khi thanh toán
- *Action*: `validateVoucher(code, userId, orderAmount, cartItems)`
- *Mô tả*: Kiểm tra voucher có hợp lệ không trước khi đặt hàng.
- *Tham số*:

  | Trường | Kiểu | Bắt buộc | Mô tả |
  | :--- | :--- | :--- | :--- |
  | `code` | String | Có | Mã voucher |
  | `userId` | String | Có | ID người dùng |
  | `orderAmount` | Number | Có | Tổng giá trị đơn hàng |
  | `cartItems` | Array | Có | Danh sách sản phẩm trong giỏ |

- *Một số lỗi nghiệp vụ có thể trả về*:
  - `voucher.notFound`
  - `voucher.notApplicable`
  - `voucher.rankRequired`
  - `voucher.inactive`
  - `voucher.expired`
  - `voucher.usageLimitExceeded`
  - `voucher.minOrderAmountRequired`
  - `voucher.error`

---

### 4.2 Buyer tạo khiếu nại
- *Action*: `raiseDispute(subOrderId, reason, description, images?)`
- *Mô tả*: Buyer gửi khiếu nại cho đơn hàng đang giao hoặc đã giao.
- *Tham số*:

  | Trường | Kiểu | Bắt buộc | Mô tả |
  | :--- | :--- | :--- | :--- |
  | `subOrderId` | String | Có | ID đơn hàng con |
  | `reason` | String | Có | Lý do khiếu nại |
  | `description` | String | Có | Mô tả chi tiết |
  | `images` | String | Không | Ảnh minh chứng |

---

### 4.3 Seller phản hồi khiếu nại
- *Action*: `respondToDispute(subOrderId, action, reply?)`
- *Mô tả*: Seller chấp nhận hoàn tiền hoặc đẩy khiếu nại lên admin.
- *Tham số*:

  | Trường | Kiểu | Bắt buộc | Mô tả |
  | :--- | :--- | :--- | :--- |
  | `subOrderId` | String | Có | ID đơn hàng con |
  | `action` | String | Có | `ACCEPT_REFUND` hoặc `ESCALATE_TO_ADMIN` |
  | `reply` | String | Không | Nội dung phản hồi của seller |

---

## 5. Ghi chú bảo mật và phân quyền

- Các API như `POST /api/checkout`, nhóm chat, action quản trị sách cần người dùng đăng nhập.
- Các thao tác Admin như thêm sách, sửa sách, xử lý khiếu nại theo thiết kế nghiệp vụ yêu cầu quyền `ADMIN`.
- `GET /api/update-stock` hiện chưa có chặn quyền trong mã nguồn, cần lưu ý khi triển khai production.
- Các nghiệp vụ tiền tệ, đơn hàng, khiếu nại dùng transaction để giảm rủi ro sai lệch dữ liệu.

---

## 6. Tóm tắt nhanh endpoint hiện có

| STT | Method | Endpoint | Xác thực | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| 1 | POST | `/api/auth/register` | Không | Đăng ký tài khoản |
| 2 | GET | `/api/auth/[...nextauth]` | Tùy action | Endpoint nội bộ NextAuth |
| 3 | POST | `/api/auth/[...nextauth]` | Tùy action | Endpoint nội bộ NextAuth |
| 4 | GET | `/api/books/suggestions` | Không | Gợi ý tìm kiếm sách |
| 5 | GET | `/api/categories` | Không | Lấy danh mục |
| 6 | POST | `/api/checkout` | Có | Tạo đơn hàng |
| 7 | GET | `/api/chat/conversations` | Có | Lấy hội thoại |
| 8 | POST | `/api/chat/conversations` | Có | Tạo / tìm hội thoại |
| 9 | GET | `/api/chat/conversations/[id]/messages` | Có | Lấy tin nhắn |
| 10 | POST | `/api/chat/conversations/[id]/messages` | Có | Gửi tin nhắn |
| 11 | GET | `/api/chat/unread` | Không bắt buộc | Đếm tin chưa đọc |
| 12 | GET | `/api/proxy-image` | Không | Proxy ảnh |
| 13 | GET | `/api/update-stock` | Không | Cập nhật tồn kho hàng loạt |


---

## 7. Server Actions — Seller

### 7.1 Tạo sách mới (Seller)
- *Action*: `createBook(formData)`
- *Yêu cầu xác thực*: Có, role `USER` hoặc `ADMIN`
- *Trường nhập liệu*:

  | Trường | Kiểu | Bắt buộc | Mô tả |
  | :--- | :--- | :--- | :--- |
  | `title` | String | Có | Tên sách |
  | `author` | String | Không | Tác giả |
  | `description` | String | Không | Mô tả |
  | `price` | Number | Có | Giá bán (≥ 0) |
  | `stockQuantity` | Number | Có | Số lượng tồn kho (≥ 0) |
  | `condition` | Enum | Có | Tình trạng sách (`NEW_100`, `LIKE_NEW`, `GOOD`, `OLD`) |
  | `category` | String | Không | Danh mục, mặc định `OTHERS` |
  | `imageUrl` | String | Không | URL ảnh bìa |
  | `isbn` | String | Không | Mã ISBN |
  | `vouchers` | String[] | Không | Danh sách ID voucher áp dụng |

- *Ghi chú*: Tự động tạo bản ghi `PriceHistory` khi tạo sách.

---

### 7.2 Cập nhật sách (Seller)
- *Action*: `updateBook(id, formData)`
- *Yêu cầu xác thực*: Có, chỉ seller sở hữu sách
- *Trường nhập liệu*: Tương tự `createBook`, thêm `isbn` và `vouchers`
- *Ghi chú*: Tự động tạo bản ghi `PriceHistory` nếu giá thay đổi.

---

### 7.3 Xóa sách (Seller)
- *Action*: `deleteBook(id)`
- *Yêu cầu xác thực*: Có, chỉ seller sở hữu sách

---

### 7.4 Cập nhật hồ sơ Seller
- *Action*: `updateProfile(formData)`
- *Yêu cầu xác thực*: Có
- *Trường nhập liệu*:

  | Trường | Kiểu | Bắt buộc | Mô tả |
  | :--- | :--- | :--- | :--- |
  | `name` | String | Có | Tên hiển thị |
  | `phoneNumber` | String | Không | Số điện thoại |
  | `address` | String | Không | Địa chỉ |
  | `bankAccountInfo` | String | Không | Thông tin tài khoản ngân hàng |

---

### 7.5 Yêu cầu xác thực tài khoản Seller
- *Action*: `requestVerification(formData)`
- *Yêu cầu xác thực*: Có
- *Trường nhập liệu*:

  | Trường | Kiểu | Bắt buộc | Mô tả |
  | :--- | :--- | :--- | :--- |
  | `verificationDocs` | String | Có | Link tài liệu xác thực |

---

### 7.6 Quản lý địa chỉ giao hàng

#### Lấy danh sách địa chỉ
- *Action*: `getAddresses()`

#### Tạo địa chỉ mới
- *Action*: `createAddress(data)`
- *Trường*:

  | Trường | Kiểu | Bắt buộc | Mô tả |
  | :--- | :--- | :--- | :--- |
  | `title` | String | Không | Nhãn địa chỉ (VD: "Nhà", "Công ty") |
  | `name` | String | Có | Tên người nhận |
  | `phone` | String | Có | Số điện thoại |
  | `address` | String | Có | Địa chỉ đầy đủ |
  | `isDefault` | Boolean | Không | Đặt làm địa chỉ mặc định |

#### Cập nhật địa chỉ
- *Action*: `updateAddress(id, data)` — trường tương tự `createAddress`

#### Xóa địa chỉ
- *Action*: `deleteAddress(id)`

#### Đặt địa chỉ mặc định
- *Action*: `setDefaultAddress(id)`

---

### 7.7 Yêu cầu rút tiền (Seller)
- *Action*: `requestWithdrawal(formData)` hoặc `requestWithdrawal(amount)`
- *Yêu cầu xác thực*: Có
- *Trường nhập liệu*:

  | Trường | Kiểu | Bắt buộc | Mô tả |
  | :--- | :--- | :--- | :--- |
  | `amount` | Number | Có | Số tiền muốn rút (> 0) |

- *Điều kiện*: Tài khoản ngân hàng phải được cập nhật trước. Số dư khả dụng phải đủ.
- *Phản hồi lỗi*:
  - `"Vui lòng cập nhật thông tin ngân hàng trước khi rút tiền"`
  - `"Số dư khả dụng không đủ"`

---

## 8. Server Actions — Đơn hàng

### 8.1 Xác nhận đơn hàng (Seller)
- *Action*: `confirmOrder(subOrderId)`
- *Yêu cầu*: Seller sở hữu đơn, trạng thái `PENDING`

### 8.2 Đóng gói đơn hàng (Seller)
- *Action*: `packOrder(subOrderId)`
- *Yêu cầu*: Seller sở hữu đơn, trạng thái `CONFIRMED`

### 8.3 Cập nhật mã vận đơn (Seller)
- *Action*: `updateTrackingCode(subOrderId, formData)`
- *Trường nhập liệu*:

  | Trường | Kiểu | Bắt buộc | Mô tả |
  | :--- | :--- | :--- | :--- |
  | `trackingCode` | String | Có | Mã vận đơn từ đơn vị vận chuyển |

- *Yêu cầu*: Seller sở hữu đơn, trạng thái `PACKED`. Chuyển trạng thái sang `SHIPPING`.

### 8.4 Hoàn tất đơn hàng (Buyer / Admin)
- *Action*: `completeOrder(subOrderId)`
- *Yêu cầu*: Buyer của đơn hoặc Admin
- *Luồng*: Giải ngân tiền từ escrow sang ví seller, cộng điểm cho buyer (1 điểm / 1.000 VND), cập nhật hạng thành viên.

### 8.5 Hủy đơn hàng
- *Action*: `cancelOrder(subOrderId)`
- *Yêu cầu*: Seller, Buyer hoặc Admin. Chỉ hủy được khi trạng thái `PENDING` (trừ Admin).
- *Luồng*: Hoàn tiền về ví buyer, khôi phục tồn kho sách.

### 8.6 Cập nhật trạng thái đơn hàng (Admin / Seller)
- *Action*: `updateOrderStatus(subOrderId, status)`
- *Yêu cầu*: Seller sở hữu đơn hoặc Admin

---

## 9. Server Actions — Đánh giá

### 9.1 Đăng đánh giá
- *Action*: `postReview(subOrderId, rating, comment)`
- *Yêu cầu*: Đơn hàng phải ở trạng thái `COMPLETED`, chưa có đánh giá trước đó
- *Tham số*:

  | Trường | Kiểu | Bắt buộc | Mô tả |
  | :--- | :--- | :--- | :--- |
  | `subOrderId` | String | Có | ID đơn hàng con |
  | `rating` | Number | Có | Điểm đánh giá |
  | `comment` | String | Có | Nội dung đánh giá |

### 9.2 Xóa đánh giá (Admin)
- *Action*: `deleteReview(reviewId)`

### 9.3 Phản hồi đánh giá (Seller / Admin)
- *Action*: `replyToReview(reviewId, content)`
- *Yêu cầu*: Seller sở hữu sách hoặc Admin

---

## 10. Server Actions — Offer (Đề nghị giá)

### 10.1 Tạo offer
- *Action*: `createOffer({ buyerId, sellerId, bookId, amount, message? })`
- *Tham số*:

  | Trường | Kiểu | Bắt buộc | Mô tả |
  | :--- | :--- | :--- | :--- |
  | `buyerId` | String | Có | ID người mua |
  | `sellerId` | String | Có | ID người bán |
  | `bookId` | String | Có | ID sách |
  | `amount` | Number | Có | Giá đề nghị |
  | `message` | String | Không | Lời nhắn kèm theo |

- *Ghi chú*: Tự động gửi thông báo cho seller.

### 10.2 Phản hồi offer (Seller)
- *Action*: `respondToOffer(offerId, status)`
- *Tham số*:

  | Trường | Kiểu | Bắt buộc | Mô tả |
  | :--- | :--- | :--- | :--- |
  | `offerId` | String | Có | ID offer |
  | `status` | String | Có | `ACCEPTED` hoặc `REJECTED` |

- *Ghi chú*: Tự động gửi thông báo cho buyer.

---

## 11. Server Actions — Thông báo

### 11.1 Lấy danh sách thông báo
- *Action*: `getNotifications(userId)`

### 11.2 Đánh dấu đã đọc một thông báo
- *Action*: `markAsRead(notificationId)`

### 11.3 Đánh dấu tất cả đã đọc
- *Action*: `markAllAsRead(userId)`

### 11.4 Đếm thông báo chưa đọc
- *Action*: `getUnreadCount(userId)`

---

## 12. Server Actions — Yêu thích

### 12.1 Thêm / bỏ yêu thích
- *Action*: `toggleFavorite(bookId)`
- *Yêu cầu xác thực*: Có
- *Phản hồi*: `{ success: true, isFavorite: boolean }`

### 12.2 Lấy danh sách yêu thích
- *Action*: `getFavorites()`
- *Yêu cầu xác thực*: Có

### 12.3 Kiểm tra sách có trong yêu thích không
- *Action*: `isBookFavorite(bookId)`

---

## 13. Server Actions — Ghi chú riêng tư

### 13.1 Lưu ghi chú
- *Action*: `savePrivateNote(bookId, content)`
- *Yêu cầu xác thực*: Có
- *Ghi chú*: Nếu `content` rỗng, ghi chú sẽ bị xóa. Dùng upsert nên tạo mới hoặc cập nhật tự động.

### 13.2 Lấy ghi chú
- *Action*: `getPrivateNote(bookId)`
- *Yêu cầu xác thực*: Có. Trả về `""` nếu chưa có ghi chú.

---

## 14. Server Actions — Quên mật khẩu

### 14.1 Yêu cầu đặt lại mật khẩu
- *Action*: `requestPasswordReset(email)`
- *Luồng*: Tạo OTP 6 chữ số, lưu vào DB với thời hạn 1 giờ, gửi qua Gmail.
- *Phản hồi thành công*:
  ```json
  {
    "success": true,
    "message": "Mã OTP đã được gửi đến email ..."
  }
  ```
- *Phản hồi lỗi*:
  ```json
  {
    "success": false,
    "error": "Email không tồn tại trong hệ thống"
  }
  ```

### 14.2 Đặt lại mật khẩu
- *Action*: `resetPassword(token, password)`
- *Tham số*:

  | Trường | Kiểu | Bắt buộc | Mô tả |
  | :--- | :--- | :--- | :--- |
  | `token` | String | Có | OTP 6 chữ số nhận qua email |
  | `password` | String | Có | Mật khẩu mới |

- *Phản hồi lỗi*: `"Mã khôi phục không hợp lệ hoặc đã hết hạn"`

---

## 15. Server Actions — Tài chính (Admin)

### 15.1 Duyệt yêu cầu rút tiền
- *Action*: `approveWithdrawal(transactionId)`
- *Yêu cầu xác thực*: Có, role `ADMIN`
- *Tham số*:

  | Trường | Kiểu | Bắt buộc | Mô tả |
  | :--- | :--- | :--- | :--- |
  | `transactionId` | String | Có | ID giao dịch rút tiền đang chờ duyệt |

- *Luồng*: Cập nhật trạng thái giao dịch từ `WITHDRAW_PENDING` sang `WITHDRAW_SUCCESS`.

---

## 16. Trạng thái đơn hàng (SubOrder Status Flow)

```
PENDING → CONFIRMED → PACKED → SHIPPING → DELIVERED → COMPLETED
                                                ↓
                                           DISPUTED → REFUNDED
                                                ↓
                                           (Admin) → COMPLETED hoặc REFUNDED
```

| Trạng thái | Mô tả |
| :--- | :--- |
| `PENDING` | Chờ seller xác nhận |
| `CONFIRMED` | Seller đã xác nhận |
| `PACKED` | Đã đóng gói |
| `SHIPPING` | Đang giao hàng |
| `DELIVERED` | Đã giao |
| `COMPLETED` | Hoàn tất, tiền giải ngân cho seller |
| `DISPUTED` | Đang có khiếu nại |
| `REFUNDED` | Đã hoàn tiền cho buyer |

---

## 17. Hạng thành viên (Rank)

| Hạng | Điểm tối thiểu |
| :--- | :--- |
| `BRONZE` | 0 |
| `SILVER` | 1.000 |
| `GOLD` | 5.000 |
| `PLATINUM` | 10.000 |

- Điểm tích lũy: 1 điểm / 1.000 VND khi hoàn tất đơn hàng.
- Hạng ảnh hưởng đến điều kiện sử dụng một số voucher (`minRank`).
