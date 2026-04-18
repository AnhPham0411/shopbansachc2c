import { PrismaClient, BookCategory, BookCondition } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("--- Bắt đầu cập nhật và làm giàu dữ liệu sách ---");

  // 1. Phân loại lại sách cũ dựa trên từ khóa trong tiêu đề
  const allBooks = await prisma.book.findMany();
  console.log(`Đang phân loại lại ${allBooks.length} cuốn sách hiện có...`);

  for (const book of allBooks) {
    let newCategory: BookCategory = book.category;
    const title = book.title.toLowerCase();

    if (title.includes("toán") || title.includes("văn") || title.includes("tiếng anh") || title.includes("sgk") || title.includes("lớp")) {
      newCategory = "TEXTBOOK";
    } else if (title.includes("dragon ball") || title.includes("naruto") || title.includes("truyện tranh") || title.includes("conan")) {
      newCategory = "COMICS";
    } else if (title.includes("đắc nhân tâm") || title.includes("kỹ năng") || title.includes("thói quen")) {
      newCategory = "SKILLS";
    } else if (title.includes("kinh tế") || title.includes("tài chính") || title.includes("đầu tư")) {
      newCategory = "ECONOMY";
    } else if (title.includes("truyện") || title.includes("tiểu thuyết")) {
      newCategory = "LITERATURE";
    }

    if (newCategory !== book.category) {
      await prisma.book.update({
        where: { id: book.id },
        data: { category: newCategory }
      });
    }
  }

  // 2. Thêm sách mẫu mới với đầy đủ thông tin
  console.log("Đang thêm sách mẫu mới...");
  
  // Lấy ID của một người bán (mặc định lấy Admin hoặc người đầu tiên)
  const seller = await prisma.user.findFirst({
    where: { role: "ADMIN" }
  }) || await prisma.user.findFirst();

  if (!seller) {
    console.error("Không tìm thấy người dùng nào để gán làm người bán!");
    return;
  }

  const sampleBooks = [
    {
      title: "Cho Tôi Xin Một Vé Đi Tuổi Thơ",
      author: "Nguyễn Nhật Ánh",
      price: 65000,
      condition: "GOOD" as BookCondition,
      category: "LITERATURE" as BookCategory,
      description: "Một tác phẩm kinh điển của Nguyễn Nhật Ánh về thế giới trẻ thơ đầy màu sắc và những suy ngẫm của người lớn.",
      imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80",
      stockQuantity: 5
    },
    {
      title: "Trên Đường Băng",
      author: "Tony Buổi Sáng",
      price: 80000,
      condition: "NEW_100" as BookCondition,
      category: "SKILLS" as BookCategory,
      description: "Cuốn sách truyền cảm hứng mạnh mẽ cho giới trẻ về tư duy và tinh thần khởi nghiệp.",
      imageUrl: "https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&w=800&q=80",
      stockQuantity: 10
    },
    {
      title: "Nhà Giả Kim",
      author: "Paulo Coelho",
      price: 55000,
      condition: "LIKE_NEW" as BookCondition,
      category: "LITERATURE" as BookCategory,
      description: "Hành trình đi tìm kho báu và định mệnh của chàng chăn cừu Santiago.",
      imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
      stockQuantity: 3
    },
    {
      title: "Cha Giàu Cha Nghèo",
      author: "Robert Kiyosaki",
      price: 120000,
      condition: "GOOD" as BookCondition,
      category: "ECONOMY" as BookCategory,
      description: "Bài học về tài chính và tư duy làm giàu từ hai người cha.",
      imageUrl: "https://images.unsplash.com/photo-1614849963640-9cc74b2a826f?auto=format&fit=crop&w=800&q=80",
      stockQuantity: 2
    },
    {
      title: "Doraemon - Tập 1",
      author: "Fujiko F. Fujio",
      price: 18000,
      condition: "OLD" as BookCondition,
      category: "COMICS" as BookCategory,
      description: "Chú mèo máy đến từ tương lai và những cuộc phiêu lưu kì thú cùng Nobita.",
      imageUrl: "https://images.unsplash.com/photo-1589803135900-f00e1273397f?auto=format&fit=crop&w=800&q=80",
      stockQuantity: 20
    },
    {
      title: "Sách giáo khoa Toán 1 (Bản mới)",
      author: "Nhiều tác giả",
      price: 15000,
      condition: "NEW_100" as BookCondition,
      category: "TEXTBOOK" as BookCategory,
      description: "Sách giáo khoa Toán lớp 1 chương trình mới.",
      imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80",
      stockQuantity: 50
    },
    {
      title: "Truyện cổ tích Việt Nam",
      author: "NXB Kim Đồng",
      price: 45000,
      condition: "GOOD" as BookCondition,
      category: "CHILDRENS" as BookCategory,
      description: "Tập hợp những câu chuyện cổ tích hay nhất dành cho thiếu nhi Việt Nam.",
      imageUrl: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80",
      stockQuantity: 8
    },
    {
      title: "Cơ Thể Người - Bách Khoa Toàn Thư",
      author: "Parragon",
      price: 115000,
      condition: "NEW_100" as BookCondition,
      category: "CHILDRENS" as BookCategory,
      description: "Khám phá những bí ẩn bên trong cơ thể con người qua hình ảnh minh họa sinh động.",
      imageUrl: "https://images.unsplash.com/photo-1532012197267-da84d03da436?auto=format&fit=crop&w=800&q=80",
      stockQuantity: 5
    },
    {
      title: "Think and Grow Rich",
      author: "Napoleon Hill",
      price: 95000,
      condition: "LIKE_NEW" as BookCondition,
      category: "ECONOMY" as BookCategory,
      description: "Cuốn sách về tư duy thành công bán chạy nhất mọi thời đại.",
      imageUrl: "https://images.unsplash.com/photo-1592492159418-39f319320569?auto=format&fit=crop&w=800&q=80",
      stockQuantity: 4
    }
  ];

  for (const sample of sampleBooks) {
    await prisma.book.create({
      data: {
        ...sample,
        sellerId: seller.id,
      }
    });
  }

  console.log("--- Hoàn tất cập nhật dữ liệu! ---");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
