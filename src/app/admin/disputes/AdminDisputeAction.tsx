"use client";

import { useState } from "react";
import { CheckCircle2, RotateCcw } from "lucide-react";
import { resolveDisputeByAdmin } from "@/lib/dispute-actions";

interface AdminDisputeActionProps {
  subOrderId: string;
}

export function AdminDisputeAction({ subOrderId }: AdminDisputeActionProps) {
  const [loading, setLoading] = useState(false);

  const handleResolve = async (decision: "REFUND_BUYER" | "PAY_SELLER") => {
    const confirmMsg = decision === "REFUND_BUYER" 
        ? "BẠN QUYẾT ĐỊNH HOÀN TIỀN CHO NGƯỜI MUA? (Người bán sẽ không nhận được tiền)" 
        : "BẠN QUYẾT ĐỊNH BÁC BỎ KHIẾU NẠI VÀ TRẢ TIỀN CHO NGƯỜI BÁN?";
    
    if (!confirm(confirmMsg)) return;

    setLoading(true);
    const res = await resolveDisputeByAdmin(subOrderId, decision);
    if (res.success) {
      alert("Đã xử lý khiếu nại thành công.");
    } else {
      alert(res.error);
    }
    setLoading(false);
  };

  return (
    <div className="flex gap-4">
      <button 
        onClick={() => handleResolve("REFUND_BUYER")}
        disabled={loading}
        className="flex-1 px-6 py-3 bg-red-50 text-red-600 font-black rounded-2xl hover:bg-red-100 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
      >
        <RotateCcw className="w-4 h-4" /> Hoàn tiền cho Buyer
      </button>
      <button 
        onClick={() => handleResolve("PAY_SELLER")}
        disabled={loading}
        className="flex-1 px-6 py-3 bg-primary text-white font-black rounded-2xl hover:bg-[#00a39f] transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
      >
        <CheckCircle2 className="w-4 h-4" /> Trả tiền cho Seller
      </button>
    </div>
  );
}
