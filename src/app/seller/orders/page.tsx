import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Package, Truck, CheckCircle2, ShoppingBag, Send, AlertCircle, ClipboardCheck, Box } from "lucide-react";
import { updateTrackingCode, confirmOrder, packOrder } from "@/lib/order-actions";
import { SellerDisputeAction } from "./SellerDisputeAction";
import { SellerOrderActions } from "./SellerOrderActions";
import { serializePrisma } from "@/lib/utils";

export default async function SellerOrdersPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const rawOrders = await prisma.subOrder.findMany({
    where: { sellerId: userId },
    include: {
      orderItems: {
        include: { book: true }
      },
      masterOrder: {
        include: { buyer: true }
      },
      dispute: true
    },
    orderBy: { createdAt: "desc" }
  });

  const orders = serializePrisma(rawOrders);

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="flex items-center gap-4 mb-10">
        <h1 className="text-4xl font-black tracking-tighter text-zinc-900 uppercase">Quản lý đơn hàng</h1>
        <div className="px-4 py-1.5 bg-primary/10 rounded-full text-primary text-xs font-black uppercase tracking-widest border border-primary/20">
          {orders.length} Giao dịch
        </div>
      </div>

      <div className="space-y-8">
        {orders.length === 0 ? (
          <div className="py-20 bg-zinc-50 rounded-[40px] border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center text-zinc-400">
             <ShoppingBag className="w-16 h-16 mb-4 opacity-10" />
             <p className="font-bold uppercase tracking-widest text-xs">Phòng bán vé hiện đang trống...</p>
          </div>
        ) : (
          orders.map((order: any) => (
            <div key={order.id} className="bg-white rounded-[40px] border border-zinc-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="px-8 py-6 border-b border-zinc-50 flex flex-col md:flex-row justify-between gap-4 bg-zinc-50/30">
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Mã vận đơn</p>
                    <p className="text-sm font-bold text-zinc-900">{order.trackingCode || "Chưa cập nhật"}</p>
                  </div>
                  <div className="h-8 w-px bg-zinc-200" />
                  <div>
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Thời gian</p>
                    <p className="text-sm font-bold text-zinc-600">{new Date(order.createdAt).toLocaleString('vi-VN')}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                   <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      order.status === 'COMPLETED' ? 'bg-green-50 text-green-600 border-green-100' :
                      order.status === 'DISPUTED' ? 'bg-red-50 text-red-600 border-red-100' :
                      order.status === 'SHIPPING' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                      order.status === 'PENDING' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                      order.status === 'CONFIRMED' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                      order.status === 'PACKED' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                      'bg-zinc-50 text-zinc-600 border-zinc-100'
                    }`}>
                      {
                        order.status === 'PENDING' ? 'Mới' :
                        order.status === 'CONFIRMED' ? 'Đã xác nhận' :
                        order.status === 'PACKED' ? 'Đã đóng gói' :
                        order.status === 'SHIPPING' ? 'Đang giao' :
                        order.status === 'COMPLETED' ? 'Hoàn tất' :
                        order.status === 'DISPUTED' ? 'Khiếu nại' :
                        order.status === 'REFUNDED' ? 'Đã hoàn tiền' : order.status
                      }
                    </span>
                </div>
              </div>

              <div className="p-10">
                <div className="flex flex-col lg:flex-row gap-12">
                  <div className="flex-1 space-y-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        <Package className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="font-black text-zinc-900 uppercase tracking-tighter">Sách trong đơn hàng</h3>
                    </div>
                    
                    <div className="space-y-4">
                      {order.orderItems.map((item: any) => (
                        <div key={item.id} className="flex gap-6 items-center p-6 bg-zinc-50 rounded-[32px] border border-zinc-100">
                          <div className="w-14 h-20 bg-white rounded-xl border border-zinc-100 flex-shrink-0 flex items-center justify-center">
                            <Package className="w-6 h-6 text-zinc-200" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-black text-zinc-900 leading-tight">{item.book.title}</h4>
                            <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">Số lượng: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] font-black text-zinc-300 uppercase leading-none mb-1">Giá bán</p>
                             <p className="text-lg font-black text-primary">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(item.priceAtPurchase))}
                             </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* HIỂN THỊ KHIẾU NẠI NẾU CÓ */}
                    <SellerDisputeAction subOrderId={order.id} dispute={order.dispute} />
                  </div>

                  <div className="w-full lg:w-96">
                    <div className="p-8 bg-zinc-50 rounded-[40px] border border-zinc-100 space-y-8">
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                           <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
                             <Truck className="w-5 h-5 text-secondary" />
                           </div>
                           <h3 className="font-black text-zinc-900 uppercase tracking-tighter">Vận chuyển</h3>
                        </div>

                        {/* Sử dụng Component Client mới */}
                        <SellerOrderActions order={order} />


                        {order.status !== "PENDING" && order.status !== "CONFIRMED" && order.status !== "PACKED" && (
                          <div className="mt-4 space-y-4">
                             <div className="flex items-center gap-2 p-4 bg-white rounded-2xl border border-zinc-100 text-sm font-bold text-zinc-900">
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                {order.trackingCode || "N/A"}
                             </div>
                             <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest leading-relaxed text-center">
                               {order.status === 'COMPLETED' ? 'Đã hoàn tất giao dịch' : 'Chờ khách xác nhận nhận hàng'}
                             </p>
                          </div>
                        )}
                      </div>

                      <div className="pt-8 border-t border-zinc-200 space-y-4">
                        <div className="flex justify-between items-center text-xs">
                           <span className="font-bold text-zinc-400 uppercase tracking-widest">Giá bán gốc</span>
                           <span className="font-bold text-zinc-900">
                             {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(order.subTotal))}
                           </span>
                        </div>
                        
                        {Number(order.masterOrder.discountAmount) > 0 && (
                          <div className="flex justify-between items-center text-xs">
                             <span className="font-bold text-green-500 uppercase tracking-widest flex items-center gap-1">
                               Voucher hệ thống hỗ trợ
                               <AlertCircle className="w-3 h-3" />
                             </span>
                             <span className="font-bold text-green-500">
                               + {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(order.masterOrder.discountAmount))}
                             </span>
                          </div>
                        )}

                        <div className="flex justify-between items-center text-xs">
                           <span className="font-bold text-red-400 uppercase tracking-widest">
                             Phí hệ thống {Number(order.platformFee) === 0 ? "(Tự bán)" : "(10%)"}
                           </span>
                           <span className="font-bold text-red-400">
                             {Number(order.platformFee) === 0 ? "0 đ" : `- ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(order.platformFee))}`}
                           </span>
                        </div>

                        <div className="pt-4 border-t border-dashed border-zinc-200 flex justify-between items-center">
                          <span className="text-[10px] font-black text-zinc-900 uppercase tracking-widest">Tiền thực nhận</span>
                          <div className="text-right">
                             <div className="text-2xl font-black text-primary leading-none mb-1">
                               {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(order.netAmount))}
                             </div>
                             <p className="text-[10px] text-zinc-400 font-medium italic">
                               {Number(order.masterOrder.discountAmount) > 0 ? "Bao gồm tiền bù từ sàn" : "(Đã khấu trừ phí sàn)"}
                             </p>
                          </div>
                        </div>
                      </div>
                    </div>
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
