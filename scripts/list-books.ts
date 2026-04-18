import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const prisma = new PrismaClient();

async function listBooks() {
  const books = await prisma.book.findMany({
    where: { seller: { email: 'admin@gmail.com' } },
    orderBy: { createdAt: 'desc' },
    take: 50
  });

  console.log("Danh sách sách đã nhập cho System Administrator:");
  console.log("-----------------------------------------------");
  books.forEach((book, index) => {
    console.log(`${index + 1}. ${book.title} - ${Number(book.price).toLocaleString('vi-VN')}đ`);
  });
}

listBooks()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
