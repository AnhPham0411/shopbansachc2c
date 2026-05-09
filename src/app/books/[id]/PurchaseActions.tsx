"use client";

import { useCart } from "@/lib/cart";
import { ShoppingCart, Zap, MessageSquare, Loader2, Heart, Tag } from "lucide-react";
import { OfferDialog } from "@/components/books/OfferDialog";
import { toggleFavorite } from "@/lib/favorite-actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface PurchaseActionsProps {
  book: {
    id: string;
    title: string;
    price: number;
    sellerId: string;
    seller: {
      name: string;
    };
    imageUrl?: string | null;
  };
  initialIsFavorite?: boolean;
}

export function PurchaseActions({ book, initialIsFavorite }: PurchaseActionsProps) {
  const { addToCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const { t } = useLanguage();
  const [isAdded, setIsAdded] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const [isOfferOpen, setIsOfferOpen] = useState(false);

  const isSeller = session?.user?.id === book.sellerId;

  const handleAddToCart = () => {
    if (isSeller) return;
    addToCart({
      id: book.id,
      title: book.title,
      price: book.price,
      sellerId: book.sellerId,
      sellerName: book.seller.name,
      imageUrl: book.imageUrl,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (isSeller) return;
    handleAddToCart();
    router.push("/checkout");
  };

  const handleToggleFavorite = async () => {
    if (!session) {
      toast.error(t("book.loginToFavorite"));
      router.push(`/login?callbackUrl=${encodeURIComponent(`/books/${book.id}`)}`);
      return;
    }

    setIsFavoriteLoading(true);
    try {
      const res = await toggleFavorite(book.id);
      if (res.success) {
        setIsFavorite(res.isFavorite);
        toast.success(res.isFavorite ? t("book.addedToFavorites") : t("book.removedFromFavorites"));
      } else {
        toast.error(res.error || t("book.errorOccurred"));
      }
    } catch (error) {
      toast.error(t("book.errorOccurred"));
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  if (isSeller) {
    return (
      <div className="p-6 bg-zinc-50 rounded-[32px] border-2 border-dashed border-zinc-200 text-center">
        <p className="text-zinc-500 font-bold text-sm leading-relaxed">
          {t("book.sellerNotice")}
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
          {isAdded ? t("book.addedToCart") : t("book.addToCart")}
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.98 }}
          onClick={handleBuyNow}
          className="flex-1 bg-secondary text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-[#e67500] transition-all shadow-lg shadow-secondary/20"
        >
          <Zap className="w-5 h-5 fill-current" />
          {t("book.buyNow")}
        </motion.button>
      </div>
      
      <motion.button 
        whileTap={{ scale: 0.98 }}
        disabled={isChatLoading}
        onClick={async () => {
          if (!session) {
            toast.error(t("book.loginToChat"));
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
              toast.error(data.error || t("book.chatInitError"));
              setIsChatLoading(false);
            }
          } catch (error) {
            toast.error(t("book.tryAgain"));
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
        {isChatLoading ? t("book.connecting") : t("book.chatWithSeller")}
      </motion.button>

      <motion.button 
        whileTap={{ scale: 0.98 }}
        disabled={isFavoriteLoading}
        onClick={handleToggleFavorite}
        className={`w-full bg-zinc-50 border border-zinc-100 text-zinc-600 font-bold py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-zinc-100 transition-all ${isFavoriteLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        <Heart className={`w-5 h-5 ${isFavorite ? 'fill-primary text-primary' : 'text-zinc-400'}`} />
        {isFavorite ? t("book.removeFromFavorites") : t("book.saveToFavorites")}
      </motion.button>

      {session && (
        <motion.button 
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsOfferOpen(true)}
          className="w-full bg-orange-50 border border-orange-100 text-orange-600 font-bold py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-orange-100 transition-all"
        >
          <Tag className="w-5 h-5" />
          {t("book.negotiate")}
        </motion.button>
      )}

      {session && (
        <OfferDialog 
          isOpen={isOfferOpen}
          onClose={() => setIsOfferOpen(false)}
          book={book}
          buyerId={(session.user as any).id}
        />
      )}
    </div>
  );
}
