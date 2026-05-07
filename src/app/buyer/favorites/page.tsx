import { getFavorites } from "@/lib/favorite-actions";
import { BookCard } from "@/components/books/BookCard";
import { Heart, BookOpen, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";

export default async function FavoritesPage() {
  const favoriteBooks = await getFavorites();

  return (
    <main className="min-h-screen bg-[#F8F9FA] text-zinc-900 pb-24">
      <Navbar />
      
      <div className="container mx-auto px-6 md:px-12 pt-44">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-primary font-bold mb-8 transition-colors group"
        >
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-zinc-100 shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
            <ChevronLeft className="w-5 h-5" />
          </div>
          Về trang chủ
        </Link>

        <div className="flex items-center gap-4 mb-12">
          <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-sm border border-zinc-100">
            <Heart className="w-8 h-8 text-primary fill-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-zinc-900 tracking-tight">Sách yêu thích</h1>
            <p className="text-zinc-500 font-medium">Danh sách những cuốn sách bạn đã lưu lại.</p>
          </div>
        </div>

        {favoriteBooks.length === 0 ? (
          <div className="bg-white rounded-[40px] py-32 flex flex-col items-center justify-center border border-zinc-100 shadow-sm">
            <div className="w-24 h-24 bg-zinc-50 rounded-full flex items-center justify-center mb-8">
               <BookOpen className="w-12 h-12 text-zinc-300" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 mb-2">Chưa có sách yêu thích</h2>
            <p className="text-zinc-500 font-medium max-w-sm text-center mb-10">
              Hãy dạo quanh cửa hàng và lưu lại những cuốn sách bạn yêu thích để xem lại sau nhé!
            </p>
            <Link 
              href="/books" 
              className="bg-primary text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-primary/20 hover:scale-105 transition-all active:scale-95"
            >
              Khám phá ngay
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {favoriteBooks.map((book: any, index: number) => (
              <BookCard key={book.id} book={book} index={index} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
