const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const books = await prisma.book.findMany({
    take: 10,
    select: { id: true, title: true, imageUrl: true }
  });
  console.log(JSON.stringify(books, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
