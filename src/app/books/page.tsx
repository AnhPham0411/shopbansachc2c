import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { BookCatalog } from "@/components/books/BookCatalog";
import { serializePrisma } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function BooksPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ search?: string }> 
}) {
  const { search } = await searchParams;

  const rawBooks = await prisma.book.findMany({
    where: search ? {
      OR: [
        { title: { contains: search } },
        { author: { contains: search } },
      ]
    } : {},
    orderBy: { createdAt: "desc" },
    include: {
      seller: {
        select: { name: true, id: true, isVerified: true }
      }
    }
  });

  const books = serializePrisma(rawBooks);

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-44">
        <BookCatalog initialBooks={books} initialSearch={search} />
      </div>
    </main>
  );
}
