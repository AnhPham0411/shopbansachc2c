import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.book.updateMany({
    data: {
      stockQuantity: 10
    }
  });
  console.log(`Updated ${result.count} books to have a stock quantity of 10.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
