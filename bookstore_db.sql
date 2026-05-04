-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th5 04, 2026 lúc 08:15 PM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `bookstore_db`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `book`
--

CREATE TABLE `book` (
  `id` varchar(191) NOT NULL,
  `sellerId` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `price` decimal(15,2) NOT NULL,
  `stockQuantity` int(11) NOT NULL DEFAULT 1,
  `condition` enum('NEW_100','LIKE_NEW','GOOD','OLD') NOT NULL DEFAULT 'GOOD',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `category` enum('LITERATURE','CHILDRENS','COMICS','TEXTBOOK','ECONOMY','SKILLS','OTHERS') NOT NULL DEFAULT 'OTHERS',
  `author` varchar(191) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `imageUrl` text DEFAULT NULL,
  `isbn` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `book`
--

INSERT INTO `book` (`id`, `sellerId`, `title`, `price`, `stockQuantity`, `condition`, `createdAt`, `updatedAt`, `category`, `author`, `description`, `imageUrl`, `isbn`) VALUES
('00d81648-d73d-4ad4-a179-c136d9c5b1fe', 'ba78aabc-4a35-45af-b975-3f72603e952c', 'Đắc Nhân Tâm', 108000.00, 10, 'NEW_100', '2026-05-03 13:37:02.590', '2026-05-03 16:58:37.212', 'SKILLS', 'Dale Carnegie', 'Nghệ thuật thu phục lòng người đỉnh cao và thành công trong cuộc sống.', 'https://salt.tikicdn.com/cache/w1200/ts/product/db/09/a5/4892e37b77ddf3b9883e489a2151e7bf.jpg', '9786045880623'),
('04e70817-5f48-4001-a2aa-939f226b0b50', 'ba78aabc-4a35-45af-b975-3f72603e952c', 'Quốc Gia Khởi Nghiệp', 135000.00, 10, 'NEW_100', '2026-05-03 13:37:02.673', '2026-05-03 16:58:37.212', 'ECONOMY', 'Dan Senor & Saul Singer', 'Câu chuyện về tinh thần khởi nghiệp mãnh liệt của dân tộc Israel.', 'https://salt.tikicdn.com/cache/w1200/ts/product/18/69/34/4952047a0664f3316f466b043236e3c8.jpg', '9786041123456'),
('05b1286a-86ca-41de-810f-0ed281b93b59', 'ba78aabc-4a35-45af-b975-3f72603e952c', 'Những Cuộc Phiêu Lưu Của Tom Sawyer', 110000.00, 10, 'NEW_100', '2026-05-03 13:37:02.735', '2026-05-03 16:58:37.212', 'CHILDRENS', 'Mark Twain', 'Những trò nghịch ngợm và lòng dũng cảm của cậu bé Tom Sawyer.', 'https://salt.tikicdn.com/cache/w1200/media/catalog/product/i/m/img823_7.jpg', '9786041001122'),
('0640a8c4-c7f0-4cd3-82a1-9a14402cc583', 'ba78aabc-4a35-45af-b975-3f72603e952c', 'Mắt Biếc', 110000.00, 10, 'NEW_100', '2026-05-03 14:02:18.623', '2026-05-03 16:58:37.212', 'LITERATURE', 'Nguyễn Nhật Ánh', 'Câu chuyện tình buồn giữa Ngạn và Hà Lan, tác phẩm kinh điển của Nguyễn Nhật Ánh.', 'https://salt.tikicdn.com/cache/w1200/ts/product/f9/16/7b/c1a9c8c6f609511fdddef5fc4e728d7e.jpg', '9786041147560'),
('0b64593c-19bf-434d-8239-c0c949e0dae2', 'ba78aabc-4a35-45af-b975-3f72603e952c', 'Sức Mạnh Của Hiện Tại', 115000.00, 10, 'NEW_100', '2026-05-03 14:02:18.762', '2026-05-03 16:58:37.212', 'SKILLS', 'Eckhart Tolle', 'Hướng dẫn tìm kiếm sự bình yên và giác ngộ ngay trong thực tại.', 'https://salt.tikicdn.com/cache/w1200/ts/product/bf/87/95/c943c5c65ede2780830da4306ed2e029.jpg', '9786045987654'),
('1043e10b-b029-4990-9121-d347e38ef9b6', 'ba78aabc-4a35-45af-b975-3f72603e952c', '7 Thói Quen Để Thành Đạt', 145000.00, 10, 'NEW_100', '2026-05-03 13:37:02.664', '2026-05-03 16:58:37.212', 'SKILLS', 'Stephen R. Covey', 'Những nguyên tắc nền tảng để phát triển bản thân và đạt hiệu quả công việc.', 'https://salt.tikicdn.com/cache/w1200/ts/product/f4/64/09/b39d1b643a60f9518d1a108b35048759.jpg', '9786045654321'),
('1079c4ba-d7b0-427b-862b-f7c82e1ac88d', 'ba78aabc-4a35-45af-b975-3f72603e952c', 'Mắt Biếc', 110000.00, 10, 'NEW_100', '2026-05-03 13:37:02.597', '2026-05-03 16:58:37.212', 'LITERATURE', 'Nguyễn Nhật Ánh', 'Câu chuyện tình buồn giữa Ngạn và Hà Lan, tác phẩm kinh điển của Nguyễn Nhật Ánh.', 'https://salt.tikicdn.com/cache/w1200/ts/product/f9/16/7b/c1a9c8c6f609511fdddef5fc4e728d7e.jpg', '9786041147560'),
('13fc4f26-4ae7-4ccd-9f15-8f0aff6899b6', 'ba78aabc-4a35-45af-b975-3f72603e952c', 'Thám Tử Lừng Danh Conan - Tập 1', 25000.00, 10, 'NEW_100', '2026-05-03 14:02:18.662', '2026-05-03 16:58:37.212', 'COMICS', 'Gosho Aoyama', 'Khởi đầu của thám tử trung học bị teo nhỏ thành học sinh lớp 1.', 'https://salt.tikicdn.com/cache/w1200/ts/product/e3/47/b5/52a095864ab48b5168e69a258bb16e22.jpg', '9786042123456'),
('1be1d50e-b151-40c0-bfe3-855982f6b699', 'ba78aabc-4a35-45af-b975-3f72603e952c', 'Cho Tôi Xin Một Vé Đi Tuổi Thơ', 80000.00, 10, 'NEW_100', '2026-05-03 13:37:02.611', '2026-05-03 16:58:37.212', 'LITERATURE', 'Nguyễn Nhật Ánh', 'Cuốn sách đưa bạn trở về với những kỷ niệm tuổi thơ trong trẻo và hồn nhiên.', 'https://salt.tikicdn.com/cache/w1200/ts/product/5e/2e/d3/960309995817a0201192e4119d690a61.jpg', '9786041042780'),
('1d08b24b-2a96-483d-9e33-fa8eadc88670', 'ba78aabc-4a35-45af-b975-3f72603e952c', 'One Piece - Tập 1', 30000.00, 10, 'NEW_100', '2026-05-03 13:37:02.705', '2026-05-03 16:58:37.212', 'COMICS', 'Eiichiro Oda', 'Luffy và hành trình tìm kiếm kho báu vĩ đại nhất để trở thành Vua Hải Tặc.', 'https://salt.tikicdn.com/cache/w1200/ts/product/0a/02/05/16a86b995ce76bdaa6326388bafe41d1.jpg', '9786042123333'),
('2041d11f-0651-4dd8-ba44-6d951d0d230b', '3f224f3a-516a-4f7c-88c3-0ec3119e98d3', 'Sách Tô Màu Phát Triển Trí Não', 110000.00, 10, 'NEW_100', '2026-05-03 16:46:39.103', '2026-05-03 16:58:37.212', 'CHILDRENS', 'Phạm Ngọc Điệp', 'Giúp bé phát triển tư duy sáng tạo thông qua màu sắc.', 'https://placehold.co/600x800/ec4899/ffffff.png?text=T%C3%B4+M%C3%A0u+Ph%C3%A1t+Tri%E1%BB%83n+Tr%C3%AD+N%C3%A3o', '9786045661008'),
('240982df-f0ef-4aaa-b45c-993c900a4844', 'ba78aabc-4a35-45af-b975-3f72603e952c', 'SGK Ngữ Văn 10 - Tập 1 (Kết nối tri thức)', 40000.00, 10, 'NEW_100', '2026-05-03 14:02:18.773', '2026-05-03 16:58:37.212', 'TEXTBOOK', 'Nhiều tác giả', 'Sách giáo khoa Ngữ Văn lớp 10 chương trình mới.', 'https://salt.tikicdn.com/cache/w1200/ts/product/37/ac/4c/4e607f508d2855e1439d0ce796e0af80.jpg', '9786040123000'),
('2463d8e6-9e53-4af3-80cd-265859982bc8', '3f224f3a-516a-4f7c-88c3-0ec3119e98d3', 'Sobotei Dinh Thự Ma Ám', 37000.00, 10, 'NEW_100', '2026-05-03 16:46:39.148', '2026-05-03 16:58:37.212', 'COMICS', 'Kazuhiro Fujita', 'Kinh dị và bí ẩn xoay quanh dinh thự Sobotei.', 'https://placehold.co/600x800/111827/ffffff.png?text=Sobotei+Dinh+Th%E1%BB%B1+Ma+%C3%81m', '9786045661015'),
('24c327ea-4b18-4e31-8e13-a426fd6cca23', 'ba78aabc-4a35-45af-b975-3f72603e952c', 'Chiến Tranh Tiền Tệ', 150000.00, 10, 'NEW_100', '2026-05-03 13:37:02.678', '2026-05-03 16:58:37.212', 'ECONOMY', 'Song Hongbing', 'Sự thật về lịch sử tiền tệ và các thế lực tài chính đứng sau thế giới.', 'https://salt.tikicdn.com/cache/w1200/ts/product/42/8e/a8/b37ba7c1b7e93b093cda29cd30ce36cd.jpg', '9786041234567'),
('2e1cc949-5477-4968-9ec7-acdf735491b6', 'ba78aabc-4a35-45af-b975-3f72603e952c', 'Thám Tử Lừng Danh Conan - Tập 1', 25000.00, 10, 'NEW_100', '2026-05-03 13:37:02.635', '2026-05-03 16:58:37.212', 'COMICS', 'Gosho Aoyama', 'Khởi đầu của thám tử trung học bị teo nhỏ thành học sinh lớp 1.', 'https://salt.tikicdn.com/cache/w1200/ts/product/e3/47/b5/52a095864ab48b5168e69a258bb16e22.jpg', '9786042123456'),
('342687fa-138f-4ac3-99b3-bd249238cfae', 'ba78aabc-4a35-45af-b975-3f72603e952c', 'Dragon Ball - Tập 1', 30000.00, 10, 'NEW_100', '2026-05-03 14:02:18.729', '2026-05-03 16:58:37.212', 'COMICS', 'Akira Toriyama', 'Hành trình tìm kiếm 7 viên ngọc rồng huyền thoại của Son Goku.', 'https://salt.tikicdn.com/cache/w1200/ts/product/24/85/65/560413e13bde38316081865a82ab8df1.jpg', '9786042123111'),
('343b39f3-3135-4a91-a80e-ef532ff4f6c9', 'ba78aabc-4a35-45af-b975-3f72603e952c', 'SGK Toán 1 - Tập 1 (Kết nối tri thức)', 35000.00, 10, 'NEW_100', '2026-05-03 14:02:18.673', '2026-05-03 16:58:37.212', 'TEXTBOOK', 'Nhiều tác giả', 'Sách giáo khoa Toán lớp 1 theo chương trình GDPT mới.', 'https://salt.tikicdn.com/cache/w1200/ts/product/79/f1/3c/3624d5af1b562c5e6ba6b3e07de7c7ae.jpg', '9786040123456'),
('3efeb1f6-860d-46bb-8182-6328ff077d03', '3f224f3a-516a-4f7c-88c3-0ec3119e98d3', 'Ai Tăng Lương Cho Bạn?', 143000.00, 10, 'NEW_100', '2026-05-03 16:46:39.051', '2026-05-03 16:58:37.212', 'SKILLS', 'Nguyễn Quốc Tuấn', '3 Bí Quyết Đơn Giản Để Thăng Tiến Và Hạnh Phúc Trong Công Việc.', 'https://placehold.co/600x800/10b981/ffffff.png?text=Ai+T%C4%83ng+L%C6%B0%C6%A1ng+Cho+B%E1%BA%A1n%3F', '9786045661001'),
('40041003-0bb5-4eb2-bf26-02b963b78d1a', 'ba78aabc-4a35-45af-b975-3f72603e952c', 'Bí Mật Tư Duy Triệu Phú', 95000.00, 10, 'NEW_100', '2026-05-03 13:37:02.669', '2026-05-03 16:58:37.212', 'ECONOMY', 'T. Harv Eker', 'Thay đổi tư duy tài chính để đạt được sự giàu có bền vững.', 'https://salt.tikicdn.com/cache/w1200/ts/product/9e/a3/34/747ac6de3d6faaa7c036eab9b89fa254.jpg', '9786045851456'),
('41ccc7c8-7414-4b04-b4bf-e7f45826384f', 'ba78aabc-4a35-45af-b975-3f72603e952c', 'Cho Tôi Xin Một Vé Đi Tuổi Thơ', 80000.00, 10, 'NEW_100', '2026-05-03 14:02:18.635', '2026-05-03 16:58:37.212', 'LITERATURE', 'Nguyễn Nhật Ánh', 'Cuốn sách đưa bạn trở về với những kỷ niệm tuổi thơ trong trẻo và hồn nhiên.', 'https://salt.tikicdn.com/cache/w1200/ts/product/5e/2e/d3/960309995817a0201192e4119d690a61.jpg', '9786041042780'),
('43faeb24-eef5-42c4-bbd1-f4f8d98338ed', '3f224f3a-516a-4f7c-88c3-0ec3119e98d3', 'Sách Bài Tập Lớp 9', 37000.00, 10, 'NEW_100', '2026-05-03 16:46:39.180', '2026-05-03 16:58:37.212', 'TEXTBOOK', 'Nhiều Tác Giả', 'Tổng hợp bài tập các môn học sinh lớp 9.', 'https://placehold.co/600x800/166534/ffffff.png?text=B%C3%A0i+T%E1%BA%ADp+L%E1%BB%9Bp+9', NULL),
('46172dd6-279d-4bbd-8243-0784cd7c3d58', '3f224f3a-516a-4f7c-88c3-0ec3119e98d3', 'Ngữ Pháp Tiếng Hàn Thông Dụng', 236000.00, 10, 'NEW_100', '2026-05-03 16:46:39.110', '2026-05-03 16:58:37.212', 'TEXTBOOK', 'Nhiều Tác Giả', 'Tài liệu học tiếng Hàn thiết yếu cho người mới bắt đầu.', 'https://placehold.co/600x800/2563eb/ffffff.png?text=Ng%E1%BB%AF+Ph%C3%A1p+Ti%E1%BA%BFng+H%C3%A0n', '9786045661009'),
('4c2ae1b5-a51a-410d-8649-553ca12baa08', '3f224f3a-516a-4f7c-88c3-0ec3119e98d3', 'Thanh Gươm Diệt Quỷ 9', 24000.00, 10, 'NEW_100', '2026-05-03 16:46:39.123', '2026-05-03 16:58:37.212', 'COMICS', 'Koyoharu Gotouge', 'Hành trình diệt quỷ đầy gian nan và cảm động.', 'https://placehold.co/600x800/7c3aed/ffffff.png?text=Thanh+G%C6%B0%C6%A1m+Di%E1%BB%87t+Qu%E1%BB%B7+9', '9786045661011'),
('4f394b45-8ade-4c19-b1cb-53e9c1c65dc6', 'ba78aabc-4a35-45af-b975-3f72603e952c', 'Cây Cam Ngọt Của Tôi', 100000.00, 10, 'NEW_100', '2026-05-03 14:02:18.650', '2026-05-03 16:58:37.212', 'LITERATURE', 'José Mauro de Vasconcelos', 'Câu chuyện cảm động về chú bé Zezé và người bạn đặc biệt - cây cam ngọt.', 'https://salt.tikicdn.com/cache/w1200/ts/product/5e/18/24/2a6154ba08df6ce6161c13f4303fa19e.jpg', '9786045880623'),
('520ab8f5-4855-4e99-a195-fb5aa3a017df', 'ba78aabc-4a35-45af-b975-3f72603e952c', 'Doraemon - Tập 1 (Truyện ngắn)', 28000.00, 10, 'NEW_100', '2026-05-03 13:37:02.640', '2026-05-03 16:58:37.212', 'COMICS', 'Fujiko F. Fujio', 'Chú mèo máy thông minh đến từ tương lai giúp đỡ cậu bé Nobita.', 'https://salt.tikicdn.com/cache/w1200/ts/product/28/5f/e3/8627a1395e08a75a49a6de654d2b042f.jpg', '9786042123789'),
('5aaccc6e-2bd0-47ab-af21-129b23d472b5', 'ba78aabc-4a35-45af-b975-3f72603e952c', 'Cha Giàu Cha Nghèo', 85000.00, 10, 'NEW_100', '2026-05-03 13:37:02.604', '2026-05-03 16:58:37.212', 'ECONOMY', 'Robert T. Kiyosaki', 'Những bài học về tài chính và cách người giàu dạy con về tiền bạc.', 'https://salt.tikicdn.com/cache/w1200/ts/product/82/4b/35/cc475d622f717f84cfd6e5a2465842e0.jpg', '9786041065116'),
('5f9ae638-d3ae-4600-97aa-7d8434fc1b7d', 'ba78aabc-4a35-45af-b975-3f72603e952c', 'SGK Ngữ Văn 10 - Tập 1 (Kết nối tri thức)', 40000.00, 10, 'NEW_100', '2026-05-03 13:37:02.740', '2026-05-03 16:58:37.212', 'TEXTBOOK', 'Nhiều tác giả', 'Sách giáo khoa Ngữ Văn lớp 10 chương trình mới.', 'https://salt.tikicdn.com/cache/w1200/ts/product/37/ac/4c/4e607f508d2855e1439d0ce796e0af80.jpg', '9786040123000'),
('61389509-37cc-4b59-ba6f-ca6f5fec7667', 'ba78aabc-4a35-45af-b975-3f72603e952c', 'Muôn Kiếp Nhân Sinh - Tập 1', 175000.00, 10, 'NEW_100', '2026-05-03 13:37:02.650', '2026-05-03 16:58:37.212', 'OTHERS', 'Nguyên Phong', 'Khám phá luật nhân quả, luân hồi và những bí ẩn của vũ trụ.', 'https://salt.tikicdn.com/cache/w1200/ts/product/1c/01/ea/6de2d9ffdbc7142e33c387332440adee.jpg', '9786041009999'),
('679bfd12-85f7-438d-8939-407ce3fef532', 'ba78aabc-4a35-45af-b975-3f72603e952c', 'One Piece - Tập 1', 30000.00, 10, 'NEW_100', '2026-05-03 14:02:18.739', '2026-05-03 16:58:37.212', 'COMICS', 'Eiichiro Oda', 'Luffy và hành trình tìm kiếm kho báu vĩ đại nhất để trở thành Vua Hải Tặc.', 'https://salt.tikicdn.com/cache/w1200/ts/product/0a/02/05/16a86b995ce76bdaa6326388bafe41d1.jpg', '9786042123333'),
('6d7c4a2c-a856-4213-8eb6-1ab4818ea524', 'ba78aabc-4a35-45af-b975-3f72603e952c', 'Dế Mèn Phiêu Lưu Ký', 150000.00, 10, 'NEW_100', '2026-05-03 14:02:18.656', '2026-05-03 16:58:37.212', 'CHILDRENS', 'Tô Hoài', 'Tác phẩm thiếu nhi kinh điển nhất Việt Nam kể về hành trình của chú Dế Mèn.', 'https://salt.tikicdn.com/cache/w1200/ts/product/47/54/8e/30bac752bcca2beb34a3522990805aa1.jpg', '9786041001234'),
('6fc25dec-04b6-4778-b0c0-7a07bebce16c', 'ba78aabc-4a35-45af-b975-3f72603e952c', 'Dragon Ball - Tập 1', 30000.00, 10, 'NEW_100', '2026-05-03 13:37:02.693', '2026-05-03 16:58:37.212', 'COMICS', 'Akira Toriyama', 'Hành trình tìm kiếm 7 viên ngọc rồng huyền thoại của Son Goku.', 'https://salt.tikicdn.com/cache/w1200/ts/product/24/85/65/560413e13bde38316081865a82ab8df1.jpg', '9786042123111'),
('7242c72d-2aa5-4ced-a388-c607e4ef23b6', 'ba78aabc-4a35-45af-b975-3f72603e952c', 'Đọc Vị Bất Kỳ Ai', 90000.00, 10, 'NEW_100', '2026-05-03 14:02:18.758', '2026-05-03 16:58:37.212', 'SKILLS', 'David J. Lieberman', 'Kỹ thuật xâm nhập vào tâm trí người khác để thấu hiểu suy nghĩ của họ.', 'https://salt.tikicdn.com/cache/w1200/ts/product/a5/d8/34/841d0260cc305115f6753c25caadd5b0.jpg', '9786045123456'),
('758cbaa5-45f0-4447-9629-61ef63f71bbc', 'ba78aabc-4a35-45af-b975-3f72603e952c', 'Clean Code', 450000.00, 10, 'NEW_100', '2026-05-03 13:25:21.384', '2026-05-03 16:58:37.212', 'OTHERS', 'Robert C. Martin', 'A Handbook of Agile Software Craftsmanship.', 'https://m.media-amazon.com/images/I/41xShlnTZTL._SX376_BO1,204,203,200_.jpg', '9780132350884'),
('76ebebab-c3e3-4827-8ed4-d730c3e7298e', 'ba78aabc-4a35-45af-b975-3f72603e952c', 'Không Gia Đình', 120000.00, 10, 'NEW_100', '2026-05-03 14:02:18.719', '2026-05-03 16:58:37.212', 'CHILDRENS', 'Hector Malot', 'Cuộc hành trình vượt qua nghịch cảnh đầy cảm động của cậu bé Remi.', 'https://salt.tikicdn.com/cache/w1200/ts/product/2e/f1/b7/c7b6f6d0f66e01a0a5522776c5b05c5c.jpg', '9786041005678'),
('7a09ec5e-0e88-4b38-8bc3-8f12e9149ce7', 'ba78aabc-4a35-45af-b975-3f72603e952c', 'Nhà Giả Kim', 90000.00, 10, 'NEW_100', '2026-05-03 13:37:02.579', '2026-05-03 16:58:37.212', 'LITERATURE', 'Paulo Coelho', 'Cuộc hành trình theo đuổi ước mơ của Santiago, cuốn sách bán chạy nhất mọi thời đại.', 'https://salt.tikicdn.com/cache/w1200/ts/product/85/51/24/4c11429f1cca16835e872b5d4318af23.jpg', '9786045661031'),
('7adcefb0-31b9-480e-a8fd-5c65f1d65c45', '3f224f3a-516a-4f7c-88c3-0ec3119e98d3', 'Sứ Mệnh Hail Mary', 161000.00, 10, 'NEW_100', '2026-05-03 16:46:39.129', '2026-05-03 16:58:37.212', 'LITERATURE', 'Andy Weir', 'Một mình giữa không gian để cứu vãn Trái Đất.', 'https://placehold.co/600x800/1e40af/ffffff.png?text=S%E1%BB%A9+M%E1%BB%87nh+Hail+Mary', '9786045661012'),
('7e80884f-c151-46fc-8c6c-7d833d272ae1', 'ba78aabc-4a35-45af-b975-3f72603e952c', 'Quẳng Gánh Lo Đi Và Vui Sống', 85000.00, 10, 'NEW_100', '2026-05-03 13:37:02.660', '2026-05-03 16:58:37.212', 'SKILLS', 'Dale Carnegie', 'Hướng dẫn chi tiết cách loại bỏ lo âu và tận hưởng niềm vui mỗi ngày.', 'https://salt.tikicdn.com/cache/w1200/ts/product/fd/e3/d8/6b2e3e56a1b0a8f8e8e6e5a6b7e6e5a6.jpg', '9786045678901'),
('80c2374b-8c5e-412b-8c6b-d4c98b0def0e', 'ba78aabc-4a35-45af-b975-3f72603e952c', 'Naruto - Tập 1', 30000.00, 10, 'NEW_100', '2026-05-03 14:02:18.734', '2026-05-03 16:58:37.212', 'COMICS', 'Masashi Kishimoto', 'Ước mơ trở thành Hokage của cậu bé Naruto bị mọi người xa lánh.', 'https://salt.tikicdn.com/cache/w1200/ts/product/00/01/24/e989791444d3202996d9f7962451f5c6.jpg', '9786042123222'),
('817ae119-f405-4fb2-8b9f-9f7fad78edf9', 'ba78aabc-4a35-45af-b975-3f72603e952c', 'Nhà Đầu Tư Thông Minh', 180000.00, 10, 'NEW_100', '2026-05-03 14:02:18.683', '2026-05-03 16:58:37.212', 'ECONOMY', 'Benjamin Graham', 'Cuốn sách gối đầu giường về đầu tư giá trị cho mọi nhà đầu tư.', 'https://salt.tikicdn.com/cache/w1200/ts/product/8f/cf/60/58181c83ee8614f4955786adfd1711b1.jpg', '9786045892558'),
('85931ab3-431f-4eef-80cb-40495ba9e4a1', '3f224f3a-516a-4f7c-88c3-0ec3119e98d3', 'Thương Tiến Tửu', 119000.00, 10, 'NEW_100', '2026-05-03 16:46:39.166', '2026-05-03 16:58:37.212', 'LITERATURE', 'Đường Tửu Khanh', 'Tiểu thuyết đam mỹ quyền mưu đặc sắc.', 'https://placehold.co/600x800/9d174d/ffffff.png?text=Th%C6%B0%C6%A1ng+Ti%E1%BA%BFn+T%E1%BB%ADu', '9786045661018'),
('8721db0f-0678-4d9d-b55b-f97f819b9b3d', 'ba78aabc-4a35-45af-b975-3f72603e952c', 'Đắc Nhân Tâm', 85000.00, 10, 'LIKE_NEW', '2026-05-03 13:25:21.365', '2026-05-03 16:58:37.212', 'SKILLS', 'Dale Carnegie', 'Cuốn sách hay nhất mọi thời đại về nghệ thuật giao tiếp.', 'https://salt.tikicdn.com/cache/w1200/ts/product/db/09/a5/4892e37b77ddf3b9883e489a2151e7bf.jpg', '9786045880623'),
('87ee38c0-e7d7-4d28-806a-893cebd85999', 'ba78aabc-4a35-45af-b975-3f72603e952c', 'Đắc Nhân Tâm', 108000.00, 10, 'NEW_100', '2026-05-03 14:02:18.617', '2026-05-03 16:58:37.212', 'SKILLS', 'Dale Carnegie', 'Nghệ thuật thu phục lòng người đỉnh cao và thành công trong cuộc sống.', 'https://salt.tikicdn.com/cache/w1200/ts/product/db/09/a5/4892e37b77ddf3b9883e489a2151e7bf.jpg', '9786045880623'),
('8a845285-6192-45d8-bf1f-8b6ca84e60f1', 'ba78aabc-4a35-45af-b975-3f72603e952c', 'Pippi Tất Dài', 95000.00, 10, 'NEW_100', '2026-05-03 14:02:18.725', '2026-05-03 16:58:37.212', 'CHILDRENS', 'Astrid Lindgren', 'Cô bé mạnh nhất thế giới với những cuộc phiêu lưu đầy bất ngờ.', 'https://salt.tikicdn.com/cache/w1200/ts/product/69/83/22/e99120d0c0512164f08049f6c323a237.jpg', '9786041009876'),
('8deea47f-da3c-4e60-8b1a-edd42246945a', 'ba78aabc-4a35-45af-b975-3f72603e952c', 'Doraemon - Tập 1 (Truyện ngắn)', 28000.00, 10, 'NEW_100', '2026-05-03 14:02:18.667', '2026-05-03 16:58:37.212', 'COMICS', 'Fujiko F. Fujio', 'Chú mèo máy thông minh đến từ tương lai giúp đỡ cậu bé Nobita.', 'https://salt.tikicdn.com/cache/w1200/ts/product/28/5f/e3/8627a1395e08a75a49a6de654d2b042f.jpg', '9786042123789'),
('913ac9d1-b147-4db3-91bc-a04395dd58f1', 'ba78aabc-4a35-45af-b975-3f72603e952c', 'SGK Tiếng Việt 1 - Tập 1 (Kết nối tri thức)', 35000.00, 10, 'NEW_100', '2026-05-03 14:02:18.743', '2026-05-03 16:58:37.212', 'TEXTBOOK', 'Nhiều tác giả', 'Sách giáo khoa Tiếng Việt giúp trẻ làm quen với chữ cái và cách đọc.', 'https://salt.tikicdn.com/cache/w1200/ts/product/2b/b9/88/d77b6d6910609658e8066e13f4997148.jpg', '9786040123789'),
('9312e5b9-2f1b-4096-98ac-6e54f78900c2', 'ba78aabc-4a35-45af-b975-3f72603e952c', 'SGK Toán 1 - Tập 1 (Kết nối tri thức)', 35000.00, 10, 'NEW_100', '2026-05-03 13:37:02.645', '2026-05-03 16:58:37.212', 'TEXTBOOK', 'Nhiều tác giả', 'Sách giáo khoa Toán lớp 1 theo chương trình GDPT mới.', 'https://salt.tikicdn.com/cache/w1200/ts/product/79/f1/3c/3624d5af1b562c5e6ba6b3e07de7c7ae.jpg', '9786040123456'),
('954bfaeb-5409-440b-bd8d-7526546a100c', '3f224f3a-516a-4f7c-88c3-0ec3119e98d3', 'Kẻ Trộm Cà Chua', 72000.00, 10, 'NEW_100', '2026-05-03 16:46:39.154', '2026-05-03 16:58:37.212', 'LITERATURE', 'Barbara Constantine', 'Tiểu thuyết Pháp ấm áp về tình người.', 'https://placehold.co/600x800/be123c/ffffff.png?text=K%E1%BA%BB+Tr%E1%BB%99m+C%C3%A0+Chua', '9786045661016'),
('99dfe552-390f-4805-a52d-844566f175aa', 'ba78aabc-4a35-45af-b975-3f72603e952c', 'Đọc Vị Bất Kỳ Ai', 90000.00, 10, 'NEW_100', '2026-05-03 13:37:02.726', '2026-05-03 16:58:37.212', 'SKILLS', 'David J. Lieberman', 'Kỹ thuật xâm nhập vào tâm trí người khác để thấu hiểu suy nghĩ của họ.', 'https://salt.tikicdn.com/cache/w1200/ts/product/a5/d8/34/841d0260cc305115f6753c25caadd5b0.jpg', '9786045123456'),
('9ccf3ca5-2981-47d4-92a4-95595eb403e6', 'ba78aabc-4a35-45af-b975-3f72603e952c', 'Nhà Giả Kim', 90000.00, 10, 'NEW_100', '2026-05-03 14:02:18.608', '2026-05-03 16:58:37.212', 'LITERATURE', 'Paulo Coelho', 'Cuộc hành trình theo đuổi ước mơ của Santiago, cuốn sách bán chạy nhất mọi thời đại.', 'https://salt.tikicdn.com/cache/w1200/ts/product/85/51/24/4c11429f1cca16835e872b5d4318af23.jpg', '9786045661031'),
('9ec2f95e-0619-4467-b6f2-b6dc4355bc02', '3f224f3a-516a-4f7c-88c3-0ec3119e98d3', '150 Thủ Thuật Văn Phòng', 375000.00, 10, 'NEW_100', '2026-05-03 16:46:39.174', '2026-05-03 16:58:37.212', 'SKILLS', 'Nguyễn Quang Vinh', 'Cẩm nang không thể thiếu cho dân văn phòng.', 'https://placehold.co/600x800/0369a1/ffffff.png?text=150+Th%E1%BB%A7+Thu%E1%BA%ADt+V%C4%83n+Ph%C3%B2ng', NULL),
('9f51d5b4-ad0a-404b-8d3f-57ef4fb2d31a', 'ba78aabc-4a35-45af-b975-3f72603e952c', 'Những Cuộc Phiêu Lưu Của Tom Sawyer', 110000.00, 10, 'NEW_100', '2026-05-03 14:02:18.768', '2026-05-03 16:58:37.212', 'CHILDRENS', 'Mark Twain', 'Những trò nghịch ngợm và lòng dũng cảm của cậu bé Tom Sawyer.', 'https://salt.tikicdn.com/cache/w1200/media/catalog/product/i/m/img823_7.jpg', '9786041001122'),
('a21db86d-a430-44ca-94fe-ac1b2a4c07da', 'ba78aabc-4a35-45af-b975-3f72603e952c', 'Chiến Tranh Tiền Tệ', 150000.00, 10, 'NEW_100', '2026-05-03 14:02:18.714', '2026-05-03 16:58:37.212', 'ECONOMY', 'Song Hongbing', 'Sự thật về lịch sử tiền tệ và các thế lực tài chính đứng sau thế giới.', 'https://salt.tikicdn.com/cache/w1200/ts/product/42/8e/a8/b37ba7c1b7e93b093cda29cd30ce36cd.jpg', '9786041234567'),
('a58c45e5-8296-492a-99e0-02b17f8830de', 'ba78aabc-4a35-45af-b975-3f72603e952c', 'Nhà Đầu Tư Thông Minh', 180000.00, 10, 'NEW_100', '2026-05-03 13:37:02.655', '2026-05-03 16:58:37.212', 'ECONOMY', 'Benjamin Graham', 'Cuốn sách gối đầu giường về đầu tư giá trị cho mọi nhà đầu tư.', 'https://salt.tikicdn.com/cache/w1200/ts/product/8f/cf/60/58181c83ee8614f4955786adfd1711b1.jpg', '9786045892558'),
('a9d2fd73-4b0b-4e5a-a1ba-f1fe5103ca8c', 'ba78aabc-4a35-45af-b975-3f72603e952c', 'Cha Giàu Cha Nghèo', 85000.00, 10, 'NEW_100', '2026-05-03 14:02:18.629', '2026-05-03 16:58:37.212', 'ECONOMY', 'Robert T. Kiyosaki', 'Những bài học về tài chính và cách người giàu dạy con về tiền bạc.', 'https://salt.tikicdn.com/cache/w1200/ts/product/82/4b/35/cc475d622f717f84cfd6e5a2465842e0.jpg', '9786041065116'),
('abe91fa3-ac5d-400b-9012-1f3dfcda9c9f', 'ba78aabc-4a35-45af-b975-3f72603e952c', 'Dế Mèn Phiêu Lưu Ký', 150000.00, 10, 'NEW_100', '2026-05-03 13:37:02.630', '2026-05-03 16:58:37.212', 'CHILDRENS', 'Tô Hoài', 'Tác phẩm thiếu nhi kinh điển nhất Việt Nam kể về hành trình của chú Dế Mèn.', 'https://salt.tikicdn.com/cache/w1200/ts/product/47/54/8e/30bac752bcca2beb34a3522990805aa1.jpg', '9786041001234'),
('b14374a8-9a9c-4359-9c56-035f7553014b', '3f224f3a-516a-4f7c-88c3-0ec3119e98d3', '7 Ngày Học Kinh Doanh F&B', 162000.00, 10, 'NEW_100', '2026-05-03 16:46:39.077', '2026-05-03 16:58:37.212', 'ECONOMY', 'Thuận Nguyễn', 'Bí quyết mở quán cafe, nhà hàng thành công.', 'https://placehold.co/600x800/f59e0b/ffffff.png?text=7+Ng%C3%A0y+H%E1%BB%8Dc+Kinh+Doanh+F%26B', '9786045661004'),
('b150dfd0-a58e-46c3-8208-a269b77c8329', 'ba78aabc-4a35-45af-b975-3f72603e952c', 'Naruto - Tập 1', 30000.00, 10, 'NEW_100', '2026-05-03 13:37:02.698', '2026-05-03 16:58:37.212', 'COMICS', 'Masashi Kishimoto', 'Ước mơ trở thành Hokage của cậu bé Naruto bị mọi người xa lánh.', 'https://salt.tikicdn.com/cache/w1200/ts/product/00/01/24/e989791444d3202996d9f7962451f5c6.jpg', '9786042123222'),
('b1e748ba-6027-44e9-b6f5-61faffe32ee8', 'ba78aabc-4a35-45af-b975-3f72603e952c', 'Pippi Tất Dài', 95000.00, 10, 'NEW_100', '2026-05-03 13:37:02.688', '2026-05-03 16:58:37.212', 'CHILDRENS', 'Astrid Lindgren', 'Cô bé mạnh nhất thế giới với những cuộc phiêu lưu đầy bất ngờ.', 'https://salt.tikicdn.com/cache/w1200/ts/product/69/83/22/e99120d0c0512164f08049f6c323a237.jpg', '9786041009876'),
('b200f8cd-95c6-4620-8e8c-65505006e673', 'ba78aabc-4a35-45af-b975-3f72603e952c', 'SGK Tiếng Việt 1 - Tập 1 (Kết nối tri thức)', 35000.00, 10, 'NEW_100', '2026-05-03 13:37:02.711', '2026-05-03 16:58:37.212', 'TEXTBOOK', 'Nhiều tác giả', 'Sách giáo khoa Tiếng Việt giúp trẻ làm quen với chữ cái và cách đọc.', 'https://salt.tikicdn.com/cache/w1200/ts/product/2b/b9/88/d77b6d6910609658e8066e13f4997148.jpg', '9786040123789'),
('b733409d-72c2-4108-963e-2eab89a70e2b', 'ba78aabc-4a35-45af-b975-3f72603e952c', '7 Thói Quen Để Thành Đạt', 145000.00, 10, 'NEW_100', '2026-05-03 14:02:18.697', '2026-05-03 16:58:37.212', 'SKILLS', 'Stephen R. Covey', 'Những nguyên tắc nền tảng để phát triển bản thân và đạt hiệu quả công việc.', 'https://salt.tikicdn.com/cache/w1200/ts/product/f4/64/09/b39d1b643a60f9518d1a108b35048759.jpg', '9786045654321'),
('bad0aa65-848f-4da4-8548-19de04ab6093', 'ba78aabc-4a35-45af-b975-3f72603e952c', 'Ánh Sáng Trong Ta', 152000.00, 10, 'NEW_100', '2026-05-03 14:02:18.752', '2026-05-03 16:58:37.212', 'OTHERS', 'Michelle Obama', 'Những chia sẻ sâu sắc về cách vượt qua sự bất ổn và tìm thấy chính mình.', 'https://salt.tikicdn.com/cache/w1200/ts/product/88/cc/70/fd10f3fd1a45ea447d66a8f98b63bea0.jpg', '9786041008888'),
('be52163b-0409-480a-8ff6-6470cbe17488', 'ba78aabc-4a35-45af-b975-3f72603e952c', 'Harry Potter Và Hòn Đá Phù Thủy', 120000.00, 10, 'NEW_100', '2026-05-03 13:37:02.618', '2026-05-03 16:58:37.212', 'LITERATURE', 'J.K. Rowling', 'Phần đầu tiên của bộ truyện về cậu bé phù thủy Harry Potter nổi tiếng thế giới.', 'https://salt.tikicdn.com/cache/w1200/ts/product/54/74/4e/de11f0101d91a92e1041935e23652c7c.jpg', '9786041103719'),
('bebabed4-dd0d-4dbf-a34b-f154666c6176', '3f224f3a-516a-4f7c-88c3-0ec3119e98d3', 'Ứng Dụng AI, Excel Và Word', 522000.00, 10, 'NEW_100', '2026-05-03 16:46:39.084', '2026-05-03 16:58:37.212', 'SKILLS', 'Nguyễn Quang Vinh', 'Tối ưu hóa công việc văn phòng bằng công nghệ mới.', 'https://placehold.co/600x800/ef4444/ffffff.png?text=%E1%BB%A8ng+D%E1%BB%A5ng+AI,+Excel+V%C3%A0+Word', '9786045661005'),
('bedee49b-6189-48d7-b624-3f782af082b1', 'ba78aabc-4a35-45af-b975-3f72603e952c', 'Không Gia Đình', 120000.00, 10, 'NEW_100', '2026-05-03 13:37:02.683', '2026-05-03 16:58:37.212', 'CHILDRENS', 'Hector Malot', 'Cuộc hành trình vượt qua nghịch cảnh đầy cảm động của cậu bé Remi.', 'https://salt.tikicdn.com/cache/w1200/ts/product/2e/f1/b7/c7b6f6d0f66e01a0a5522776c5b05c5c.jpg', '9786041005678'),
('c8f69d4b-0db7-43ba-bbcd-2e0ed4bf3ca7', '3f224f3a-516a-4f7c-88c3-0ec3119e98d3', 'Hoa Thơm Kiêu Hãnh', 44000.00, 10, 'NEW_100', '2026-05-03 16:46:39.136', '2026-05-03 16:58:37.212', 'COMICS', 'Saka Mikami', 'Truyện tranh lãng mạn học đường.', 'https://placehold.co/600x800/db2777/ffffff.png?text=Hoa+Th%C6%A1m+Ki%C3%AAu+H%C3%A3nh', '9786045661013'),
('cfcfa67d-c281-407c-8cdc-b94ddbe845aa', '3f224f3a-516a-4f7c-88c3-0ec3119e98d3', 'Sống Đời Rủng Rỉnh Thong Dong', 150000.00, 10, 'NEW_100', '2026-05-03 16:46:39.064', '2026-05-03 16:58:37.212', 'ECONOMY', 'Lê Hoàng Linh', 'Quản lý tài chính cá nhân một cách thông minh.', 'https://placehold.co/600x800/3b82f6/ffffff.png?text=S%E1%BB%91ng+%C4%90%E1%BB%9Di+R%E1%BB%A7ng+R%E1%BB%89nh+Thong+Dong', '9786045661002'),
('d3c295cf-3346-4e34-8e73-d4878b92fcbd', '3f224f3a-516a-4f7c-88c3-0ec3119e98d3', 'Vì Sao Bạn Chưa Giàu?', 191000.00, 10, 'NEW_100', '2026-05-03 16:46:39.071', '2026-05-03 16:58:37.212', 'ECONOMY', 'The Simple Sum', 'Hiểu rõ về tiền bạc và cách tạo dựng tài sản.', 'https://placehold.co/600x800/8b5cf6/ffffff.png?text=V%C3%AC+Sao+B%E1%BA%A1n+Ch%C6%B0a+Gi%C3%A0u%3F', '9786045661003'),
('d505b32f-e5ef-4183-9f8b-57ab5a3399b7', 'ba78aabc-4a35-45af-b975-3f72603e952c', 'Sức Mạnh Của Hiện Tại', 115000.00, 10, 'NEW_100', '2026-05-03 13:37:02.731', '2026-05-03 16:58:37.212', 'SKILLS', 'Eckhart Tolle', 'Hướng dẫn tìm kiếm sự bình yên và giác ngộ ngay trong thực tại.', 'https://salt.tikicdn.com/cache/w1200/ts/product/bf/87/95/c943c5c65ede2780830da4306ed2e029.jpg', '9786045987654'),
('d69d75c7-867f-4a84-aee5-59705765306a', 'ba78aabc-4a35-45af-b975-3f72603e952c', 'Bí Mật Tư Duy Triệu Phú', 95000.00, 10, 'NEW_100', '2026-05-03 14:02:18.703', '2026-05-03 16:58:37.212', 'ECONOMY', 'T. Harv Eker', 'Thay đổi tư duy tài chính để đạt được sự giàu có bền vững.', 'https://salt.tikicdn.com/cache/w1200/ts/product/9e/a3/34/747ac6de3d6faaa7c036eab9b89fa254.jpg', '9786045851456'),
('d849686c-39b8-4b49-9773-08ed845eb73d', 'ba78aabc-4a35-45af-b975-3f72603e952c', 'SGK Tiếng Anh 6 - Global Success', 45000.00, 10, 'NEW_100', '2026-05-03 13:37:02.716', '2026-05-03 16:58:37.212', 'TEXTBOOK', 'Nhiều tác giả', 'Sách tiếng Anh lớp 6 theo bộ Global Success chuẩn chương trình mới.', 'https://salt.tikicdn.com/cache/w1200/ts/product/14/0d/16/0034a763a8a816a24683a45c7e37a237.jpg', '9786040123999'),
('da10ff6d-569e-40b7-af9c-32d49285ee86', 'ba78aabc-4a35-45af-b975-3f72603e952c', 'SGK Tiếng Anh 6 - Global Success', 45000.00, 10, 'NEW_100', '2026-05-03 14:02:18.748', '2026-05-03 16:58:37.212', 'TEXTBOOK', 'Nhiều tác giả', 'Sách tiếng Anh lớp 6 theo bộ Global Success chuẩn chương trình mới.', 'https://salt.tikicdn.com/cache/w1200/ts/product/14/0d/16/0034a763a8a816a24683a45c7e37a237.jpg', '9786040123999'),
('de45c8e2-f41a-4a7a-866d-033a0b54e839', 'ba78aabc-4a35-45af-b975-3f72603e952c', 'Quốc Gia Khởi Nghiệp', 135000.00, 10, 'NEW_100', '2026-05-03 14:02:18.709', '2026-05-03 16:58:37.212', 'ECONOMY', 'Dan Senor & Saul Singer', 'Câu chuyện về tinh thần khởi nghiệp mãnh liệt của dân tộc Israel.', 'https://salt.tikicdn.com/cache/w1200/ts/product/18/69/34/4952047a0664f3316f466b043236e3c8.jpg', '9786041123456'),
('e020cdac-7716-4bb1-9743-3984393f906c', 'ba78aabc-4a35-45af-b975-3f72603e952c', 'Harry Potter Và Hòn Đá Phù Thủy', 120000.00, 10, 'NEW_100', '2026-05-03 14:02:18.644', '2026-05-03 16:58:37.212', 'LITERATURE', 'J.K. Rowling', 'Phần đầu tiên của bộ truyện về cậu bé phù thủy Harry Potter nổi tiếng thế giới.', 'https://salt.tikicdn.com/cache/w1200/ts/product/54/74/4e/de11f0101d91a92e1041935e23652c7c.jpg', '9786041103719'),
('e14049e4-4e81-46c3-b819-90afdc88e55f', 'ba78aabc-4a35-45af-b975-3f72603e952c', 'Ánh Sáng Trong Ta', 152000.00, 10, 'NEW_100', '2026-05-03 13:37:02.722', '2026-05-03 16:58:37.212', 'OTHERS', 'Michelle Obama', 'Những chia sẻ sâu sắc về cách vượt qua sự bất ổn và tìm thấy chính mình.', 'https://salt.tikicdn.com/cache/w1200/ts/product/88/cc/70/fd10f3fd1a45ea447d66a8f98b63bea0.jpg', '9786041008888'),
('f3b0dbab-25a8-488f-96b5-27a960263d21', 'ba78aabc-4a35-45af-b975-3f72603e952c', 'Cây Cam Ngọt Của Tôi', 100000.00, 10, 'NEW_100', '2026-05-03 13:37:02.624', '2026-05-03 16:58:37.212', 'LITERATURE', 'José Mauro de Vasconcelos', 'Câu chuyện cảm động về chú bé Zezé và người bạn đặc biệt - cây cam ngọt.', 'https://salt.tikicdn.com/cache/w1200/ts/product/5e/18/24/2a6154ba08df6ce6161c13f4303fa19e.jpg', '9786045880623'),
('f4a9c9b9-2763-488c-b26b-529e451f3a7d', '3f224f3a-516a-4f7c-88c3-0ec3119e98d3', 'Lá Hoa Trên Đường Về', 125000.00, 10, 'NEW_100', '2026-05-03 16:46:39.090', '2026-05-03 16:58:37.212', 'OTHERS', 'Thích Pháp Hòa', 'Sách Phật giáo, những bài học sâu sắc về cuộc sống.', 'https://placehold.co/600x800/059669/ffffff.png?text=L%C3%A1+Hoa+Tr%C3%AAn+%C4%90%C6%B0%E1%BB%9Dng+V%E1%BB%81', '9786045661006'),
('f73285eb-3c7f-4368-8ec9-ae2bac5e54b7', '3f224f3a-516a-4f7c-88c3-0ec3119e98d3', 'Monster - Deluxe Edition', 119000.00, 10, 'NEW_100', '2026-05-03 16:46:39.160', '2026-05-03 16:58:37.212', 'COMICS', 'Naoki Urasawa', 'Hành trình truy tìm con quái vật thực sự.', 'https://placehold.co/600x800/78350f/ffffff.png?text=Monster+Deluxe', '9786045661017'),
('f84fdd83-66e3-44b7-b494-eee3862d5a87', '3f224f3a-516a-4f7c-88c3-0ec3119e98d3', 'Nguyên Tội Của Takopi', 95000.00, 10, 'NEW_100', '2026-05-03 16:46:39.142', '2026-05-03 16:58:37.212', 'COMICS', 'Taizan5', 'Câu chuyện đen tối và cảm động về Takopi.', 'https://placehold.co/600x800/4f46e5/ffffff.png?text=Nguy%C3%AAn+T%E1%BB%99i+C%E1%BB%A7a+Takopi', '9786045661014'),
('faba76c5-3215-42e2-8f39-12f30e3e8c21', 'ba78aabc-4a35-45af-b975-3f72603e952c', 'Nhà Giả Kim', 62000.00, 10, 'GOOD', '2026-05-03 13:25:21.375', '2026-05-03 16:58:37.212', 'LITERATURE', 'Paulo Coelho', 'Hành trình đi tìm vận mệnh của chàng chăn cừu Santiago.', 'https://salt.tikicdn.com/cache/w1200/ts/product/85/51/24/4c11429f1cca16835e872b5d4318af23.jpg', '9786045625613'),
('fc8e7e2f-261a-42f3-92c4-3485cf4bf86a', 'ba78aabc-4a35-45af-b975-3f72603e952c', 'Quẳng Gánh Lo Đi Và Vui Sống', 85000.00, 10, 'NEW_100', '2026-05-03 14:02:18.689', '2026-05-03 16:58:37.212', 'SKILLS', 'Dale Carnegie', 'Hướng dẫn chi tiết cách loại bỏ lo âu và tận hưởng niềm vui mỗi ngày.', 'https://salt.tikicdn.com/cache/w1200/ts/product/fd/e3/d8/6b2e3e56a1b0a8f8e8e6e5a6b7e6e5a6.jpg', '9786045678901'),
('fcec810f-2d69-41b2-933a-b871afd82767', '3f224f3a-516a-4f7c-88c3-0ec3119e98d3', 'Thám Tử Lừng Danh Conan 107', 25000.00, 10, 'NEW_100', '2026-05-03 16:46:39.097', '2026-05-03 16:58:37.212', 'COMICS', 'Gosho Aoyama', 'Tập mới nhất của bộ truyện trinh thám huyền thoại.', 'https://placehold.co/600x800/dc2626/ffffff.png?text=Conan+107', '9786045661007'),
('fdefa4ac-e716-47c4-9d9d-0ac311ee47e2', '3f224f3a-516a-4f7c-88c3-0ec3119e98d3', 'Siêu Quậy Teppei Tập 1', 24000.00, 10, 'NEW_100', '2026-05-03 16:46:39.117', '2026-05-03 16:58:37.212', 'COMICS', 'Tetsuya Chiba', 'Bộ truyện tranh hài hước về cậu bé Teppei.', 'https://placehold.co/600x800/ea580c/ffffff.png?text=Si%C3%AAu+Qu%E1%BA%ADy+Teppei', '9786045661010'),
('ff5fa18d-3357-43ca-a5a1-7c3d4e1d94f0', 'ba78aabc-4a35-45af-b975-3f72603e952c', 'Muôn Kiếp Nhân Sinh - Tập 1', 175000.00, 10, 'NEW_100', '2026-05-03 14:02:18.678', '2026-05-03 16:58:37.212', 'OTHERS', 'Nguyên Phong', 'Khám phá luật nhân quả, luân hồi và những bí ẩn của vũ trụ.', 'https://salt.tikicdn.com/cache/w1200/ts/product/1c/01/ea/6de2d9ffdbc7142e33c387332440adee.jpg', '9786041009999');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `bundle`
--

CREATE TABLE `bundle` (
  `id` varchar(191) NOT NULL,
  `sellerId` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `description` text DEFAULT NULL,
  `discountPercentage` int(11) NOT NULL DEFAULT 0,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `bundleitem`
--

CREATE TABLE `bundleitem` (
  `id` varchar(191) NOT NULL,
  `bundleId` varchar(191) NOT NULL,
  `bookId` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `conversation`
--

CREATE TABLE `conversation` (
  `id` varchar(191) NOT NULL,
  `buyerId` varchar(191) NOT NULL,
  `sellerId` varchar(191) NOT NULL,
  `bookId` varchar(191) DEFAULT NULL,
  `lastMessage` text DEFAULT NULL,
  `lastMsgAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `conversation`
--

INSERT INTO `conversation` (`id`, `buyerId`, `sellerId`, `bookId`, `lastMessage`, `lastMsgAt`, `createdAt`) VALUES
('c9dc69ed-dcc3-444f-afe1-a30ffb62eb9f', '3f224f3a-516a-4f7c-88c3-0ec3119e98d3', 'ba78aabc-4a35-45af-b975-3f72603e952c', '87ee38c0-e7d7-4d28-806a-893cebd85999', 'bạn muốn mua schas gì', '2026-05-03 17:01:24.160', '2026-05-03 17:00:49.661');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `dispute`
--

CREATE TABLE `dispute` (
  `id` varchar(191) NOT NULL,
  `subOrderId` varchar(191) NOT NULL,
  `reason` varchar(191) NOT NULL,
  `description` text NOT NULL,
  `images` text DEFAULT NULL,
  `status` enum('PENDING_SELLER','PENDING_ADMIN','RESOLVED_REFUND','RESOLVED_PAY_SELLER','CLOSED') NOT NULL DEFAULT 'PENDING_SELLER',
  `sellerReply` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `favorite`
--

CREATE TABLE `favorite` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `bookId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `favorite`
--

INSERT INTO `favorite` (`id`, `userId`, `bookId`, `createdAt`) VALUES
('094cfaf7-f352-4adb-bb9c-831efdbcdcfc', '3f224f3a-516a-4f7c-88c3-0ec3119e98d3', '87ee38c0-e7d7-4d28-806a-893cebd85999', '2026-05-03 17:00:47.809');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `masterorder`
--

CREATE TABLE `masterorder` (
  `id` varchar(191) NOT NULL,
  `buyerId` varchar(191) NOT NULL,
  `totalPayment` decimal(15,2) NOT NULL,
  `paymentMethod` enum('VNPAY','MOMO','COD') NOT NULL,
  `paymentStatus` enum('PENDING','PAID','FAILED') NOT NULL DEFAULT 'PENDING',
  `transactionId` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `discountAmount` decimal(15,2) NOT NULL DEFAULT 0.00,
  `voucherId` varchar(191) DEFAULT NULL,
  `shippingAddress` varchar(191) DEFAULT NULL,
  `shippingName` varchar(191) DEFAULT NULL,
  `shippingPhone` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `message`
--

CREATE TABLE `message` (
  `id` varchar(191) NOT NULL,
  `conversationId` varchar(191) NOT NULL,
  `senderId` varchar(191) NOT NULL,
  `content` text NOT NULL,
  `isRead` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `message`
--

INSERT INTO `message` (`id`, `conversationId`, `senderId`, `content`, `isRead`, `createdAt`) VALUES
('38b71b96-ec3a-4c5f-a78c-6a225ea770c2', 'c9dc69ed-dcc3-444f-afe1-a30ffb62eb9f', '3f224f3a-516a-4f7c-88c3-0ec3119e98d3', 'alo', 1, '2026-05-03 17:00:56.022'),
('87beec49-3a4d-48dd-8ec3-37b63fe6c42b', 'c9dc69ed-dcc3-444f-afe1-a30ffb62eb9f', '3f224f3a-516a-4f7c-88c3-0ec3119e98d3', 'tôi muốn mua sách', 1, '2026-05-03 17:01:00.333'),
('ab6dccac-d0fb-4474-af78-27692b82963a', 'c9dc69ed-dcc3-444f-afe1-a30ffb62eb9f', 'ba78aabc-4a35-45af-b975-3f72603e952c', 'bạn muốn mua schas gì', 1, '2026-05-03 17:01:24.156');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `notification`
--

CREATE TABLE `notification` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `message` text NOT NULL,
  `type` enum('INFO','ORDER','OFFER','PRICE_DROP','SYSTEM') NOT NULL DEFAULT 'INFO',
  `isRead` tinyint(1) NOT NULL DEFAULT 0,
  `link` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `notification`
--

INSERT INTO `notification` (`id`, `userId`, `title`, `message`, `type`, `isRead`, `link`, `createdAt`) VALUES
('1191112c-87e5-4288-995b-bcee2100edaf', 'ba78aabc-4a35-45af-b975-3f72603e952c', 'Lời đề nghị mới', 'tuấn đã đề nghị mua \"SGK Ngữ Văn 10 - Tập 1 (Kết nối tri thức)\" với giá 35.000 ₫', 'OFFER', 1, '/seller/offers/dffb2ab0-af3c-4991-892f-d81fc59b3f3d', '2026-05-03 16:25:25.321'),
('8ead0e03-96b6-4b39-86fe-aaadfcd7b73d', '3f224f3a-516a-4f7c-88c3-0ec3119e98d3', 'Lời đề nghị được chấp nhận', 'Người bán System Administrator đã chấp nhận lời đề nghị của bạn cho \"SGK Ngữ Văn 10 - Tập 1 (Kết nối tri thức)\".', 'OFFER', 1, '/books/240982df-f0ef-4aaa-b45c-993c900a4844', '2026-05-03 16:53:09.383');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `offer`
--

CREATE TABLE `offer` (
  `id` varchar(191) NOT NULL,
  `buyerId` varchar(191) NOT NULL,
  `sellerId` varchar(191) NOT NULL,
  `bookId` varchar(191) NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `status` enum('PENDING','ACCEPTED','REJECTED','EXPIRED') NOT NULL DEFAULT 'PENDING',
  `message` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `offer`
--

INSERT INTO `offer` (`id`, `buyerId`, `sellerId`, `bookId`, `amount`, `status`, `message`, `createdAt`, `updatedAt`) VALUES
('dffb2ab0-af3c-4991-892f-d81fc59b3f3d', '3f224f3a-516a-4f7c-88c3-0ec3119e98d3', 'ba78aabc-4a35-45af-b975-3f72603e952c', '240982df-f0ef-4aaa-b45c-993c900a4844', 35000.00, 'ACCEPTED', 'tôi muốn giảm giá 5000', '2026-05-03 16:25:25.304', '2026-05-03 16:53:09.369');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orderitem`
--

CREATE TABLE `orderitem` (
  `id` varchar(191) NOT NULL,
  `subOrderId` varchar(191) NOT NULL,
  `bookId` varchar(191) NOT NULL,
  `quantity` int(11) NOT NULL,
  `priceAtPurchase` decimal(15,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `pricehistory`
--

CREATE TABLE `pricehistory` (
  `id` varchar(191) NOT NULL,
  `bookId` varchar(191) NOT NULL,
  `price` decimal(15,2) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `pricehistory`
--

INSERT INTO `pricehistory` (`id`, `bookId`, `price`, `createdAt`) VALUES
('026a34a0-1319-424c-ab6b-72852ce482fe', 'd505b32f-e5ef-4183-9f8b-57ab5a3399b7', 115000.00, '2026-05-03 13:37:02.733'),
('030abe7b-889a-4ed5-afec-7aa8edd1a8b3', '1043e10b-b029-4990-9121-d347e38ef9b6', 145000.00, '2026-05-03 13:37:02.667'),
('0328f850-e143-4fa8-8343-9a293a8651f1', 'e020cdac-7716-4bb1-9743-3984393f906c', 120000.00, '2026-05-03 14:02:18.647'),
('0555978e-05be-4064-9995-9f27425f3647', 'ff5fa18d-3357-43ca-a5a1-7c3d4e1d94f0', 175000.00, '2026-05-03 14:02:18.681'),
('0637ff05-2020-41ca-990a-373ba3b72aa7', '1d08b24b-2a96-483d-9e33-fa8eadc88670', 30000.00, '2026-05-03 13:37:02.708'),
('070f52ef-533f-400e-bfc0-d5b5dc512948', 'bedee49b-6189-48d7-b624-3f782af082b1', 120000.00, '2026-05-03 13:37:02.686'),
('07a5bcf4-28b4-4957-a3f5-08b3c33df405', '13fc4f26-4ae7-4ccd-9f15-8f0aff6899b6', 25000.00, '2026-05-03 14:02:18.665'),
('0f925b3d-0ac7-453c-aecd-21015cef8fd9', '7a09ec5e-0e88-4b38-8bc3-8f12e9149ce7', 90000.00, '2026-05-03 13:37:02.585'),
('1210bcc6-db89-474b-b73f-99bb488cd752', '99dfe552-390f-4805-a52d-844566f175aa', 90000.00, '2026-05-03 13:37:02.729'),
('13b71546-c116-4013-b9b5-0801730ae809', '00d81648-d73d-4ad4-a179-c136d9c5b1fe', 108000.00, '2026-05-03 13:37:02.594'),
('151138d1-35f4-4af9-bf3a-9f186e00eb5b', 'faba76c5-3215-42e2-8f39-12f30e3e8c21', 62000.00, '2026-05-03 13:25:21.378'),
('15e23385-8ecb-46ba-8c4e-6245c383ce34', '43faeb24-eef5-42c4-bbd1-f4f8d98338ed', 37000.00, '2026-05-03 16:46:39.183'),
('1875586f-fdaf-4866-864b-5eae66105c14', '8deea47f-da3c-4e60-8b1a-edd42246945a', 28000.00, '2026-05-03 14:02:18.670'),
('1f7d8d21-3404-4705-8ed1-2dfba5ed4655', '9ec2f95e-0619-4467-b6f2-b6dc4355bc02', 375000.00, '2026-05-03 16:46:39.176'),
('2004738a-b4b1-4f4a-b122-e9d03d192063', '6d7c4a2c-a856-4213-8eb6-1ab4818ea524', 150000.00, '2026-05-03 14:02:18.659'),
('2560feb2-55de-4050-b8bc-67ac4241e41b', 'b14374a8-9a9c-4359-9c56-035f7553014b', 162000.00, '2026-05-03 16:46:39.081'),
('25d5f788-d233-49b8-b67f-3e6307c8359c', '913ac9d1-b147-4db3-91bc-a04395dd58f1', 35000.00, '2026-05-03 14:02:18.746'),
('282d0869-8d66-4c93-9149-51eea6fe330f', '5f9ae638-d3ae-4600-97aa-7d8434fc1b7d', 40000.00, '2026-05-03 13:37:02.743'),
('2a342721-d140-4ebe-94c2-c8b5d39d8d2f', '7e80884f-c151-46fc-8c6c-7d833d272ae1', 85000.00, '2026-05-03 13:37:02.662'),
('2a3968a7-bd53-419e-bbf6-8ee9ad35b047', '342687fa-138f-4ac3-99b3-bd249238cfae', 30000.00, '2026-05-03 14:02:18.732'),
('2d623f82-64c5-4721-9bb4-220ae1c5fff9', '520ab8f5-4855-4e99-a195-fb5aa3a017df', 28000.00, '2026-05-03 13:37:02.643'),
('3431d387-7b8a-41b9-ae72-79027d55822f', 'fc8e7e2f-261a-42f3-92c4-3485cf4bf86a', 85000.00, '2026-05-03 14:02:18.695'),
('3672b7e9-afc1-4582-9a01-535fe7ad683f', 'b1e748ba-6027-44e9-b6f5-61faffe32ee8', 95000.00, '2026-05-03 13:37:02.691'),
('3973dfed-ba38-4170-8ac0-d1cd2fc129c8', 'bebabed4-dd0d-4dbf-a34b-f154666c6176', 522000.00, '2026-05-03 16:46:39.087'),
('3abb225e-5842-4c4b-aa7a-2d8179bb0651', '9ccf3ca5-2981-47d4-92a4-95595eb403e6', 90000.00, '2026-05-03 14:02:18.614'),
('3e48d4a8-8a43-42b0-81c0-70ddf131b9e8', '758cbaa5-45f0-4447-9629-61ef63f71bbc', 450000.00, '2026-05-03 13:25:21.387'),
('411e6f9f-0f9e-4f2e-ac6d-8e71f5ec4a74', '9f51d5b4-ad0a-404b-8d3f-57ef4fb2d31a', 110000.00, '2026-05-03 14:02:18.771'),
('426f1c70-acad-4931-8225-4d03602bbfc5', '817ae119-f405-4fb2-8b9f-9f7fad78edf9', 180000.00, '2026-05-03 14:02:18.686'),
('4444ab5e-79b3-4cca-af71-060270da4573', 'a9d2fd73-4b0b-4e5a-a1ba-f1fe5103ca8c', 85000.00, '2026-05-03 14:02:18.632'),
('4513fc1e-d650-4b00-9887-d1ae61fc9197', '2463d8e6-9e53-4af3-80cd-265859982bc8', 37000.00, '2026-05-03 16:46:39.151'),
('46504045-a75b-46ae-b4ed-dbc09e00679f', 'f4a9c9b9-2763-488c-b26b-529e451f3a7d', 125000.00, '2026-05-03 16:46:39.094'),
('49e17c1e-1f7f-453d-b973-55181b82930d', '4f394b45-8ade-4c19-b1cb-53e9c1c65dc6', 100000.00, '2026-05-03 14:02:18.654'),
('4c3c9a8f-425d-44b6-b887-ed663d9fc493', '4c2ae1b5-a51a-410d-8649-553ca12baa08', 24000.00, '2026-05-03 16:46:39.126'),
('4d82d008-c2ac-4ffb-b5b0-d88e08fd1970', '2041d11f-0651-4dd8-ba44-6d951d0d230b', 110000.00, '2026-05-03 16:46:39.106'),
('52aeecd7-7a4c-4737-91fb-703b2962a36d', 'de45c8e2-f41a-4a7a-866d-033a0b54e839', 135000.00, '2026-05-03 14:02:18.712'),
('55512d8b-84bd-4ed1-b366-31e3f3de607e', '87ee38c0-e7d7-4d28-806a-893cebd85999', 108000.00, '2026-05-03 14:02:18.621'),
('5c57451a-b587-4b4e-871c-11826e79016d', 'd849686c-39b8-4b49-9773-08ed845eb73d', 45000.00, '2026-05-03 13:37:02.719'),
('5d6a2e6f-ddc5-4a51-948e-d25ac9dc157f', 'd69d75c7-867f-4a84-aee5-59705765306a', 95000.00, '2026-05-03 14:02:18.706'),
('5e48a460-d510-416a-ada6-2b7a0ce830de', '6fc25dec-04b6-4778-b0c0-7a07bebce16c', 30000.00, '2026-05-03 13:37:02.696'),
('5f4407b1-a52a-4658-98d4-79d9ba30a64c', '343b39f3-3135-4a91-a80e-ef532ff4f6c9', 35000.00, '2026-05-03 14:02:18.676'),
('602d0bdd-810c-4250-92ea-e23a8c3e1075', '05b1286a-86ca-41de-810f-0ed281b93b59', 110000.00, '2026-05-03 13:37:02.738'),
('60dd6153-4e3b-4eab-bde0-55b7c44d04e8', 'f73285eb-3c7f-4368-8ec9-ae2bac5e54b7', 119000.00, '2026-05-03 16:46:39.163'),
('6866d40c-7cbc-4bd1-8a1f-f40102ce3dcd', 'fcec810f-2d69-41b2-933a-b871afd82767', 25000.00, '2026-05-03 16:46:39.100'),
('6945328d-14ce-433b-880b-b37ae0990800', 'bad0aa65-848f-4da4-8548-19de04ab6093', 152000.00, '2026-05-03 14:02:18.755'),
('762d5328-b31e-4683-bd5a-97d5d3ca6d82', '61389509-37cc-4b59-ba6f-ca6f5fec7667', 175000.00, '2026-05-03 13:37:02.653'),
('78731824-12b0-4b16-a25d-0162cf14546b', '240982df-f0ef-4aaa-b45c-993c900a4844', 40000.00, '2026-05-03 14:02:18.775'),
('78b5f75d-10f0-432a-bc86-695c22b15492', '40041003-0bb5-4eb2-bf26-02b963b78d1a', 95000.00, '2026-05-03 13:37:02.672'),
('79231696-c8fa-4e5a-9e2d-0d0019a39139', '76ebebab-c3e3-4827-8ed4-d730c3e7298e', 120000.00, '2026-05-03 14:02:18.722'),
('7a05fcf7-1df0-403d-ad67-eed59bd44270', 'da10ff6d-569e-40b7-af9c-32d49285ee86', 45000.00, '2026-05-03 14:02:18.750'),
('7b1c9e2b-7bcc-4443-8a88-afbda032c843', '85931ab3-431f-4eef-80cb-40495ba9e4a1', 119000.00, '2026-05-03 16:46:39.171'),
('7d5d3962-3c36-4a68-8d6f-540809b25113', 'b200f8cd-95c6-4620-8e8c-65505006e673', 35000.00, '2026-05-03 13:37:02.714'),
('80b0cc5e-d2b7-4550-8b31-867fba8adcb0', '7242c72d-2aa5-4ced-a388-c607e4ef23b6', 90000.00, '2026-05-03 14:02:18.760'),
('854db1fa-68ec-441a-8010-2f4bbb2a5ccb', 'a21db86d-a430-44ca-94fe-ac1b2a4c07da', 150000.00, '2026-05-03 14:02:18.716'),
('877cf202-8a31-474b-9476-f914b3af9388', 'd3c295cf-3346-4e34-8e73-d4878b92fcbd', 191000.00, '2026-05-03 16:46:39.074'),
('88ef6d7e-f222-4edf-9b52-ffa6ef78a24c', 'a58c45e5-8296-492a-99e0-02b17f8830de', 180000.00, '2026-05-03 13:37:02.658'),
('8d1749ef-b1b1-490e-a04e-f9fe09b17441', 'b733409d-72c2-4108-963e-2eab89a70e2b', 145000.00, '2026-05-03 14:02:18.700'),
('94f38f1d-7931-41ef-bbf8-659899db7b0a', '04e70817-5f48-4001-a2aa-939f226b0b50', 135000.00, '2026-05-03 13:37:02.675'),
('9c9f3bde-27c1-4ad8-b872-2e285dec4572', '1be1d50e-b151-40c0-bfe3-855982f6b699', 80000.00, '2026-05-03 13:37:02.615'),
('9cfc36b6-4263-413b-856c-5f37d83af032', '8721db0f-0678-4d9d-b55b-f97f819b9b3d', 85000.00, '2026-05-03 13:25:21.369'),
('a3d40f46-d74f-45ef-91fc-6fbdfa7dc0cb', '41ccc7c8-7414-4b04-b4bf-e7f45826384f', 80000.00, '2026-05-03 14:02:18.640'),
('a4824418-a47a-428f-98ea-82c35079d675', '0640a8c4-c7f0-4cd3-82a1-9a14402cc583', 110000.00, '2026-05-03 14:02:18.626'),
('a5b8c994-330c-41eb-a722-0204022f2523', 'b150dfd0-a58e-46c3-8208-a269b77c8329', 30000.00, '2026-05-03 13:37:02.701'),
('a81606c1-746f-4a73-a22e-f073a47b8986', 'e14049e4-4e81-46c3-b819-90afdc88e55f', 152000.00, '2026-05-03 13:37:02.724'),
('a9a7e676-d4ee-4041-a68d-ef1b60c3bdb9', '5aaccc6e-2bd0-47ab-af21-129b23d472b5', 85000.00, '2026-05-03 13:37:02.608'),
('ab9f4434-018d-466f-96b3-068b028d6181', 'f84fdd83-66e3-44b7-b494-eee3862d5a87', 95000.00, '2026-05-03 16:46:39.145'),
('b3571d67-a8a5-40ec-b096-e80ed019f21c', '7adcefb0-31b9-480e-a8fd-5c65f1d65c45', 161000.00, '2026-05-03 16:46:39.132'),
('bb75be5f-2341-4809-9ba9-c932e587e61b', '0b64593c-19bf-434d-8239-c0c949e0dae2', 115000.00, '2026-05-03 14:02:18.765'),
('bfd9531d-2dff-4449-86a0-7801ac0501f1', '1079c4ba-d7b0-427b-862b-f7c82e1ac88d', 110000.00, '2026-05-03 13:37:02.600'),
('c17e8201-f764-490f-a435-cfb3cf5df204', '954bfaeb-5409-440b-bd8d-7526546a100c', 72000.00, '2026-05-03 16:46:39.157'),
('c4023c7a-d635-4be9-92d4-e0e41f3b7640', 'abe91fa3-ac5d-400b-9012-1f3dfcda9c9f', 150000.00, '2026-05-03 13:37:02.632'),
('c447dabf-3b95-4986-8e57-69f365483795', '9312e5b9-2f1b-4096-98ac-6e54f78900c2', 35000.00, '2026-05-03 13:37:02.648'),
('cb0e91fa-8380-4b22-bb58-a28e61230f0e', '8a845285-6192-45d8-bf1f-8b6ca84e60f1', 95000.00, '2026-05-03 14:02:18.727'),
('cb14c1e2-c0df-434c-87df-9d94d109bbb6', '2e1cc949-5477-4968-9ec7-acdf735491b6', 25000.00, '2026-05-03 13:37:02.637'),
('d602bc43-7a23-4895-bd1d-0d1783fe3763', '46172dd6-279d-4bbd-8243-0784cd7c3d58', 236000.00, '2026-05-03 16:46:39.113'),
('d7f596b4-2998-4e53-a83f-bd9316a595e2', '3efeb1f6-860d-46bb-8182-6328ff077d03', 143000.00, '2026-05-03 16:46:39.058'),
('da2f5fbf-6a33-47e7-9907-6cb882b94dca', '24c327ea-4b18-4e31-8e13-a426fd6cca23', 150000.00, '2026-05-03 13:37:02.680'),
('dfc77e82-e974-4d31-a1dd-f7a2d52df7ab', 'cfcfa67d-c281-407c-8cdc-b94ddbe845aa', 150000.00, '2026-05-03 16:46:39.067'),
('e0ea7d21-427b-46fe-88a7-de737d4893ab', 'be52163b-0409-480a-8ff6-6470cbe17488', 120000.00, '2026-05-03 13:37:02.621'),
('e391c3c0-4dff-4493-994e-54a0c0e356f2', 'fdefa4ac-e716-47c4-9d9d-0ac311ee47e2', 24000.00, '2026-05-03 16:46:39.120'),
('e62132b5-3cf2-4ff6-af89-daaec8acecf0', 'c8f69d4b-0db7-43ba-bbcd-2e0ed4bf3ca7', 44000.00, '2026-05-03 16:46:39.139'),
('e7b44775-8637-4921-8974-e349113961eb', '679bfd12-85f7-438d-8939-407ce3fef532', 30000.00, '2026-05-03 14:02:18.741'),
('e892fd4e-e525-4ca0-8f48-8972fbb1dc30', '80c2374b-8c5e-412b-8c6b-d4c98b0def0e', 30000.00, '2026-05-03 14:02:18.736'),
('eec84f07-e2f6-4396-883c-631e0a8a88cc', 'f3b0dbab-25a8-488f-96b5-27a960263d21', 100000.00, '2026-05-03 13:37:02.627');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `review`
--

CREATE TABLE `review` (
  `id` varchar(191) NOT NULL,
  `subOrderId` varchar(191) NOT NULL,
  `bookId` varchar(191) NOT NULL,
  `rating` int(11) NOT NULL DEFAULT 5,
  `comment` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `reviewreply`
--

CREATE TABLE `reviewreply` (
  `id` varchar(191) NOT NULL,
  `reviewId` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `content` text NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `suborder`
--

CREATE TABLE `suborder` (
  `id` varchar(191) NOT NULL,
  `masterOrderId` varchar(191) NOT NULL,
  `sellerId` varchar(191) NOT NULL,
  `subTotal` decimal(15,2) NOT NULL,
  `platformFee` decimal(15,2) NOT NULL,
  `netAmount` decimal(15,2) NOT NULL,
  `trackingCode` varchar(191) DEFAULT NULL,
  `status` enum('PENDING','CONFIRMED','PACKED','SHIPPING','DELIVERED','COMPLETED','DISPUTED','REFUNDED') NOT NULL DEFAULT 'PENDING',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user`
--

CREATE TABLE `user` (
  `id` varchar(191) NOT NULL,
  `role` enum('ADMIN','USER') NOT NULL DEFAULT 'USER',
  `name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `passwordHash` varchar(191) NOT NULL,
  `bankAccountInfo` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `address` varchar(191) DEFAULT NULL,
  `phoneNumber` varchar(191) DEFAULT NULL,
  `points` int(11) NOT NULL DEFAULT 0,
  `rank` enum('BRONZE','SILVER','GOLD','PLATINUM') NOT NULL DEFAULT 'BRONZE',
  `isVerified` tinyint(1) NOT NULL DEFAULT 0,
  `verificationDocs` text DEFAULT NULL,
  `referralCode` varchar(191) DEFAULT NULL,
  `referredById` varchar(191) DEFAULT NULL,
  `resetToken` varchar(191) DEFAULT NULL,
  `resetTokenExpiry` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `user`
--

INSERT INTO `user` (`id`, `role`, `name`, `email`, `passwordHash`, `bankAccountInfo`, `createdAt`, `updatedAt`, `address`, `phoneNumber`, `points`, `rank`, `isVerified`, `verificationDocs`, `referralCode`, `referredById`, `resetToken`, `resetTokenExpiry`) VALUES
('3f224f3a-516a-4f7c-88c3-0ec3119e98d3', 'USER', 'tuấn', 'letuan040702@gmail.com', '$2b$10$LTzpf2X4rtgejW.Y1W1lROdNIqfw.QtFT3/X//Crp2liU4cIYPLQm', NULL, '2026-05-03 16:07:14.886', '2026-05-03 17:55:16.019', NULL, NULL, 0, 'BRONZE', 0, NULL, NULL, NULL, NULL, NULL),
('ba78aabc-4a35-45af-b975-3f72603e952c', 'ADMIN', 'System Administrator', 'admin@gmail.com', '$2b$10$NcYDr48vQSAGdHYeRh8GIOdXK/Bd7cFbbqKhw.XBBWRNVT6ufnXDC', NULL, '2026-05-03 13:20:03.079', '2026-05-03 16:58:37.148', NULL, NULL, 0, 'BRONZE', 0, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `voucher`
--

CREATE TABLE `voucher` (
  `id` varchar(191) NOT NULL,
  `code` varchar(191) NOT NULL,
  `description` varchar(191) DEFAULT NULL,
  `discountType` enum('PERCENTAGE','FIXED_AMOUNT') NOT NULL DEFAULT 'PERCENTAGE',
  `discountValue` decimal(15,2) NOT NULL,
  `minOrderAmount` decimal(15,2) NOT NULL DEFAULT 0.00,
  `maxDiscount` decimal(15,2) DEFAULT NULL,
  `expiryDate` datetime(3) DEFAULT NULL,
  `usageLimit` int(11) NOT NULL DEFAULT 100,
  `usedCount` int(11) NOT NULL DEFAULT 0,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `minRank` enum('BRONZE','SILVER','GOLD','PLATINUM') NOT NULL DEFAULT 'BRONZE'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `wallet`
--

CREATE TABLE `wallet` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `availableBalance` decimal(15,2) NOT NULL DEFAULT 0.00,
  `escrowBalance` decimal(15,2) NOT NULL DEFAULT 0.00,
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `wallet`
--

INSERT INTO `wallet` (`id`, `userId`, `availableBalance`, `escrowBalance`, `updatedAt`) VALUES
('d27ac804-8907-4838-871b-76a1f3e5974e', '3f224f3a-516a-4f7c-88c3-0ec3119e98d3', 0.00, 0.00, '2026-05-03 16:07:14.886'),
('f7df5fa2-6757-47af-8220-2e5ef920d4a3', 'ba78aabc-4a35-45af-b975-3f72603e952c', 0.00, 0.00, '2026-05-03 13:20:03.085');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `wallettransaction`
--

CREATE TABLE `wallettransaction` (
  `id` varchar(191) NOT NULL,
  `walletId` varchar(191) NOT NULL,
  `referenceSubOrderId` varchar(191) DEFAULT NULL,
  `type` enum('IN_ESCROW','ESCROW_RELEASE','DEDUCT_FEE','WITHDRAW_PENDING','WITHDRAW_SUCCESS','DIRECT_SALE','REFUND') NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `description` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `book`
--
ALTER TABLE `book`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Book_sellerId_fkey` (`sellerId`),
  ADD KEY `book_isbn_idx` (`isbn`);

--
-- Chỉ mục cho bảng `bundle`
--
ALTER TABLE `bundle`
  ADD PRIMARY KEY (`id`),
  ADD KEY `bundle_sellerId_idx` (`sellerId`);

--
-- Chỉ mục cho bảng `bundleitem`
--
ALTER TABLE `bundleitem`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `bundleitem_bundleId_bookId_key` (`bundleId`,`bookId`),
  ADD KEY `bundleitem_bookId_fkey` (`bookId`);

--
-- Chỉ mục cho bảng `conversation`
--
ALTER TABLE `conversation`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `conversation_buyerId_sellerId_bookId_key` (`buyerId`,`sellerId`,`bookId`),
  ADD KEY `conversation_sellerId_fkey` (`sellerId`),
  ADD KEY `conversation_bookId_fkey` (`bookId`);

--
-- Chỉ mục cho bảng `dispute`
--
ALTER TABLE `dispute`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Dispute_subOrderId_key` (`subOrderId`);

--
-- Chỉ mục cho bảng `favorite`
--
ALTER TABLE `favorite`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `favorite_userId_bookId_key` (`userId`,`bookId`),
  ADD KEY `favorite_bookId_fkey` (`bookId`);

--
-- Chỉ mục cho bảng `masterorder`
--
ALTER TABLE `masterorder`
  ADD PRIMARY KEY (`id`),
  ADD KEY `MasterOrder_buyerId_fkey` (`buyerId`),
  ADD KEY `masterorder_voucherId_fkey` (`voucherId`);

--
-- Chỉ mục cho bảng `message`
--
ALTER TABLE `message`
  ADD PRIMARY KEY (`id`),
  ADD KEY `message_conversationId_idx` (`conversationId`);

--
-- Chỉ mục cho bảng `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notification_userId_idx` (`userId`);

--
-- Chỉ mục cho bảng `offer`
--
ALTER TABLE `offer`
  ADD PRIMARY KEY (`id`),
  ADD KEY `offer_buyerId_idx` (`buyerId`),
  ADD KEY `offer_sellerId_idx` (`sellerId`),
  ADD KEY `offer_bookId_idx` (`bookId`);

--
-- Chỉ mục cho bảng `orderitem`
--
ALTER TABLE `orderitem`
  ADD PRIMARY KEY (`id`),
  ADD KEY `OrderItem_bookId_fkey` (`bookId`),
  ADD KEY `OrderItem_subOrderId_fkey` (`subOrderId`);

--
-- Chỉ mục cho bảng `pricehistory`
--
ALTER TABLE `pricehistory`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pricehistory_bookId_idx` (`bookId`);

--
-- Chỉ mục cho bảng `review`
--
ALTER TABLE `review`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Review_subOrderId_key` (`subOrderId`),
  ADD KEY `Review_bookId_fkey` (`bookId`);

--
-- Chỉ mục cho bảng `reviewreply`
--
ALTER TABLE `reviewreply`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reviewreply_reviewId_fkey` (`reviewId`),
  ADD KEY `reviewreply_userId_fkey` (`userId`);

--
-- Chỉ mục cho bảng `suborder`
--
ALTER TABLE `suborder`
  ADD PRIMARY KEY (`id`),
  ADD KEY `SubOrder_masterOrderId_fkey` (`masterOrderId`),
  ADD KEY `SubOrder_sellerId_fkey` (`sellerId`);

--
-- Chỉ mục cho bảng `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_email_key` (`email`),
  ADD UNIQUE KEY `user_referralCode_key` (`referralCode`),
  ADD UNIQUE KEY `user_resetToken_key` (`resetToken`),
  ADD KEY `user_referredById_fkey` (`referredById`);

--
-- Chỉ mục cho bảng `voucher`
--
ALTER TABLE `voucher`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `voucher_code_key` (`code`);

--
-- Chỉ mục cho bảng `wallet`
--
ALTER TABLE `wallet`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Wallet_userId_key` (`userId`);

--
-- Chỉ mục cho bảng `wallettransaction`
--
ALTER TABLE `wallettransaction`
  ADD PRIMARY KEY (`id`),
  ADD KEY `WalletTransaction_referenceSubOrderId_fkey` (`referenceSubOrderId`),
  ADD KEY `WalletTransaction_walletId_fkey` (`walletId`);

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `book`
--
ALTER TABLE `book`
  ADD CONSTRAINT `Book_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `bundle`
--
ALTER TABLE `bundle`
  ADD CONSTRAINT `bundle_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `bundleitem`
--
ALTER TABLE `bundleitem`
  ADD CONSTRAINT `bundleitem_bookId_fkey` FOREIGN KEY (`bookId`) REFERENCES `book` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `bundleitem_bundleId_fkey` FOREIGN KEY (`bundleId`) REFERENCES `bundle` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `conversation`
--
ALTER TABLE `conversation`
  ADD CONSTRAINT `conversation_bookId_fkey` FOREIGN KEY (`bookId`) REFERENCES `book` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `conversation_buyerId_fkey` FOREIGN KEY (`buyerId`) REFERENCES `user` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `conversation_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `dispute`
--
ALTER TABLE `dispute`
  ADD CONSTRAINT `Dispute_subOrderId_fkey` FOREIGN KEY (`subOrderId`) REFERENCES `suborder` (`id`) ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `favorite`
--
ALTER TABLE `favorite`
  ADD CONSTRAINT `favorite_bookId_fkey` FOREIGN KEY (`bookId`) REFERENCES `book` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `favorite_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `masterorder`
--
ALTER TABLE `masterorder`
  ADD CONSTRAINT `MasterOrder_buyerId_fkey` FOREIGN KEY (`buyerId`) REFERENCES `user` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `masterorder_voucherId_fkey` FOREIGN KEY (`voucherId`) REFERENCES `voucher` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `message`
--
ALTER TABLE `message`
  ADD CONSTRAINT `message_conversationId_fkey` FOREIGN KEY (`conversationId`) REFERENCES `conversation` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `notification`
--
ALTER TABLE `notification`
  ADD CONSTRAINT `notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `offer`
--
ALTER TABLE `offer`
  ADD CONSTRAINT `offer_bookId_fkey` FOREIGN KEY (`bookId`) REFERENCES `book` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `offer_buyerId_fkey` FOREIGN KEY (`buyerId`) REFERENCES `user` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `offer_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `orderitem`
--
ALTER TABLE `orderitem`
  ADD CONSTRAINT `OrderItem_bookId_fkey` FOREIGN KEY (`bookId`) REFERENCES `book` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `OrderItem_subOrderId_fkey` FOREIGN KEY (`subOrderId`) REFERENCES `suborder` (`id`) ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `pricehistory`
--
ALTER TABLE `pricehistory`
  ADD CONSTRAINT `pricehistory_bookId_fkey` FOREIGN KEY (`bookId`) REFERENCES `book` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `review`
--
ALTER TABLE `review`
  ADD CONSTRAINT `Review_bookId_fkey` FOREIGN KEY (`bookId`) REFERENCES `book` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Review_subOrderId_fkey` FOREIGN KEY (`subOrderId`) REFERENCES `suborder` (`id`) ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `reviewreply`
--
ALTER TABLE `reviewreply`
  ADD CONSTRAINT `reviewreply_reviewId_fkey` FOREIGN KEY (`reviewId`) REFERENCES `review` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `reviewreply_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `suborder`
--
ALTER TABLE `suborder`
  ADD CONSTRAINT `SubOrder_masterOrderId_fkey` FOREIGN KEY (`masterOrderId`) REFERENCES `masterorder` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `SubOrder_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_referredById_fkey` FOREIGN KEY (`referredById`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `wallet`
--
ALTER TABLE `wallet`
  ADD CONSTRAINT `Wallet_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `wallettransaction`
--
ALTER TABLE `wallettransaction`
  ADD CONSTRAINT `WalletTransaction_referenceSubOrderId_fkey` FOREIGN KEY (`referenceSubOrderId`) REFERENCES `suborder` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `WalletTransaction_walletId_fkey` FOREIGN KEY (`walletId`) REFERENCES `wallet` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
