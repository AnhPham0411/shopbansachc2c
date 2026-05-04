"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, X, DollarSign, Send, Loader2 } from "lucide-react";
import { createOffer } from "@/lib/offer-actions";
import { toast } from "react-hot-toast";

interface OfferDialogProps {
  book: {
    id: string;
    title: string;
    price: number;
    sellerId: string;
  };
  buyerId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function OfferDialog({ book, buyerId, isOpen, onClose }: OfferDialogProps) {
  const [amount, setAmount] = useState<string>("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const offerAmount = parseFloat(amount);
    
    if (isNaN(offerAmount) || offerAmount <= 0) {
      toast.error("Vui lòng nhập giá hợp lệ");
      return;
    }

    if (offerAmount >= book.price) {
      toast.error("Giá đề nghị phải thấp hơn giá hiện tại");
      return;
    }

    setIsLoading(true);
    const res = await createOffer({
      buyerId,
      sellerId: book.sellerId,
      bookId: book.id,
      amount: offerAmount,
      message,
    });

    if (res.success) {
      toast.success("Đã gửi lời đề nghị thành công!");
      onClose();
    } else {
      toast.error(res.error || "Có lỗi xảy ra");
    }
    setIsLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-[40px] p-8 shadow-2xl overflow-hidden"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 hover:bg-zinc-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-zinc-400" />
            </button>

            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center">
                <Tag className="w-7 h-7 text-orange-500" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-zinc-900 leading-tight">Trả giá sách</h3>
                <p className="text-zinc-500 font-medium">{book.title}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-black text-zinc-900 uppercase tracking-widest px-1">
                  Giá bạn muốn đề nghị
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="VD: 50000"
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-4 pl-12 pr-4 font-black text-xl text-primary outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                    required
                  />
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                </div>
                <p className="text-[11px] text-zinc-400 font-bold px-1">
                  Giá hiện tại: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book.price)}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black text-zinc-900 uppercase tracking-widest px-1">
                  Lời nhắn gửi seller
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tôi rất thích cuốn này, bạn có thể giảm chút được không?"
                  className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl p-4 font-medium text-sm min-h-[100px] outline-none focus:ring-4 focus:ring-primary/10 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
                {isLoading ? "Đang gửi..." : "GỬI ĐỀ NGHỊ"}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
