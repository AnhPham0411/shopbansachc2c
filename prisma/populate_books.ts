import { PrismaClient, BookCondition, BookCategory } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Find a seller or create one if none exists
  let seller = await prisma.user.findFirst({
    where: { role: "SELLER" },
  });

  if (!seller) {
    // Try to find admin
    seller = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    });
  }

  if (!seller) {
    console.log("No seller or admin found. Creating a default seller...");
    seller = await prisma.user.create({
      data: {
        email: "seller@example.com",
        name: "Libris Bookseller",
        passwordHash: "hashed_password", // Placeholder
        role: "SELLER",
      },
    });
  }

  console.log(`Using seller: ${seller.name} (${seller.id})`);

  const booksData = [
    // SÁCH MỚI (NEW_100)
    {
      title: "Đắc Nhân Tâm (Khổ Lớn)",
      price: 85000,
      condition: "NEW_100" as BookCondition,
      category: "SKILLS" as BookCategory,
      stockQuantity: 10,
    },
    {
      title: "Nhà Giả Kim",
      price: 65000,
      condition: "NEW_100" as BookCondition,
      category: "LITERATURE" as BookCategory,
      stockQuantity: 5,
    },
    
    // SÁCH CŨ (GOOD, OLD, LIKE_NEW)
    {
      title: "Chiến Tranh và Hòa Bình (Trọn Bộ 4 Tập - Cũ)",
      price: 150000,
      condition: "GOOD" as BookCondition,
      category: "LITERATURE" as BookCategory,
      stockQuantity: 1,
    },
    {
      title: "Bố Già (The Godfather) - Bìa Cứng Cũ",
      price: 45000,
      condition: "OLD" as BookCondition,
      category: "LITERATURE" as BookCategory,
      stockQuantity: 1,
    },

    // TRUYỆN TRANH (COMICS)
    {
      title: "Doraemon - Tập 1 (Bản Truyền Thống)",
      price: 25000,
      condition: "LIKE_NEW" as BookCondition,
      category: "COMICS" as BookCategory,
      stockQuantity: 5,
    },
    {
      title: "Thám Tử Lừng Danh Conan - Tập 100",
      price: 30000,
      condition: "NEW_100" as BookCondition,
      category: "COMICS" as BookCategory,
      stockQuantity: 10,
    },
    {
      title: "Dragon Ball - Bảy Viên Ngọc Rồng (Tập 1)",
      price: 20000,
      condition: "GOOD" as BookCondition,
      category: "COMICS" as BookCategory,
      stockQuantity: 2,
    },

    // SÁCH GIÁO KHOA (TEXTBOOK)
    {
      title: "Sách Giáo Khoa Toán Lớp 12",
      price: 15000,
      condition: "GOOD" as BookCondition,
      category: "TEXTBOOK" as BookCategory,
      stockQuantity: 20,
    },
    {
      title: "Sách Giáo Khoa Ngữ Văn Lớp 10 (Tập 1)",
      price: 12000,
      condition: "OLD" as BookCondition,
      category: "TEXTBOOK" as BookCategory,
      stockQuantity: 15,
    },
    {
      title: "Tiếng Anh 12 (Sách Học Sinh - Mới)",
      price: 22000,
      condition: "NEW_100" as BookCondition,
      category: "TEXTBOOK" as BookCategory,
      stockQuantity: 5,
    },
  ];

  console.log("Seeding books...");

  for (const book of booksData) {
    await prisma.book.create({
      data: {
        ...book,
        sellerId: seller.id,
      },
    });
  }

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
