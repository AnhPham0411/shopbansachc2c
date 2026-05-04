
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const books = await prisma.book.findMany({
    select: { title: true, imageUrl: true },
    take: 10
  });
  
  console.log("BOOK IMAGES:");
  books.forEach(b => {
    console.log(`- ${b.title}: ${b.imageUrl}`);
  });
}

main().finally(() => prisma.$disconnect());
