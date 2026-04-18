"use client";

import { useState } from "react";
import { ClipboardCheck, Box, Send, Loader2 } from "lucide-react";
import { confirmOrder, packOrder, updateTrackingCode } from "@/lib/order-actions";
import { useRouter } from "next/navigation";

interface SellerOrderActionsProps {
  order: any;
}

export function SellerOrderActions({ order }: SellerOrderActionsProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAction = async (actionFn: (id: string) => Promise<any>, actionName: string) => {
    try {
      setLoading(true);
      const res = await actionFn(order.id);
      if (res.success) {
        // We'll give it a tiny delay to ensure Prisma/Next cache is updated
        setTimeout(() => {
          router.refresh();
          setLoading(false);
        }, 500);
      } else {
        alert("Lỗi: " + (res.error || "Không thể thực hiện hành động"));
        setLoading(false);
      }
    } catch (err: any) {
      alert("Đã có lỗi xảy ra: " + err.message);
      setLoading(false);
    }
  };

  const handleTrackingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const trackingCode = formData.get("trackingCode") as string;

    if (!trackingCode) {
      alert("Vui lòng nhập mã vận đơn");
      return;
    }

    setLoading(true);
    const res = await updateTrackingCode(order.id, formData);
    if (res.success) {
      router.refresh();
      setLoading(false);
    } else {
      alert("Lỗi: " + (res.error || "Không thể cập nhật mã vận đơn"));
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {order.status === "PENDING" && (
        <button 
          onClick={() => handleAction(confirmOrder, "Xác nhận")}
          disabled={loading}
          className="w-full bg-orange-500 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/10 active:scale-95 uppercase tracking-widest text-xs disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ClipboardCheck className="w-4 h-4" />
          )}
          Xác nhận thông tin
        </button>
      )}

      {order.status === "CONFIRMED" && (
        <button 
          onClick={() => handleAction(packOrder, "Đóng gói")}
          disabled={loading}
          className="w-full bg-purple-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-purple-700 transition-all shadow-xl shadow-purple-600/10 active:scale-95 uppercase tracking-widest text-xs disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Box className="w-4 h-4" />
          )}
          Đóng gói đơn hàng thành công
        </button>
      )}

      {order.status === "PACKED" && (
        <form onSubmit={handleTrackingSubmit} className="space-y-4">
          <input 
            name="trackingCode"
            required
            placeholder="Nhập mã vận đơn..." 
            className="w-full bg-white border border-zinc-200 rounded-2xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-secondary/10 transition-all font-medium"
          />
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-secondary text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#e67500] transition-all shadow-xl shadow-secondary/10 active:scale-95 uppercase tracking-widest text-xs disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Giao cho ship thành công
          </button>
        </form>
      )}
    </div>
  );
}
