const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.book.updateMany({
    where: { title: '7 Thói Quen Để Thành Đạt' },
    data: { imageUrl: '/images/books/7-thoi-quen.png' }
  });
  console.log('Updated:', result.count);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
