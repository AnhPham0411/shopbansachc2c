"use client";

import { useCart, CartItem } from "@/lib/cart";
import { Navbar } from "@/components/layout/Navbar";
import { Trash2, ShoppingBag, ArrowRight, Truck, ShieldCheck, CreditCard, ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, total, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const router = useRouter();

  // Group items by Seller
  const groupedItems = cart.reduce((acc, item) => {
    if (!acc[item.sellerId]) {
      acc[item.sellerId] = {
        sellerName: item.sellerName,
        items: [],
      };
    }
    acc[item.sellerId].items.push(item);
    return acc;
  }, {} as Record<string, { sellerName: string; items: CartItem[] }>);

  const sellers = Object.keys(groupedItems);

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-white text-zinc-900">
        <Navbar />
        <div className="container mx-auto px-6 pt-40 pb-20 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 bg-zinc-50 rounded-full flex items-center justify-center mb-6 border border-zinc-100">
            <ShoppingBag className="w-10 h-10 text-zinc-300" />
          </div>
          <h1 className="text-3xl font-black mb-4">Giỏ hàng của bạn đang trống</h1>
          <p className="text-zinc-500 mb-8 max-w-sm font-medium">Hãy khám phá hàng ngàn cuốn sách hấp dẫn từ cộng đồng yêu sách.</p>
          <Link href="/" className="px-10 py-4 bg-primary text-white font-black rounded-2xl hover:bg-[#00a39f] transition-all shadow-xl shadow-primary/20">
            Khám phá ngay
          </Link>
        </div>
      </main>
    );
  }

  const handleCheckout = () => {
    if (cart.length === 0) return;
    router.push("/checkout");
  };

  return (
    <main className="min-h-screen bg-[#F8F9FA] text-zinc-900 pb-20">
      <Navbar />
      
      <div className="container mx-auto px-6 md:px-12 pt-32">
        <div className="flex items-center gap-4 mb-10">
          <h1 className="text-4xl font-black tracking-tight">Giỏ hàng</h1>
          <span className="px-3 py-1 bg-white border border-zinc-200 rounded-full text-xs font-bold text-zinc-500">
            {cart.length} món
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Cart List */}
          <div className="lg:col-span-8 space-y-6">
            <AnimatePresence>
              {sellers.map((sellerId) => (
                <motion.div 
                  key={sellerId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-[32px] border border-zinc-200 overflow-hidden shadow-sm"
                >
                  <div className="px-6 py-4 bg-zinc-50 border-b border-zinc-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                        <ShoppingBag className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <span className="text-sm font-black text-zinc-700">Shop: {groupedItems[sellerId].sellerName}</span>
                    </div>
                  </div>
                  
                  <div className="divide-y divide-zinc-100">
                    {groupedItems[sellerId].items.map((item) => (
                      <div key={item.id} className="p-6 flex gap-6">
                        <div className="w-20 h-28 bg-zinc-50 rounded-2xl flex-shrink-0 flex items-center justify-center border border-zinc-100">
                           <ShoppingBag className="w-8 h-8 text-zinc-200" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-lg text-zinc-900 leading-tight">{item.title}</h3>
                              <p className="text-xs text-zinc-500 mt-1 font-medium">Bán bởi: {groupedItems[sellerId].sellerName}</p>
                            </div>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="p-2 hover:bg-red-50 text-zinc-400 hover:text-red-500 rounded-xl transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <div className="flex justify-between items-center mt-4">
                            <div className="flex items-center gap-1 bg-zinc-50 rounded-xl p-1 border border-zinc-100">
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-lg transition-all text-zinc-500 font-bold"
                              >-</button>
                              <span className="text-sm font-black w-6 text-center text-zinc-900">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-lg transition-all text-zinc-500 font-bold"
                              >+</button>
                            </div>
                            <span className="font-black text-xl text-primary">
                               {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Checkout Summary */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit space-y-6">
            <div className="bg-white p-8 rounded-[40px] border border-zinc-200 shadow-sm space-y-8">
              <h2 className="text-xl font-black text-zinc-900">Chi tiết đơn hàng</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-zinc-500">Tạm tính ({cart.length} món)</span>
                  <span className="text-zinc-900 font-bold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}</span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-zinc-500">Vận chuyển</span>
                  <span className="text-primary font-bold">Miễn phí</span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-zinc-500">Bảo hiểm Escrow (2%)</span>
                  <span className="text-zinc-900 font-bold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total * 0.02)}</span>
                </div>
              </div>

              <div className="h-px bg-zinc-100" />

              <div className="flex justify-between items-end">
                <span className="font-black text-zinc-900 uppercase tracking-wider text-xs">Tổng cộng</span>
                <span className="text-3xl font-black text-primary">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total * 1.02)}
                </span>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full bg-secondary text-white font-black py-5 rounded-[24px] flex items-center justify-center gap-3 hover:bg-[#e67500] transition-all shadow-xl shadow-secondary/20 disabled:opacity-50 text-lg"
              >
                {isCheckingOut ? "Đang thanh toán..." : "THANH TOÁN LIBRIS"}
                {!isCheckingOut && <ChevronRight className="w-5 h-5" />}
              </button>

              <div className="flex flex-col gap-4 pt-4">
                <div className="flex items-center gap-3 p-3 bg-[#F5F9F9] rounded-2xl border border-primary/10">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest leading-relaxed">Tiền chỉ được giải ngân cho shop khi bạn đã nhận hàng.</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-primary/5 rounded-[32px] border border-primary/10">
              <div className="flex items-start gap-4">
                 <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-5 h-5 text-primary" />
                 </div>
                 <div>
                   <h4 className="text-sm font-black text-zinc-900 mb-1">Cơ chế tách đơn an toàn</h4>
                   <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">
                     Libris sẽ tự động tạo đơn hàng riêng cho từng chủ sách để đảm bảo quyền lợi và quá trình đối soát tiền (Escrow) diễn ra minh bạch nhất.
                   </p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
