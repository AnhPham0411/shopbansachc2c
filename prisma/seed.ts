import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import "dotenv/config";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function main() {
  const email = "admin@gmail.com";
  const password = "12345678";
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  console.log("Seeding admin user...");

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash: passwordHash,
      role: "ADMIN",
    },
    create: {
      email,
      name: "System Administrator",
      passwordHash: passwordHash,
      role: "ADMIN",
    },
  });

  // Ensure admin has a wallet
  await prisma.wallet.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      userId: admin.id,
      availableBalance: 0,
      escrowBalance: 0,
    },
  });

  console.log("Seeding 30 sample books...");

  const books = [
    {
      "title": "Nhà Giả Kim",
      "author": "Paulo Coelho",
      "isbn": "9786045661031",
      "price": 90000,
      "category": "LITERATURE",
      "condition": "NEW_100",
      "description": "Cuộc hành trình theo đuổi ước mơ của Santiago, cuốn sách bán chạy nhất mọi thời đại.",
      "imageUrl": "https://salt.tikicdn.com/cache/w1200/ts/product/85/51/24/4c11429f1cca16835e872b5d4318af23.jpg"
    },
    {
      "title": "Đắc Nhân Tâm",
      "author": "Dale Carnegie",
      "isbn": "9786045880623",
      "price": 108000,
      "category": "SKILLS",
      "condition": "NEW_100",
      "description": "Nghệ thuật thu phục lòng người đỉnh cao và thành công trong cuộc sống.",
      "imageUrl": "https://salt.tikicdn.com/cache/w1200/ts/product/db/09/a5/4892e37b77ddf3b9883e489a2151e7bf.jpg"
    },
    {
      "title": "Mắt Biếc",
      "author": "Nguyễn Nhật Ánh",
      "isbn": "9786041147560",
      "price": 110000,
      "category": "LITERATURE",
      "condition": "NEW_100",
      "description": "Câu chuyện tình buồn giữa Ngạn và Hà Lan, tác phẩm kinh điển của Nguyễn Nhật Ánh.",
      "imageUrl": "https://salt.tikicdn.com/cache/w1200/ts/product/f9/16/7b/c1a9c8c6f609511fdddef5fc4e728d7e.jpg"
    },
    {
      "title": "Cha Giàu Cha Nghèo",
      "author": "Robert T. Kiyosaki",
      "isbn": "9786041065116",
      "price": 85000,
      "category": "ECONOMY",
      "condition": "NEW_100",
      "description": "Những bài học về tài chính và cách người giàu dạy con về tiền bạc.",
      "imageUrl": "https://salt.tikicdn.com/cache/w1200/ts/product/82/4b/35/cc475d622f717f84cfd6e5a2465842e0.jpg"
    },
    {
      "title": "Cho Tôi Xin Một Vé Đi Tuổi Thơ",
      "author": "Nguyễn Nhật Ánh",
      "isbn": "9786041042780",
      "price": 80000,
      "category": "LITERATURE",
      "condition": "NEW_100",
      "description": "Cuốn sách đưa bạn trở về với những kỷ niệm tuổi thơ trong trẻo và hồn nhiên.",
      "imageUrl": "https://salt.tikicdn.com/cache/w1200/ts/product/5e/2e/d3/960309995817a0201192e4119d690a61.jpg"
    },
    {
      "title": "Harry Potter Và Hòn Đá Phù Thủy",
      "author": "J.K. Rowling",
      "isbn": "9786041103719",
      "price": 120000,
      "category": "LITERATURE",
      "condition": "NEW_100",
      "description": "Phần đầu tiên của bộ truyện về cậu bé phù thủy Harry Potter nổi tiếng thế giới.",
      "imageUrl": "https://salt.tikicdn.com/cache/w1200/ts/product/54/74/4e/de11f0101d91a92e1041935e23652c7c.jpg"
    },
    {
      "title": "Cây Cam Ngọt Của Tôi",
      "author": "José Mauro de Vasconcelos",
      "isbn": "9786045880623",
      "price": 100000,
      "category": "LITERATURE",
      "condition": "NEW_100",
      "description": "Câu chuyện cảm động về chú bé Zezé và người bạn đặc biệt - cây cam ngọt.",
      "imageUrl": "https://salt.tikicdn.com/cache/w1200/ts/product/5e/18/24/2a6154ba08df6ce6161c13f4303fa19e.jpg"
    },
    {
      "title": "Dế Mèn Phiêu Lưu Ký",
      "author": "Tô Hoài",
      "isbn": "9786041001234",
      "price": 150000,
      "category": "CHILDRENS",
      "condition": "NEW_100",
      "description": "Tác phẩm thiếu nhi kinh điển nhất Việt Nam kể về hành trình của chú Dế Mèn.",
      "imageUrl": "https://salt.tikicdn.com/cache/w1200/ts/product/47/54/8e/30bac752bcca2beb34a3522990805aa1.jpg"
    },
    {
      "title": "Thám Tử Lừng Danh Conan - Tập 1",
      "author": "Gosho Aoyama",
      "isbn": "9786042123456",
      "price": 25000,
      "category": "COMICS",
      "condition": "NEW_100",
      "description": "Khởi đầu của thám tử trung học bị teo nhỏ thành học sinh lớp 1.",
      "imageUrl": "https://salt.tikicdn.com/cache/w1200/ts/product/e3/47/b5/52a095864ab48b5168e69a258bb16e22.jpg"
    },
    {
      "title": "Doraemon - Tập 1 (Truyện ngắn)",
      "author": "Fujiko F. Fujio",
      "isbn": "9786042123789",
      "price": 28000,
      "category": "COMICS",
      "condition": "NEW_100",
      "description": "Chú mèo máy thông minh đến từ tương lai giúp đỡ cậu bé Nobita.",
      "imageUrl": "https://salt.tikicdn.com/cache/w1200/ts/product/28/5f/e3/8627a1395e08a75a49a6de654d2b042f.jpg"
    },
    {
      "title": "SGK Toán 1 - Tập 1 (Kết nối tri thức)",
      "author": "Nhiều tác giả",
      "isbn": "9786040123456",
      "price": 35000,
      "category": "TEXTBOOK",
      "condition": "NEW_100",
      "description": "Sách giáo khoa Toán lớp 1 theo chương trình GDPT mới.",
      "imageUrl": "https://salt.tikicdn.com/cache/w1200/ts/product/79/f1/3c/3624d5af1b562c5e6ba6b3e07de7c7ae.jpg"
    },
    {
      "title": "Muôn Kiếp Nhân Sinh - Tập 1",
      "author": "Nguyên Phong",
      "isbn": "9786041009999",
      "price": 175000,
      "category": "OTHERS",
      "condition": "NEW_100",
      "description": "Khám phá luật nhân quả, luân hồi và những bí ẩn của vũ trụ.",
      "imageUrl": "https://salt.tikicdn.com/cache/w1200/ts/product/1c/01/ea/6de2d9ffdbc7142e33c387332440adee.jpg"
    },
    {
      "title": "Nhà Đầu Tư Thông Minh",
      "author": "Benjamin Graham",
      "isbn": "9786045892558",
      "price": 180000,
      "category": "ECONOMY",
      "condition": "NEW_100",
      "description": "Cuốn sách gối đầu giường về đầu tư giá trị cho mọi nhà đầu tư.",
      "imageUrl": "https://salt.tikicdn.com/cache/w1200/ts/product/8f/cf/60/58181c83ee8614f4955786adfd1711b1.jpg"
    },
    {
      "title": "Quẳng Gánh Lo Đi Và Vui Sống",
      "author": "Dale Carnegie",
      "isbn": "9786045678901",
      "price": 85000,
      "category": "SKILLS",
      "condition": "NEW_100",
      "description": "Hướng dẫn chi tiết cách loại bỏ lo âu và tận hưởng niềm vui mỗi ngày.",
      "imageUrl": "https://salt.tikicdn.com/cache/w1200/ts/product/fd/e3/d8/6b2e3e56a1b0a8f8e8e6e5a6b7e6e5a6.jpg"
    },
    {
      "title": "7 Thói Quen Để Thành Đạt",
      "author": "Stephen R. Covey",
      "isbn": "9786045654321",
      "price": 145000,
      "category": "SKILLS",
      "condition": "NEW_100",
      "description": "Những nguyên tắc nền tảng để phát triển bản thân và đạt hiệu quả công việc.",
      "imageUrl": "https://salt.tikicdn.com/cache/w1200/ts/product/f4/64/09/b39d1b643a60f9518d1a108b35048759.jpg"
    },
    {
      "title": "Bí Mật Tư Duy Triệu Phú",
      "author": "T. Harv Eker",
      "isbn": "9786045851456",
      "price": 95000,
      "category": "ECONOMY",
      "condition": "NEW_100",
      "description": "Thay đổi tư duy tài chính để đạt được sự giàu có bền vững.",
      "imageUrl": "https://salt.tikicdn.com/cache/w1200/ts/product/9e/a3/34/747ac6de3d6faaa7c036eab9b89fa254.jpg"
    },
    {
      "title": "Quốc Gia Khởi Nghiệp",
      "author": "Dan Senor & Saul Singer",
      "isbn": "9786041123456",
      "price": 135000,
      "category": "ECONOMY",
      "condition": "NEW_100",
      "description": "Câu chuyện về tinh thần khởi nghiệp mãnh liệt của dân tộc Israel.",
      "imageUrl": "https://salt.tikicdn.com/cache/w1200/ts/product/18/69/34/4952047a0664f3316f466b043236e3c8.jpg"
    },
    {
      "title": "Chiến Tranh Tiền Tệ",
      "author": "Song Hongbing",
      "isbn": "9786041234567",
      "price": 150000,
      "category": "ECONOMY",
      "condition": "NEW_100",
      "description": "Sự thật về lịch sử tiền tệ và các thế lực tài chính đứng sau thế giới.",
      "imageUrl": "https://salt.tikicdn.com/cache/w1200/ts/product/42/8e/a8/b37ba7c1b7e93b093cda29cd30ce36cd.jpg"
    },
    {
      "title": "Không Gia Đình",
      "author": "Hector Malot",
      "isbn": "9786041005678",
      "price": 120000,
      "category": "CHILDRENS",
      "condition": "NEW_100",
      "description": "Cuộc hành trình vượt qua nghịch cảnh đầy cảm động của cậu bé Remi.",
      "imageUrl": "https://salt.tikicdn.com/cache/w1200/ts/product/2e/f1/b7/c7b6f6d0f66e01a0a5522776c5b05c5c.jpg"
    },
    {
      "title": "Pippi Tất Dài",
      "author": "Astrid Lindgren",
      "isbn": "9786041009876",
      "price": 95000,
      "category": "CHILDRENS",
      "condition": "NEW_100",
      "description": "Cô bé mạnh nhất thế giới với những cuộc phiêu lưu đầy bất ngờ.",
      "imageUrl": "https://salt.tikicdn.com/cache/w1200/ts/product/69/83/22/e99120d0c0512164f08049f6c323a237.jpg"
    },
    {
      "title": "Dragon Ball - Tập 1",
      "author": "Akira Toriyama",
      "isbn": "9786042123111",
      "price": 30000,
      "category": "COMICS",
      "condition": "NEW_100",
      "description": "Hành trình tìm kiếm 7 viên ngọc rồng huyền thoại của Son Goku.",
      "imageUrl": "https://salt.tikicdn.com/cache/w1200/ts/product/24/85/65/560413e13bde38316081865a82ab8df1.jpg"
    },
    {
      "title": "Naruto - Tập 1",
      "author": "Masashi Kishimoto",
      "isbn": "9786042123222",
      "price": 30000,
      "category": "COMICS",
      "condition": "NEW_100",
      "description": "Ước mơ trở thành Hokage của cậu bé Naruto bị mọi người xa lánh.",
      "imageUrl": "https://salt.tikicdn.com/cache/w1200/ts/product/00/01/24/e989791444d3202996d9f7962451f5c6.jpg"
    },
    {
      "title": "One Piece - Tập 1",
      "author": "Eiichiro Oda",
      "isbn": "9786042123333",
      "price": 30000,
      "category": "COMICS",
      "condition": "NEW_100",
      "description": "Luffy và hành trình tìm kiếm kho báu vĩ đại nhất để trở thành Vua Hải Tặc.",
      "imageUrl": "https://salt.tikicdn.com/cache/w1200/ts/product/0a/02/05/16a86b995ce76bdaa6326388bafe41d1.jpg"
    },
    {
      "title": "SGK Tiếng Việt 1 - Tập 1 (Kết nối tri thức)",
      "author": "Nhiều tác giả",
      "isbn": "9786040123789",
      "price": 35000,
      "category": "TEXTBOOK",
      "condition": "NEW_100",
      "description": "Sách giáo khoa Tiếng Việt giúp trẻ làm quen với chữ cái và cách đọc.",
      "imageUrl": "https://salt.tikicdn.com/cache/w1200/ts/product/2b/b9/88/d77b6d6910609658e8066e13f4997148.jpg"
    },
    {
      "title": "SGK Tiếng Anh 6 - Global Success",
      "author": "Nhiều tác giả",
      "isbn": "9786040123999",
      "price": 45000,
      "category": "TEXTBOOK",
      "condition": "NEW_100",
      "description": "Sách tiếng Anh lớp 6 theo bộ Global Success chuẩn chương trình mới.",
      "imageUrl": "https://salt.tikicdn.com/cache/w1200/ts/product/14/0d/16/0034a763a8a816a24683a45c7e37a237.jpg"
    },
    {
      "title": "Ánh Sáng Trong Ta",
      "author": "Michelle Obama",
      "isbn": "9786041008888",
      "price": 152000,
      "category": "OTHERS",
      "condition": "NEW_100",
      "description": "Những chia sẻ sâu sắc về cách vượt qua sự bất ổn và tìm thấy chính mình.",
      "imageUrl": "https://salt.tikicdn.com/cache/w1200/ts/product/88/cc/70/fd10f3fd1a45ea447d66a8f98b63bea0.jpg"
    },
    {
      "title": "Đọc Vị Bất Kỳ Ai",
      "author": "David J. Lieberman",
      "isbn": "9786045123456",
      "price": 90000,
      "category": "SKILLS",
      "condition": "NEW_100",
      "description": "Kỹ thuật xâm nhập vào tâm trí người khác để thấu hiểu suy nghĩ của họ.",
      "imageUrl": "https://salt.tikicdn.com/cache/w1200/ts/product/a5/d8/34/841d0260cc305115f6753c25caadd5b0.jpg"
    },
    {
      "title": "Sức Mạnh Của Hiện Tại",
      "author": "Eckhart Tolle",
      "isbn": "9786045987654",
      "price": 115000,
      "category": "SKILLS",
      "condition": "NEW_100",
      "description": "Hướng dẫn tìm kiếm sự bình yên và giác ngộ ngay trong thực tại.",
      "imageUrl": "https://salt.tikicdn.com/cache/w1200/ts/product/bf/87/95/c943c5c65ede2780830da4306ed2e029.jpg"
    },
    {
      "title": "Những Cuộc Phiêu Lưu Của Tom Sawyer",
      "author": "Mark Twain",
      "isbn": "9786041001122",
      "price": 110000,
      "category": "CHILDRENS",
      "condition": "NEW_100",
      "description": "Những trò nghịch ngợm và lòng dũng cảm của cậu bé Tom Sawyer.",
      "imageUrl": "https://salt.tikicdn.com/cache/w1200/media/catalog/product/i/m/img823_7.jpg"
    },
    {
      "title": "SGK Ngữ Văn 10 - Tập 1 (Kết nối tri thức)",
      "author": "Nhiều tác giả",
      "isbn": "9786040123000",
      "price": 40000,
      "category": "TEXTBOOK",
      "condition": "NEW_100",
      "description": "Sách giáo khoa Ngữ Văn lớp 10 chương trình mới.",
      "imageUrl": "https://salt.tikicdn.com/cache/w1200/ts/product/37/ac/4c/4e607f508d2855e1439d0ce796e0af80.jpg"
    },
    {
      title: "Ai Tăng Lương Cho Bạn?",
      author: "Nguyễn Quốc Tuấn",
      isbn: "9786045661001",
      price: 143000,
      category: "SKILLS",
      condition: "NEW_100",
      description: "3 Bí Quyết Đơn Giản Để Thăng Tiến Và Hạnh Phúc Trong Công Việc.",
      imageUrl: "https://placehold.co/600x800/10b981/ffffff.png?text=Ai+T%C4%83ng+L%C6%B0%C6%A1ng+Cho+B%E1%BA%A1n%3F"
    },
    {
      title: "Sống Đời Rủng Rỉnh Thong Dong",
      author: "Lê Hoàng Linh",
      isbn: "9786045661002",
      price: 150000,
      category: "ECONOMY",
      condition: "NEW_100",
      description: "Quản lý tài chính cá nhân một cách thông minh.",
      imageUrl: "https://placehold.co/600x800/3b82f6/ffffff.png?text=S%E1%BB%91ng+%C4%90%E1%BB%9Di+R%E1%BB%A7ng+R%E1%BB%89nh+Thong+Dong"
    },
    {
      title: "Vì Sao Bạn Chưa Giàu?",
      author: "The Simple Sum",
      isbn: "9786045661003",
      price: 191000,
      category: "ECONOMY",
      condition: "NEW_100",
      description: "Hiểu rõ về tiền bạc và cách tạo dựng tài sản.",
      imageUrl: "https://placehold.co/600x800/8b5cf6/ffffff.png?text=V%C3%AC+Sao+B%E1%BA%A1n+Ch%C6%B0a+Gi%C3%A0u%3F"
    },
    {
      title: "7 Ngày Học Kinh Doanh F&B",
      author: "Thuận Nguyễn",
      isbn: "9786045661004",
      price: 162000,
      category: "ECONOMY",
      condition: "NEW_100",
      description: "Bí quyết mở quán cafe, nhà hàng thành công.",
      imageUrl: "https://placehold.co/600x800/f59e0b/ffffff.png?text=7+Ng%C3%A0y+H%E1%BB%8Dc+Kinh+Doanh+F%26B"
    },
    {
      title: "Ứng Dụng AI, Excel Và Word",
      author: "Nguyễn Quang Vinh",
      isbn: "9786045661005",
      price: 522000,
      category: "SKILLS",
      condition: "NEW_100",
      description: "Tối ưu hóa công việc văn phòng bằng công nghệ mới.",
      imageUrl: "https://placehold.co/600x800/ef4444/ffffff.png?text=%E1%BB%A8ng+D%E1%BB%A5ng+AI,+Excel+V%C3%A0+Word"
    },
    {
      title: "Lá Hoa Trên Đường Về",
      author: "Thích Pháp Hòa",
      isbn: "9786045661006",
      price: 125000,
      category: "OTHERS",
      condition: "NEW_100",
      description: "Sách Phật giáo, những bài học sâu sắc về cuộc sống.",
      imageUrl: "https://placehold.co/600x800/059669/ffffff.png?text=L%C3%A1+Hoa+Tr%C3%AAn+%C4%90%C6%B0%E1%BB%9Dng+V%E1%BB%81"
    },
    {
      title: "Thám Tử Lừng Danh Conan 107",
      author: "Gosho Aoyama",
      isbn: "9786045661007",
      price: 25000,
      category: "COMICS",
      condition: "NEW_100",
      description: "Tập mới nhất của bộ truyện trinh thám huyền thoại.",
      imageUrl: "https://placehold.co/600x800/dc2626/ffffff.png?text=Conan+107"
    },
    {
      title: "Sách Tô Màu Phát Triển Trí Não",
      author: "Phạm Ngọc Điệp",
      isbn: "9786045661008",
      price: 110000,
      category: "CHILDRENS",
      condition: "NEW_100",
      description: "Giúp bé phát triển tư duy sáng tạo thông qua màu sắc.",
      imageUrl: "https://placehold.co/600x800/ec4899/ffffff.png?text=T%C3%B4+M%C3%A0u+Ph%C3%A1t+Tri%E1%BB%83n+Tr%C3%AD+N%C3%A3o"
    },
    {
      title: "Ngữ Pháp Tiếng Hàn Thông Dụng",
      author: "Nhiều Tác Giả",
      isbn: "9786045661009",
      price: 236000,
      category: "TEXTBOOK",
      condition: "NEW_100",
      description: "Tài liệu học tiếng Hàn thiết yếu cho người mới bắt đầu.",
      imageUrl: "https://placehold.co/600x800/2563eb/ffffff.png?text=Ng%E1%BB%AF+Ph%C3%A1p+Ti%E1%BA%BFng+H%C3%A0n"
    },
    {
      title: "Siêu Quậy Teppei Tập 1",
      author: "Tetsuya Chiba",
      isbn: "9786045661010",
      price: 24000,
      category: "COMICS",
      condition: "NEW_100",
      description: "Bộ truyện tranh hài hước về cậu bé Teppei.",
      imageUrl: "https://placehold.co/600x800/ea580c/ffffff.png?text=Si%C3%AAu+Qu%E1%BA%ADy+Teppei"
    },
    {
      title: "Thanh Gươm Diệt Quỷ 9",
      author: "Koyoharu Gotouge",
      isbn: "9786045661011",
      price: 24000,
      category: "COMICS",
      condition: "NEW_100",
      description: "Hành trình diệt quỷ đầy gian nan và cảm động.",
      imageUrl: "https://placehold.co/600x800/7c3aed/ffffff.png?text=Thanh+G%C6%B0%C6%A1m+Di%E1%BB%87t+Qu%E1%BB%B7+9"
    },
    {
      title: "Sứ Mệnh Hail Mary",
      author: "Andy Weir",
      isbn: "9786045661012",
      price: 161000,
      category: "LITERATURE",
      condition: "NEW_100",
      description: "Một mình giữa không gian để cứu vãn Trái Đất.",
      imageUrl: "https://placehold.co/600x800/1e40af/ffffff.png?text=S%E1%BB%A9+M%E1%BB%87nh+Hail+Mary"
    },
    {
      title: "Hoa Thơm Kiêu Hãnh",
      author: "Saka Mikami",
      isbn: "9786045661013",
      price: 44000,
      category: "COMICS",
      condition: "NEW_100",
      description: "Truyện tranh lãng mạn học đường.",
      imageUrl: "https://placehold.co/600x800/db2777/ffffff.png?text=Hoa+Th%C6%A1m+Ki%C3%AAu+H%C3%A3nh"
    },
    {
      title: "Nguyên Tội Của Takopi",
      author: "Taizan5",
      isbn: "9786045661014",
      price: 95000,
      category: "COMICS",
      condition: "NEW_100",
      description: "Câu chuyện đen tối và cảm động về Takopi.",
      imageUrl: "https://placehold.co/600x800/4f46e5/ffffff.png?text=Nguy%C3%AAn+T%E1%BB%99i+C%E1%BB%A7a+Takopi"
    },
    {
      title: "Sobotei Dinh Thự Ma Ám",
      author: "Kazuhiro Fujita",
      isbn: "9786045661015",
      price: 37000,
      category: "COMICS",
      condition: "NEW_100",
      description: "Kinh dị và bí ẩn xoay quanh dinh thự Sobotei.",
      imageUrl: "https://placehold.co/600x800/111827/ffffff.png?text=Sobotei+Dinh+Th%E1%BB%B1+Ma+%C3%81m"
    },
    {
      title: "Kẻ Trộm Cà Chua",
      author: "Barbara Constantine",
      isbn: "9786045661016",
      price: 72000,
      category: "LITERATURE",
      condition: "NEW_100",
      description: "Tiểu thuyết Pháp ấm áp về tình người.",
      imageUrl: "https://placehold.co/600x800/be123c/ffffff.png?text=K%E1%BA%BB+Tr%E1%BB%99m+C%C3%A0+Chua"
    },
    {
      title: "Monster - Deluxe Edition",
      author: "Naoki Urasawa",
      isbn: "9786045661017",
      price: 119000,
      category: "COMICS",
      condition: "NEW_100",
      description: "Hành trình truy tìm con quái vật thực sự.",
      imageUrl: "https://placehold.co/600x800/78350f/ffffff.png?text=Monster+Deluxe"
    },
    {
      title: "Thương Tiến Tửu",
      author: "Đường Tửu Khanh",
      isbn: "9786045661018",
      price: 119000,
      category: "LITERATURE",
      condition: "NEW_100",
      description: "Tiểu thuyết đam mỹ quyền mưu đặc sắc.",
      imageUrl: "https://placehold.co/600x800/9d174d/ffffff.png?text=Th%C6%B0%C6%A1ng+Ti%E1%BA%BFn+T%E1%BB%ADu"
    },
    {
      title: "150 Thủ Thuật Văn Phòng",
      author: "Nguyễn Quang Vinh",
      isbn: "9786045661019",
      price: 375000,
      category: "SKILLS",
      condition: "NEW_100",
      description: "Cẩm nang không thể thiếu cho dân văn phòng.",
      imageUrl: "https://placehold.co/600x800/0369a1/ffffff.png?text=150+Th%E1%BB%A7+Thu%E1%BA%ADt+V%C4%83n+Ph%C3%B2ng"
    },
    {
      title: "Sách Bài Tập Lớp 9",
      author: "Nhiều Tác Giả",
      isbn: "9786045661020",
      price: 37000,
      category: "TEXTBOOK",
      condition: "NEW_100",
      description: "Tổng hợp bài tập các môn học sinh lớp 9.",
      imageUrl: "https://placehold.co/600x800/166534/ffffff.png?text=B%C3%A0i+T%E1%BA%ADp+L%E1%BB%9Bp+9"
    }
  ];

  // Tìm user "tuấn" để gán 20 cuốn sách mới
  let tuanUser = await prisma.user.findFirst({
    where: { name: "tuấn" }
  });

  if (!tuanUser) {
    console.log("Không tìm thấy user 'tuấn', gán tạm cho admin...");
    tuanUser = admin;
  }

  for (let i = 0; i < books.length; i++) {
    const bookData = books[i];
    // 30 cuốn đầu (index < 30) cho admin, 20 cuốn sau (index >= 30) cho tuấn
    const targetSellerId = i >= 30 ? tuanUser.id : admin.id;

    let book = await prisma.book.findFirst({
      where: {
        title: bookData.title,
        sellerId: targetSellerId,
      },
    });

    if (!book) {
      book = await prisma.book.create({
        data: {
          ...bookData,
          sellerId: targetSellerId,
        },
      });

      // Add initial price history
      await prisma.priceHistory.create({
        data: {
          bookId: book.id,
          price: bookData.price,
        },
      });
    }
  }

  // Cập nhật tất cả sách lên 10 cuốn
  await prisma.book.updateMany({
    data: {
      stockQuantity: 10
    }
  });

  console.log("30 Sample books created successfully. All books stock set to 10.");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
