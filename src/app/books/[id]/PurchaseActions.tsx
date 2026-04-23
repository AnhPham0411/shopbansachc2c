"use client";

import { useCart } from "@/lib/cart";
import { ShoppingCart, Zap, MessageSquare, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";

interface PurchaseActionsProps {
  book: {
    id: string;
    title: string;
    price: number;
    sellerId: string;
    seller: {
      name: string;
    };
  };
}

export function PurchaseActions({ book }: PurchaseActionsProps) {
  const { addToCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const [isAdded, setIsAdded] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);

  const isSeller = session?.user?.id === book.sellerId;

  const handleAddToCart = () => {
    if (isSeller) return;
    addToCart({
      id: book.id,
      title: book.title,
      price: book.price,
      sellerId: book.sellerId,
      sellerName: book.seller.name,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (isSeller) return;
    handleAddToCart();
    router.push("/checkout");
  };

  if (isSeller) {
    return (
      <div className="p-6 bg-zinc-50 rounded-[32px] border-2 border-dashed border-zinc-200 text-center">
        <p className="text-zinc-500 font-bold text-sm leading-relaxed">
          Đây là sách bạn đang đăng bán. <br />
          <span className="text-zinc-400 font-medium">Bạn không thể tự mua sản phẩm của chính mình.</span>
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <motion.button 
          whileTap={{ scale: 0.98 }}
          onClick={handleAddToCart}
          className={`flex-1 font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all border-2 ${
            isAdded 
            ? "bg-primary/10 border-primary text-primary" 
            : "bg-white border-primary/20 text-primary hover:border-primary/40 hover:bg-primary/5"
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
          {isAdded ? "ĐÃ THÊM VÀO GIỎ" : "THÊM VÀO GIỎ"}
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.98 }}
          onClick={handleBuyNow}
          className="flex-1 bg-secondary text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-[#e67500] transition-all shadow-lg shadow-secondary/20"
        >
          <Zap className="w-5 h-5 fill-current" />
          MUA NGAY
        </motion.button>
      </div>
      
      <motion.button 
        whileTap={{ scale: 0.98 }}
        disabled={isChatLoading}
        onClick={async () => {
          if (!session) {
            toast.error("Vui lòng đăng nhập để trò chuyện");
            router.push(`/login?callbackUrl=${encodeURIComponent(`/books/${book.id}`)}`);
            return;
          }
          
          setIsChatLoading(true);
          try {
            const res = await fetch("/api/chat/conversations", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ sellerId: book.sellerId, bookId: book.id }),
            });
            
            const data = await res.json();
            
            if (res.ok) {
              router.push(`/chat?id=${data.id}`);
            } else {
              toast.error(data.error || "Không thể khởi tạo cuộc trò chuyện");
              setIsChatLoading(false);
            }
          } catch (error) {
            toast.error("Đã có lỗi xảy ra, vui lòng thử lại");
            setIsChatLoading(false);
          }
        }}
        className={`w-full bg-white border border-zinc-200 text-zinc-600 font-bold py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-zinc-50 transition-all shadow-sm ${isChatLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {isChatLoading ? (
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
        ) : (
          <MessageSquare className="w-5 h-5 text-primary" />
        )}
        {isChatLoading ? "Đang kết nối..." : "Trò chuyện với người bán"}
      </motion.button>
    </div>
  );
}
