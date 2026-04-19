"use client";

import { motion } from "framer-motion";
import { Ticket, Copy, CheckCircle2, Zap } from "lucide-react";
import { useState } from "react";

interface Voucher {
  id: string;
  code: string;
  description: string | null;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  discountValue: number;
  minOrderAmount: number;
}

export function Promotions({ vouchers }: { vouchers: any[] }) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/10 text-[10px] font-black text-secondary uppercase tracking-widest">
              <Zap className="w-3 h-3 fill-current" />
              <span>Ưu đãi giới hạn</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tight">
              Săn mã giảm giá, <br />
              <span className="text-primary text-gradient">đọc sách thả ga.</span>
            </h2>
            <p className="text-zinc-500 font-medium max-w-md">
              Áp dụng ngay các mã giảm giá độc quyền từ Libris để tiết kiệm chi phí cho kho tàng tri thức của bạn.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {vouchers.map((voucher, idx) => (
            <motion.div
              key={voucher.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-[32px] blur-2xl group-hover:opacity-100 transition-opacity opacity-0" />
              
              <div className="relative glass-card overflow-hidden bg-white border border-zinc-100 rounded-[32px] p-1 shadow-sm group-hover:shadow-xl group-hover:border-primary/20 transition-all duration-500">
                <div className="p-7 flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
                    <Ticket className="w-8 h-8 text-primary" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-black text-xl text-zinc-900 tracking-tight">{voucher.code}</span>
                      <div className="h-1.5 w-1.5 rounded-full bg-zinc-200" />
                      <span className="text-[10px] font-black text-secondary uppercase tracking-tighter bg-secondary/10 px-2 py-0.5 rounded-full">
                        HOT
                      </span>
                    </div>
                    
                    <p className="text-sm font-bold text-zinc-900 leading-snug line-clamp-1">
                      {voucher.description || "Giảm giá đặc biệt cho bạn"}
                    </p>
                    
                    <div className="mt-3 flex items-center gap-3">
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                        {voucher.discountType === "PERCENTAGE" 
                          ? `Giảm ${voucher.discountValue}%` 
                          : `Giảm ${new Intl.NumberFormat('vi-VN').format(voucher.discountValue)}đ`}
                      </p>
                      <div className="w-1 h-1 rounded-full bg-zinc-200" />
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                         Đơn từ {new Intl.NumberFormat('vi-VN').format(voucher.minOrderAmount)}đ
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopy(voucher.code)}
                    className={`p-4 rounded-2xl border-2 transition-all duration-300 flex-shrink-0 ${
                      copiedCode === voucher.code
                        ? "bg-green-500 border-green-500 text-white"
                        : "bg-zinc-50 border-zinc-50 text-zinc-400 hover:border-primary/30 hover:text-primary hover:bg-primary/5"
                    }`}
                  >
                    {copiedCode === voucher.code ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <Copy className="w-6 h-6" />
                    )}
                  </button>
                </div>

                {/* Decorative cutouts */}
                <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 rounded-full bg-white border border-zinc-100 shadow-inner" />
                <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 rounded-full bg-white border border-zinc-100 shadow-inner" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
