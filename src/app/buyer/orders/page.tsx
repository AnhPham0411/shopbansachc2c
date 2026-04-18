import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { Package, ShoppingBag, ListChecks, AlertTriangle } from "lucide-react";
import { OrderActionButtons } from "./OrderActionButtons";
import { serializePrisma } from "@/lib/utils";

export default async function BuyerOrdersPage() {
  const session = await auth();
  const userId = (session?.user as any)?.id;

  const orders = await prisma.masterOrder.findMany({
    where: { buyerId: userId },
    include: {
      subOrders: {
        include: {
          orderItems: {
            include: { book: true }
          },
          review: true,
          dispute: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
  
  const serializedOrders = serializePrisma(orders);

  return (
    <main className="min-h-screen bg-[#F5F9F9] text-zinc-900 pb-20">
      <Navbar />
      
      <div className="container mx-auto px-6 md:px-12 pt-44">
        <div className="flex items-center gap-4 mb-10">
           <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
              <ListChecks className="text-primary w-7 h-7" />
           </div>
           <div>
              <h1 className="text-4xl font-black tracking-tighter">Đơn hàng của tôi</h1>
              <p className="text-zinc-500 font-medium">Theo dõi và quản lý các giao dịch mua sách</p>
           </div>
        </div>

        <div className="space-y-8">
          {serializedOrders.length === 0 ? (
            <div className="py-20 bg-white rounded-[40px] flex flex-col items-center justify-center text-zinc-400 border-2 border-dashed border-zinc-100">
              <ShoppingBag className="w-16 h-16 mb-4 opacity-10" />
              <p className="font-bold">Bạn chưa mua cuốn sách nào.</p>
            </div>
          ) : (
            serializedOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-[40px] overflow-hidden border border-zinc-100 shadow-sm">
                <div className="px-8 py-5 bg-zinc-50/50 flex flex-wrap justify-between items-center border-b border-zinc-100 gap-4">
                  <div className="flex items-center gap-6">
                    <div>
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Mã đơn tổng</p>
                        <p className="text-sm font-bold text-zinc-900">#{order.id.slice(0, 8)}</p>
                    </div>
                    <div className="h-8 w-px bg-zinc-200" />
                    <div>
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Ngày mua</p>
                        <p className="text-sm font-bold text-zinc-600">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${
                        order.paymentStatus === 'PAID' 
                        ? 'bg-green-50/50 text-green-600 border-green-100' 
                        : 'bg-orange-50/50 text-orange-600 border-orange-100'
                    }`}>
                        {order.paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                    </span>
                  </div>
                </div>

                <div className="divide-y divide-zinc-50">
                  {order.subOrders.map((subOrder) => (
                    <div key={subOrder.id} className="p-8">
                      <div className="flex flex-wrap justify-between items-start mb-8 gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                            <Package className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Vận chuyển</p>
                            <p className="text-sm font-bold">{subOrder.trackingCode || "Chờ người bán gửi hàng"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                           {subOrder.dispute && (subOrder.dispute.status === 'PENDING_SELLER' || subOrder.dispute.status === 'PENDING_ADMIN') && (
                              <span className="px-4 py-1.5 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-100 flex items-center gap-1.5">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                Đang khiếu nại
                              </span>
                           )}
                           <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                            subOrder.status === 'COMPLETED' ? 'bg-green-50 text-green-600 border-green-100' : 
                            subOrder.status === 'DISPUTED' ? 'bg-red-50 text-red-600 border-red-100' :
                            subOrder.status === 'REFUNDED' ? 'bg-zinc-100 text-zinc-500 border-zinc-200' :
                            'bg-blue-50 text-blue-600 border-blue-100'
                          }`}>
                            {subOrder.status === 'PENDING' ? 'Chờ xác nhận' :
                             subOrder.status === 'SHIPPING' ? 'Đang giao' :
                             subOrder.status === 'DELIVERED' ? 'Đã giao' :
                             subOrder.status === 'COMPLETED' ? 'Hoàn thành' :
                             subOrder.status === 'DISPUTED' ? 'Khiếu nại' :
                             subOrder.status === 'REFUNDED' ? 'Đã hoàn tiền' : subOrder.status}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-6 mb-8">
                        {subOrder.orderItems.map((item) => (
                          <div key={item.id} className="flex gap-6 items-center">
                            <div className="w-14 h-20 bg-zinc-50 rounded-xl border border-zinc-100 flex items-center justify-center shrink-0">
                               <Package className="w-6 h-6 text-zinc-200" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-zinc-900">{item.book.title}</h4>
                              <p className="text-xs text-zinc-500 font-medium">Số lượng: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                               <p className="text-zinc-400 text-[10px] font-black uppercase">Đơn giá</p>
                               <p className="font-bold text-zinc-900">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(item.priceAtPurchase))}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <OrderActionButtons 
                        subOrder={subOrder as any} 
                        discountAmount={Number(order.discountAmount)}
                        grandSubTotal={order.subOrders.reduce((acc: number, so: any) => acc + Number(so.subTotal), 0)}
                      />
                    </div>
                  ))}
                </div>

                {/* ORDER SUMMARY FOOTER */}
                <div className="bg-zinc-50/50 px-8 py-6 flex flex-col items-end gap-2 border-t border-zinc-100">
                  <div className="flex justify-between w-full max-w-xs text-sm font-medium">
                    <span className="text-zinc-400 uppercase tracking-widest text-[10px] font-black">Tiền hàng</span>
                    <span className="text-zinc-900">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.subOrders.reduce((acc: number, so: any) => acc + Number(so.subTotal), 0))}
                    </span>
                  </div>
                  {Number(order.discountAmount) > 0 && (
                    <div className="flex justify-between w-full max-w-xs text-sm font-medium">
                      <span className="text-zinc-400 uppercase tracking-widest text-[10px] font-black">Giảm giá voucher</span>
                      <span className="text-red-500">
                        -{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(order.discountAmount))}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between w-full max-w-xs pt-4 mt-2 border-t border-zinc-200 items-center">
                    <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Tổng thanh toán</span>
                    <span className="text-2xl font-black text-primary">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(order.totalPayment))}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
