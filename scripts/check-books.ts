import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.book.count();
  const books = await prisma.book.findMany({
    select: { title: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
    take: 40
  });
  
  console.log(`TOTAL_BOOKS_COUNT: ${count}`);
  console.log("RECENT_BOOKS:");
  books.forEach(b => console.log(`- ${b.title} (${b.createdAt})`));
}

main().finally(() => prisma.$disconnect());
