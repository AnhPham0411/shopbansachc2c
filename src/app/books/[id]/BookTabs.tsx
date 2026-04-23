"use client";

import { useState } from "react";
import { Star, User, Shield, Truck } from "lucide-react";

interface BookTabsProps {
  description: string | null;
  reviews: any[];
}

export function BookTabs({ description, reviews }: BookTabsProps) {
  const [activeTab, setActiveTab] = useState<"description" | "reviews">("description");

  return (
    <div className="space-y-12">
      <div className="flex gap-12 border-b border-zinc-100">
        <button 
          onClick={() => setActiveTab("description")}
          className={`pb-6 text-sm uppercase tracking-widest font-black transition-all ${
            activeTab === "description" 
            ? "text-zinc-900 border-b-4 border-primary" 
            : "text-zinc-300 hover:text-zinc-500"
          }`}
        >
          Mô tả sản phẩm
        </button>
        <button 
          onClick={() => setActiveTab("reviews")}
          className={`pb-6 text-sm uppercase tracking-widest font-black transition-all flex items-center gap-2 ${
            activeTab === "reviews" 
            ? "text-zinc-900 border-b-4 border-primary" 
            : "text-zinc-300 hover:text-zinc-500"
          }`}
        >
          Nhận xét 
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${
            activeTab === "reviews" ? "bg-primary/10 text-primary" : "bg-zinc-100 text-zinc-400"
          }`}>
            {reviews.length}
          </span>
        </button>
      </div>
      
      <div className="space-y-12 min-h-[400px]">
        {activeTab === "description" ? (
          <div className="text-zinc-600 leading-relaxed font-medium space-y-6 animate-in fade-in duration-500">
            <p className="text-lg whitespace-pre-line">
              {description || "Người bán chưa cập nhật mô tả chi tiết cho cuốn sách này. Vui lòng liên hệ người bán để biết thêm thông tin."}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-white rounded-[32px] border border-zinc-100 shadow-sm">
                <h4 className="text-primary font-black text-xs mb-4 flex items-center gap-3 uppercase tracking-widest">
                  <Shield className="w-5 h-5 text-primary" /> Thanh toán Escrow
                </h4>
                <p className="text-xs text-zinc-500 leading-relaxed font-bold">
                  Tiền của bạn sẽ được giam tại sàn (Escrow) và chỉ nhả cho người bán khi bạn xác nhận đã nhận được sách đúng mô tả.
                </p>
              </div>
              <div className="p-8 bg-white rounded-[32px] border border-zinc-100 shadow-sm">
                <h4 className="text-zinc-900 font-black text-xs mb-4 flex items-center gap-3 uppercase tracking-widest">
                  <Truck className="w-5 h-5 text-zinc-900" /> Vận chuyển & Phí
                </h4>
                <p className="text-xs text-zinc-500 leading-relaxed font-bold">
                  Sách sẽ được đối soát và gửi qua đơn vị vận chuyển uy tín trong vòng 24-48h sau khi đặt hàng. 
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-500">
            <h3 className="text-2xl font-black text-zinc-900 flex items-center gap-3">
              <Star className="text-secondary fill-current" /> Đánh giá từ người mua
            </h3>
            
            {reviews.length === 0 ? (
              <div className="p-10 bg-zinc-50 rounded-[32px] border border-zinc-100 border-dashed text-center text-zinc-400 font-bold italic">
                Chưa có đánh giá nào cho cuốn sách này.
              </div>
            ) : (
              <div className="grid gap-6">
                {reviews.map((review) => (
                  <div key={review.id} className="p-8 bg-white rounded-[32px] border border-zinc-100 shadow-sm space-y-4 hover:border-primary/20 transition-all">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-zinc-400 text-sm">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-zinc-900">Người mua ẩn danh</p>
                          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                            {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-secondary">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`w-3.5 h-3.5 ${review.rating >= s ? 'fill-current' : 'text-zinc-200'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-zinc-700 font-medium leading-relaxed italic">"{review.comment}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
