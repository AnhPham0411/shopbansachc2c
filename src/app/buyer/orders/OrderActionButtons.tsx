"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle, MessageSquare, Star, X } from "lucide-react";
import { completeOrder, cancelOrder } from "@/lib/order-actions";
import { raiseDispute } from "@/lib/dispute-actions";
import { postReview } from "@/lib/review-actions";
import { motion, AnimatePresence } from "framer-motion";

interface OrderActionButtonsProps {
  subOrder: any;
  discountAmount?: number;
  grandSubTotal?: number;
}

export function OrderActionButtons({ subOrder, discountAmount = 0, grandSubTotal = 0 }: OrderActionButtonsProps) {
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Dispute form state
  const [disputeReason, setDisputeReason] = useState("Sách không giống mô tả");
  const [disputeDesc, setDisputeDesc] = useState("");
  const [disputeImages, setDisputeImages] = useState("");

  // Review form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleComplete = async () => {
    if (!confirm("Xác nhận đã nhận hàng? Tiền sẽ được giải ngân cho người bán.")) return;
    setLoading(true);
    await completeOrder(subOrder.id);
    setLoading(false);
  };

  const handleCancel = async () => {
    if (!confirm("Bạn có chắc chắn muốn hủy đơn hàng này? Tiền sẽ được hoàn trả vào ví của bạn.")) return;
    setLoading(true);
    const res = await cancelOrder(subOrder.id);
    if (res.success) {
      alert("Đã hủy đơn hàng thành công.");
    } else {
      alert(res.error || "Lỗi khi hủy đơn hàng.");
    }
    setLoading(false);
  };

  const handleDispute = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await raiseDispute(subOrderId, disputeReason, disputeDesc, disputeImages);
    if (res.success) {
      setShowDisputeModal(false);
      alert("Đã gửi khiếu nại thành công. Chờ người bán phản hồi.");
    } else {
      alert(res.error);
    }
    setLoading(false);
  };

  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await postReview(subOrder.id, rating, comment);
    if (res.success) {
      setShowReviewModal(false);
      alert("Đã đăng đánh giá thành công.");
    } else {
      alert(res.error);
    }
    setLoading(false);
  };

  const subOrderId = subOrder.id;

  const subTotal = Number(subOrder.subTotal);
  const subOrderDiscount = (grandSubTotal > 0) ? (subTotal / grandSubTotal) * discountAmount : 0;
  const finalDisplayTotal = subTotal - subOrderDiscount;

  return (
    <div className="flex flex-wrap gap-3 pt-6 border-t border-zinc-100">
      <div className="flex-1">
        <span className="text-sm text-zinc-500 font-medium">Thanh toán:</span>
        <div className="text-xl font-black text-primary">
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(finalDisplayTotal)}
        </div>
        {subOrderDiscount > 0 && (
          <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mt-1">
            Đã áp dụng giảm giá proportional
          </p>
        )}
      </div>

      <div className="flex gap-2">
        {/* Nút Nhận hàng & Khiếu nại (Chỉ hiện khi chưa hoàn thành/khiếu nại/hủy) */}
        {subOrder.status !== "COMPLETED" && subOrder.status !== "DISPUTED" && subOrder.status !== "REFUNDED" && (
          <>
            {subOrder.status === "PENDING" ? (
              <button 
                onClick={handleCancel}
                className="flex items-center gap-2 px-6 py-2 bg-red-50 text-red-600 font-black rounded-lg border border-red-100 hover:bg-red-100 transition-all text-sm"
                disabled={loading}
              >
                <X className="w-4 h-4" />
                Hủy đơn hàng
              </button>
            ) : (subOrder.status === "SHIPPING" || subOrder.status === "DELIVERED") ? (
              <>
                <button 
                  onClick={() => setShowDisputeModal(true)}
                  className="flex items-center gap-2 px-4 py-2 text-zinc-500 font-bold rounded-lg border border-zinc-200 hover:bg-zinc-50 transition-all text-sm"
                  disabled={loading}
                >
                  <AlertCircle className="w-4 h-4" />
                  Trả hàng/Hoàn tiền
                </button>
                <button 
                  onClick={handleComplete}
                  className="flex items-center gap-2 px-6 py-2 bg-primary text-white font-black rounded-lg hover:bg-[#00a39f] transition-all shadow-md active:scale-95 text-sm"
                  disabled={loading}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Xác nhận đã nhận hàng thành công
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 bg-zinc-50 text-zinc-400 font-bold rounded-lg border border-zinc-100 text-sm italic">
                {subOrder.status === "CONFIRMED" ? "Người bán đã xác nhận" : "Người bán đang đóng gói"}
              </div>
            )}
          </>
        )}

        {/* Nút Đánh giá (Hiện sau khi hoàn thành và chưa có review) */}
        {subOrder.status === "COMPLETED" && !subOrder.review && (
          <button 
            onClick={() => setShowReviewModal(true)}
            className="flex items-center gap-2 px-6 py-2 bg-[#ff8200] text-white font-black rounded-lg hover:bg-[#e67500] transition-all shadow-md text-sm"
          >
            <Star className="w-4 h-4" />
            Đánh giá ngay
          </button>
        )}

        {subOrder.status === "COMPLETED" && subOrder.review && (
           <span className="text-xs font-bold text-green-600 flex items-center gap-1">
             <CheckCircle2 className="w-4 h-4" /> Đã đánh giá
           </span>
        )}
      </div>

      {/* DISPUTE MODAL (Shopee Style) */}
      <AnimatePresence>
        {showDisputeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDisputeModal(false)} 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-lg rounded-3xl shadow-2xl relative overflow-hidden"
            >
               <div className="bg-[#f4511e] p-6 text-white flex justify-between items-center">
                  <h3 className="text-lg font-black flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" /> Trả hàng & Hoàn tiền
                  </h3>
                  <button onClick={() => setShowDisputeModal(false)}><X /></button>
               </div>
               <form onSubmit={handleDispute} className="p-8 space-y-6">
                  <div>
                    <label className="text-[10px] font-black uppercase text-zinc-400 mb-2 block">Lý do khiếu nại</label>
                    <select 
                      value={disputeReason} 
                      onChange={(e) => setDisputeReason(e.target.value)}
                      className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-xl outline-none focus:ring-2 focus:ring-[#f4511e]/20"
                    >
                      <option>Sách không giống mô tả</option>
                      <option>Sách bị hư hỏng, rách nát</option>
                      <option>Sách giả, sách in lậu</option>
                      <option>Người bán chưa gửi hàng</option>
                      <option>Khác</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-zinc-400 mb-2 block">Văn bản mô tả nội dung</label>
                    <textarea 
                      required
                      placeholder="Mô tả chi tiết vấn đề bạn gặp phải..."
                      value={disputeDesc}
                      onChange={(e) => setDisputeDesc(e.target.value)}
                      className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-xl h-32 outline-none focus:ring-2 focus:ring-[#f4511e]/20"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-zinc-400 mb-2 block">Link hình ảnh bằng chứng (nếu có)</label>
                    <input 
                      type="text"
                      placeholder="Dán link ảnh tại đây..."
                      value={disputeImages}
                      onChange={(e) => setDisputeImages(e.target.value)}
                      className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-xl outline-none focus:ring-2 focus:ring-[#f4511e]/20"
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="w-full py-4 bg-[#f4511e] text-white font-black rounded-xl hover:bg-[#d84315] shadow-lg shadow-[#f4511e]/20"
                    disabled={loading}
                  >
                    {loading ? "Đang gửi..." : "GỬI YÊU CẦU KHIẾU NẠI"}
                  </button>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* REVIEW MODAL */}
      <AnimatePresence>
        {showReviewModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowReviewModal(false)} 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-lg rounded-3xl shadow-2xl relative overflow-hidden"
            >
               <div className="bg-[#ff8200] p-6 text-white flex justify-between items-center">
                  <h3 className="text-lg font-black flex items-center gap-2">
                    <Star className="w-5 h-5" /> Đánh giá sản phẩm
                  </h3>
                  <button onClick={() => setShowReviewModal(false)}><X /></button>
               </div>
               <form onSubmit={handleReview} className="p-8 space-y-6">
                  <div className="text-center">
                    <div className="flex justify-center gap-2 mb-4">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button 
                          key={s} type="button" 
                          onClick={() => setRating(s)}
                          className={`p-2 rounded-lg transition-all ${rating >= s ? 'text-[#ff8200]' : 'text-zinc-200'}`}
                        >
                          <Star className={`w-8 h-8 ${rating >= s ? 'fill-current' : ''}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-zinc-400 mb-2 block">Bình luận của bạn</label>
                    <textarea 
                      required
                      placeholder="Hãy chia sẻ trải nghiệm về cuốn sách này..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-xl h-32 outline-none focus:ring-2 focus:ring-[#ff8200]/20"
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="w-full py-4 bg-[#ff8200] text-white font-black rounded-xl hover:bg-[#e67500] shadow-lg shadow-[#ff8200]/20"
                    disabled={loading}
                  >
                    {loading ? "Đang gửi..." : "GỬI ĐÁNH GIÁ"}
                  </button>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
