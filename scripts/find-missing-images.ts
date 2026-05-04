
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const books = await prisma.book.findMany({
    where: {
      OR: [
        { imageUrl: null },
        { imageUrl: "" },
        { imageUrl: { contains: "tiki.vn" } } // Old broken URLs usually had tiki.vn
      ]
    },
    select: { id: true, title: true, imageUrl: true }
  });

  console.log(`Found ${books.length} books with missing or potentially broken images:`);
  books.forEach(b => {
    console.log(`- [${b.id}] ${b.title}: ${b.imageUrl}`);
  });
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
