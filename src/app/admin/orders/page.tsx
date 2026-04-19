import { prisma } from "@/lib/prisma";
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  User, 
  Store, 
  Clock, 
  CheckCircle2, 
  Truck, 
  AlertCircle,
  MoreVertical,
  ChevronRight
} from "lucide-react";
import { updateOrderStatus } from "@/lib/order-actions";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const session = await auth();
  const { status: statusFilter } = await searchParams;

  const orders = await prisma.subOrder.findMany({
    where: statusFilter ? { status: statusFilter as any } : {},
    include: {
      masterOrder: {
        include: { buyer: { select: { name: true, email: true } } }
      },
      orderItems: {
        include: { book: { select: { title: true } } }
      },
      seller: { select: { name: true, email: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  const stats = {
    total: await prisma.subOrder.count(),
    pending: await prisma.subOrder.count({ where: { status: "PENDING" } }),
    shipping: await prisma.subOrder.count({ where: { status: "SHIPPING" } }),
    completed: await prisma.subOrder.count({ where: { status: "COMPLETED" } }),
  };

  const statusColors: any = {
    PENDING: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    CONFIRMED: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    PACKED: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
    SHIPPING: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    DELIVERED: "bg-teal-500/10 text-teal-500 border-teal-500/20",
    COMPLETED: "bg-primary/10 text-primary border-primary/20",
    DISPUTED: "bg-red-500/10 text-red-500 border-red-500/20",
    REFUNDED: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
  };

  return (
    <div className="space-y-10">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-black text-zinc-900 tracking-tight">Quản lý Đơn hàng</h2>
          <p className="text-zinc-500 font-medium">Giám sát và điều phối giao dịch toàn hệ thống</p>
        </div>
        
        <div className="flex gap-4">
          {[
            { label: "Chờ duyệt", value: stats.pending, color: "text-orange-500", bg: "bg-orange-500/5" },
            { label: "Đang giao", value: stats.shipping, color: "text-blue-500", bg: "bg-blue-500/5" },
            { label: "Hoàn tất", value: stats.completed, color: "text-primary", bg: "bg-primary/5" },
          ].map((s, i) => (
            <div key={i} className={`px-6 py-3 rounded-2xl border border-zinc-100 ${s.bg} flex flex-col items-center min-w-[100px]`}>
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">{s.label}</span>
              <span className={`text-xl font-black ${s.color}`}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input 
            placeholder="Tìm kiếm theo mã đơn, khách hàng hoặc người bán..." 
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-zinc-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary/10 transition-all shadow-sm"
          />
        </div>
        <div className="flex bg-white p-1.5 rounded-2xl border border-zinc-200 shadow-sm">
           {['ALL', 'PENDING', 'CONFIRMED', 'PACKED', 'SHIPPING', 'COMPLETED', 'DISPUTED'].map((s) => (
             <a
              key={s}
              href={s === 'ALL' ? '/admin/orders' : `/admin/orders?status=${s}`}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                (s === 'ALL' && !statusFilter) || statusFilter === s
                ? "bg-zinc-900 text-white shadow-lg"
                : "text-zinc-500 hover:text-zinc-900"
              }`}
             >
               {s}
             </a>
           ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="glass rounded-[40px] overflow-hidden border-zinc-200/50 shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50/50">
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Đơn hàng</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Khách hàng</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Người bán</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Sản phẩm</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Trạng thái</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 text-right">Tổng cộng</th>
              <th className="px-8 py-5 text-center"><MoreVertical className="w-4 h-4 mx-auto text-zinc-300" /></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center opacity-20">
                    <ShoppingBag className="w-16 h-16 mb-4" />
                    <p className="font-black uppercase tracking-[0.2em] text-sm">Không tìm thấy đơn hàng nào</p>
                  </div>
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-zinc-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <p className="text-xs font-black text-zinc-900 mb-1">#{order.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-[10px] text-zinc-400 font-bold">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-[10px] font-black text-zinc-500">
                        {order.masterOrder.buyer.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-black text-zinc-900 leading-none">{order.masterOrder.buyer.name}</p>
                        <p className="text-[10px] text-zinc-400 mt-1">{order.masterOrder.buyer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-zinc-600">
                      <Store className="w-3.5 h-3.5" />
                      <span className="text-xs font-bold">{order.seller.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="max-w-[200px]">
                      <p className="text-xs font-bold text-zinc-900 truncate">
                        {order.orderItems[0].book.title}
                        {order.orderItems.length > 1 && <span className="text-zinc-400 ml-1">+{order.orderItems.length - 1}</span>}
                      </p>
                      <p className="text-[10px] text-zinc-400">SL: {order.orderItems.reduce((acc, item) => acc + item.quantity, 0)} cuốn</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                     <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusColors[order.status]}`}>
                      {
                        order.status === 'PENDING' ? 'Chờ xác nhận' :
                        order.status === 'CONFIRMED' ? 'Đã xác nhận' :
                        order.status === 'PACKED' ? 'Đã đóng gói' :
                        order.status === 'SHIPPING' ? 'Đang giao' :
                        order.status === 'COMPLETED' ? 'Hoàn tất' :
                        order.status === 'DISPUTED' ? 'Khiếu nại' :
                        order.status === 'REFUNDED' ? 'Đã hoàn tiền' : order.status
                      }
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <p className="text-sm font-black text-zinc-900">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(order.subTotal))}
                    </p>
                    <p className="text-[10px] text-zinc-400 font-medium">Fee: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(order.platformFee))}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center gap-2">
                      {order.status === "PENDING" && order.sellerId === session?.user?.id && (
                        <form action={async () => {
                          "use server";
                          await updateOrderStatus(order.id, "SHIPPING");
                          revalidatePath("/admin/orders");
                        }}>
                          <button className="p-2 border border-blue-500/20 bg-blue-500/5 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all shadow-sm active:scale-95" title="Duyệt đơn hàng">
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        </form>
                      )}
                      <button className="p-2 bg-zinc-100 text-zinc-400 rounded-xl hover:bg-zinc-200 hover:text-zinc-600 transition-all active:scale-95">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
