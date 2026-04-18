import { prisma } from "@/lib/prisma";
import { ShieldAlert, User, ShoppingBag, Calendar, MessageCircle, Info } from "lucide-react";
import { AdminDisputeAction } from "./AdminDisputeAction";

export default async function AdminDisputesPage() {
  const disputes = await prisma.dispute.findMany({
    where: { 
      status: { in: ["PENDING_ADMIN", "PENDING_SELLER"] } 
    },
    include: {
      subOrder: {
        include: {
          masterOrder: { include: { buyer: true } },
          orderItems: { include: { book: true } }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="p-10 space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-zinc-900 tracking-tighter">QUẢN LÝ TRANH CHẤP</h2>
          <p className="text-zinc-500 font-medium mt-1">Hệ thống xử lý khiếu nại Trả hàng & Hoàn tiền</p>
        </div>
        <div className="flex gap-4">
           <div className="px-6 py-3 bg-white border border-zinc-100 rounded-2xl shadow-sm text-center">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Cần xử lý</p>
              <p className="text-xl font-black text-red-600">{disputes.length}</p>
           </div>
        </div>
      </div>

      <div className="grid gap-8">
        {disputes.length === 0 ? (
          <div className="py-20 bg-white rounded-[40px] border-2 border-dashed border-zinc-100 flex flex-col items-center justify-center text-zinc-300">
             <ShieldAlert className="w-16 h-16 mb-4 opacity-10" />
             <p className="font-bold">Hiện không có tranh chấp nào cần xử lý.</p>
          </div>
        ) : (
          disputes.map((dispute) => (
            <div key={dispute.id} className="bg-white rounded-[44px] shadow-sm border border-zinc-100 overflow-hidden">
               <div className="px-10 py-6 bg-zinc-50 border-b border-zinc-100 flex justify-between items-center">
                  <div className="flex items-center gap-6">
                     <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none">ID Khiếu nại</span>
                        <span className="text-sm font-bold">#{dispute.id.slice(0, 8)}</span>
                     </div>
                     <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        dispute.status === "PENDING_ADMIN" ? "bg-red-50 text-red-600 border-red-100" : "bg-orange-50 text-orange-600 border-orange-100"
                     }`}>
                        {dispute.status === "PENDING_ADMIN" ? "Đợi Admin phân xử" : "Chờ Seller phản hồi"}
                     </span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold">
                     <Calendar className="w-4 h-4" />
                     {new Date(dispute.createdAt).toLocaleString('vi-VN')}
                  </div>
               </div>

               <div className="p-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* Bằng chứng & Phản hồi */}
                  <div className="space-y-8">
                     <div className="space-y-4">
                        <h4 className="flex items-center gap-2 text-sm font-black text-zinc-900 uppercase tracking-tight">
                           <MessageCircle className="w-5 h-5 text-primary" /> Lập luận của Buyer
                        </h4>
                        <div className="p-6 bg-[#F5F9F9] rounded-[32px] border border-primary/10">
                           <p className="text-xs font-black text-primary uppercase tracking-widest mb-2">Lý do: {dispute.reason}</p>
                           <p className="text-sm text-zinc-600 leading-relaxed font-medium">"{dispute.description}"</p>
                           {dispute.images && (
                              <div className="mt-4">
                                <a href={dispute.images} target="_blank" rel="noreferrer" className="text-xs font-bold text-primary underline">Xem ảnh bằng chứng</a>
                              </div>
                           )}
                        </div>
                     </div>

                     <div className="space-y-4">
                        <h4 className="flex items-center gap-2 text-sm font-black text-zinc-900 uppercase tracking-tight">
                           <Info className="w-5 h-5 text-secondary" /> Phản hồi từ Seller
                        </h4>
                        <div className="p-6 bg-zinc-50 rounded-[32px] border border-zinc-100">
                           <p className="text-sm text-zinc-600 leading-relaxed font-medium italic">
                              {dispute.sellerReply ? `"${dispute.sellerReply}"` : "Seller chưa có phản hồi nào."}
                           </p>
                        </div>
                     </div>
                  </div>

                  {/* Thông tin đơn hàng & Ra phán quyết */}
                  <div className="space-y-8">
                     <div className="space-y-4">
                        <h4 className="flex items-center gap-2 text-sm font-black text-zinc-900 uppercase tracking-tight">
                           <ShoppingBag className="w-5 h-5 text-zinc-400" /> Thông tin giao dịch
                        </h4>
                        <div className="p-6 bg-white rounded-[32px] border border-zinc-100 space-y-4">
                           <div className="flex justify-between items-center text-sm">
                              <span className="font-bold text-zinc-500">Giá trị đơn hàng:</span>
                              <span className="font-black text-primary text-xl">
                                 {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(dispute.subOrder.subTotal))}
                              </span>
                           </div>
                           <div className="h-px bg-zinc-50" />
                           <div className="grid grid-cols-2 gap-4">
                              <div>
                                 <p className="text-[10px] font-black text-zinc-400 uppercase mb-1">Người mua</p>
                                 <p className="text-xs font-bold">{dispute.subOrder.masterOrder.buyer.name}</p>
                              </div>
                              <div>
                                 <p className="text-[10px] font-black text-zinc-400 uppercase mb-1">Người bán ID</p>
                                 <p className="text-xs font-bold font-mono">{dispute.subOrder.sellerId.slice(0, 8)}</p>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <h4 className="text-sm font-black text-zinc-900 uppercase tracking-tight">Quyết định của Admin</h4>
                        <AdminDisputeAction subOrderId={dispute.subOrderId} />
                        <p className="text-[10px] text-zinc-400 font-bold italic text-center">
                           Lưu ý: Phán quyết của Admin là cuối cùng và sẽ thực hiện giải ngân/hoàn tiền ngay lập tức.
                        </p>
                     </div>
                  </div>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
