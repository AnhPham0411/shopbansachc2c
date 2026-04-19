"use client";

import { motion } from "framer-motion";
import { Star, ShoppingCart, BookOpen } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";

interface Book {
  id: string;
  title: string;
  price: number;
  condition: string;
  category: string;
  author?: string | null;
  imageUrl?: string | null;
  seller: {
    id: string;
    name: string;
  };
}

export function BookCard({ book, index }: { book: Book; index: number }) {
  const { addToCart } = useCart();
  const { data: session } = useSession();
  const isSeller = session?.user?.id === book.seller.id;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isSeller) {
      toast.error("Bạn không thể tự mua sách của chính mình!", {
        style: {
          borderRadius: '16px',
          background: '#333',
          color: '#fff',
          fontWeight: 'bold',
        },
      });
      return;
    }

    addToCart({
      id: book.id,
      title: book.title,
      price: book.price,
      sellerId: book.seller.id,
      sellerName: book.seller.name,
    });

    toast.success(`Đã thêm "${book.title}" vào giỏ hàng!`, {
      style: {
        borderRadius: '16px',
        background: '#333',
        color: '#fff',
        fontWeight: 'bold',
      },
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group relative bg-white rounded-3xl p-3 border border-zinc-100 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 h-full flex flex-col"
    >
      <Link href={`/books/${book.id}`}>
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4 bg-zinc-50 flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-500">
          {book.imageUrl ? (
            <img 
              src={book.imageUrl} 
              alt={book.title} 
              className="w-full h-full object-contain p-2 drop-shadow-xl group-hover:drop-shadow-2xl group-hover:-translate-y-1 transition-all duration-500"
              onError={(e) => {
                (e.target as any).onerror = null;
                (e.target as any).src = ""; 
                (e.target as any).classList.add('hidden');
                (e.target as any).nextSibling.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`${book.imageUrl ? 'hidden' : ''} flex items-center justify-center w-full h-full`}>
            <BookOpen className="w-12 h-12 text-zinc-200" />
          </div>
          <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[10px] font-black text-primary uppercase tracking-wider border border-primary/10">
            {book.condition.replace('_', ' ')}
          </div>
        </div>
      </Link>
      
      <div className="px-1 pb-2 space-y-3 flex-1 flex flex-col justify-between">
        <div>
          <Link href={`/books/${book.id}`}>
            <h3 className="font-bold text-zinc-900 leading-tight group-hover:text-primary transition-colors line-clamp-1 h-5 mb-0.5">
              {book.title}
            </h3>
          </Link>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide mb-2 truncate">
             {book.author || "Chưa cập nhật tác giả"}
          </p>
          <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
            <div className="w-5 h-5 rounded-full bg-zinc-100 flex items-center justify-center text-[8px] font-bold text-zinc-400">
              {book.seller.name?.charAt(0) || "U"}
            </div>
            <span className="truncate">{book.seller.name || "Unknown Seller"}</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-secondary">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-3 h-3 fill-current" />)}
            </div>
            <span className="text-[10px] font-bold text-zinc-400">4.9</span>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-zinc-50">
            <span className="text-xl font-black text-primary">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book.price)}
            </span>
            <button 
              onClick={handleAddToCart}
              className={`p-2.5 rounded-xl transition-all shadow-lg active:scale-90 ${
                isSeller 
                ? "bg-zinc-100 text-zinc-400 cursor-not-allowed shadow-none" 
                : "bg-secondary hover:bg-[#e67500] text-white shadow-secondary/20"
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
