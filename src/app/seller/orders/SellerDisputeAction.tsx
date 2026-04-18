"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, ShieldAlert, X } from "lucide-react";
import { respondToDispute } from "@/lib/dispute-actions";
import { motion, AnimatePresence } from "framer-motion";

interface SellerDisputeActionProps {
  subOrderId: string;
  dispute: any;
}

export function SellerDisputeAction({ subOrderId, dispute }: SellerDisputeActionProps) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState("");

  if (!dispute || dispute.status === "RESOLVED_REFUND" || dispute.status === "RESOLVED_PAY_SELLER" || dispute.status === "CLOSED") {
      return null;
  }

  const handleAction = async (action: "ACCEPT_REFUND" | "ESCALATE_TO_ADMIN") => {
    if (action === "ACCEPT_REFUND" && !confirm("Bạn có chắc chắn muốn hoàn tiền cho người mua không? Hành động này không thể hoàn tác.")) return;
    
    setLoading(true);
    const res = await respondToDispute(subOrderId, action, reply);
    if (res.success) {
      setShowModal(false);
      alert(action === "ACCEPT_REFUND" ? "Đã hoàn tiền thành công." : "Đã chuyển khiếu nại lên Admin xử lý.");
    } else {
      alert(res.error);
    }
    setLoading(false);
  };

  return (
    <div className="mt-4">
      <div className="p-6 bg-red-50 border border-red-100 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-red-600">
           <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center shrink-0">
             <AlertTriangle className="w-6 h-6" />
           </div>
           <div>
             <h4 className="font-black text-sm uppercase tracking-tighter">Đơn hàng đang bị khiếu nại!</h4>
             <p className="text-xs font-medium opacity-80">Lý do: {dispute.reason}</p>
           </div>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="px-6 py-2.5 bg-red-600 text-white font-black rounded-xl text-sm hover:bg-red-700 transition-all shadow-lg shadow-red-200"
        >
          XEM CHI TIẾT & PHẢN HỒI
        </button>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
              onClick={() => setShowModal(false)} 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl relative overflow-hidden"
            >
               <div className="bg-red-600 p-8 text-white flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-black flex items-center gap-2">
                       <ShieldAlert className="w-6 h-6" /> CHI TIẾT KHIẾU NẠI
                    </h3>
                    <p className="text-white/80 text-xs font-medium mt-1">Vui lòng phản hồi trong vòng 24h để tránh bị tự động hoàn tiền.</p>
                  </div>
                  <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/10 rounded-full"><X /></button>
               </div>
               
               <div className="p-10 space-y-8">
                  <div className="space-y-4">
                    <div className="p-6 bg-zinc-50 rounded-3xl border border-zinc-100">
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Lời nhắn từ người mua</p>
                      <p className="text-zinc-900 font-medium leading-relaxed italic">"{dispute.description}"</p>
                      {dispute.images && (
                         <div className="mt-4 text-xs font-bold text-primary underline">
                           <a href={dispute.images} target="_blank" rel="noreferrer">Xem ảnh bằng chứng</a>
                         </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">Phản hồi của bạn (Nếu từ chối)</label>
                    <textarea 
                      placeholder="Giải trình lý do bạn không đồng ý hoàn tiền..."
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      className="w-full p-6 bg-zinc-50 border-2 border-zinc-100 rounded-3xl h-32 outline-none focus:border-red-100 transition-all font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <button 
                       onClick={() => handleAction("ACCEPT_REFUND")}
                       disabled={loading}
                       className="py-4 bg-zinc-100 text-zinc-500 font-black rounded-2xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
                     >
                       <CheckCircle2 className="w-4 h-4" /> CHẤP NHẬN HOÀN TIỀN
                     </button>
                     <button 
                       onClick={() => handleAction("ESCALATE_TO_ADMIN")}
                       disabled={loading}
                       className="py-4 bg-red-600 text-white font-black rounded-2xl hover:bg-red-700 transition-all shadow-lg shadow-red-200"
                     >
                       GỬI KHIẾU NẠI LÊN ADMIN
                     </button>
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
