import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { BookCard } from "@/components/books/BookCard";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, BookOpen } from "lucide-react";

interface Book {
  id: string;
  title: string;
  price: number;
  condition: string;
  category: string;
  author?: string | null;
  imageUrl?: string | null;
  stockQuantity: number;
  seller: {
    id: string;
    name: string;
  };
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

const SLUG_MAP: Record<string, { label: string, filter: any }> = {
  "sach-cu": { 
    label: "Sách cũ", 
    filter: { condition: { not: "NEW_100" } } 
  },
  "sach-moi": { 
    label: "Sách mới", 
    filter: { condition: "NEW_100" } 
  },
  "truyen-tranh": { 
    label: "Truyện tranh", 
    filter: { category: "COMICS" } 
  },
  "giao-khoa": { 
    label: "Sách giáo khoa", 
    filter: { category: "TEXTBOOK" } 
  },
};

export default async function CollectionPage({ params }: PageProps) {
  const { slug } = await params;
  const config = SLUG_MAP[slug];

  if (!config) {
    notFound();
  }

  const rawBooks = await prisma.book.findMany({
    where: config.filter,
    orderBy: { createdAt: "desc" },
    include: {
      seller: {
        select: { name: true, id: true }
      }
    }
  });

  const books = rawBooks.map(book => ({
    ...book,
    price: Number(book.price)
  }));

  return (
    <main className="min-h-screen bg-white pt-32 pb-24">
      <Navbar />
      
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-primary font-bold mb-6 transition-colors">
            <ChevronLeft className="w-5 h-5" />
            Quay lại trang chủ
          </Link>
          <div className="flex items-end justify-between border-b border-zinc-100 pb-8">
            <div>
              <h1 className="text-5xl font-black text-zinc-900 mb-4">{config.label}</h1>
              <p className="text-zinc-500 text-lg font-medium">Tìm thấy {books.length} cuốn sách trong danh mục này</p>
            </div>
          </div>
        </div>

        {books.length === 0 ? (
          <div className="py-32 bg-zinc-50 rounded-[48px] flex flex-col items-center justify-center text-zinc-400 border-2 border-dashed border-zinc-100">
            <BookOpen className="w-20 h-20 mb-6 opacity-10" />
            <h3 className="text-xl font-bold mb-2">Chưa có sách nào trong danh mục này</h3>
            <p className="max-w-xs text-center">Hãy quay lại sau hoặc là người đầu tiên đăng bán sách của bạn!</p>
            <Link href="/seller/books" className="mt-8 px-8 py-3 bg-primary text-white rounded-2xl font-bold hover:bg-[#00a39f] shadow-xl shadow-primary/20">
              ĐĂNG BÁN NGAY
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {books.map((book, index) => (
              <BookCard key={book.id} book={book} index={index} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
