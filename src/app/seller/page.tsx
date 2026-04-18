import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BookOpen, Package, ShoppingBag, Wallet, TrendingUp, Clock } from "lucide-react";
import Link from "next/link";

export default async function SellerOverviewPage() {
  const session = await auth();
  const userId = (session?.user as any)?.id;

  const [booksCount, ordersCount, wallet] = await Promise.all([
    prisma.book.count({ where: { sellerId: userId } }),
    prisma.subOrder.count({ where: { sellerId: userId } }),
    prisma.wallet.findUnique({ where: { userId } }),
  ]);

  const recentBooks = await prisma.book.findMany({
    where: { sellerId: userId },
    take: 5,
    orderBy: { createdAt: "desc" },
  });

  const stats = [
    { label: "Tổng sản phẩm", value: booksCount, icon: Package, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Đơn hàng mới", value: ordersCount, icon: ShoppingBag, color: "text-green-500", bg: "bg-green-50", href: "/seller/orders" },
    { label: "Số dư ví", value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(wallet?.availableBalance || 0)), icon: Wallet, color: "text-orange-500", bg: "bg-orange-50", href: "/seller/wallet" },
    { label: "Tiền tạm giữ", value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(wallet?.escrowBalance || 0)), icon: Clock, color: "text-purple-500", bg: "bg-purple-50", href: "/seller/wallet" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-zinc-900">Tổng quan cửa hàng</h2>
        <p className="text-zinc-500 font-medium">Chào mừng trở lại, {(session?.user as any)?.name}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Link 
            key={i} 
            href={stat.href || "#"}
            className="bg-white p-6 rounded-[32px] border border-zinc-100 shadow-sm hover:shadow-md transition-all group"
          >
            <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-zinc-900">{stat.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Books */}
        <div className="bg-white p-8 rounded-[40px] border border-zinc-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black text-zinc-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Sách mới đăng
            </h3>
            <Link href="/seller/books" className="text-sm font-bold text-primary hover:underline">Xem tất cả</Link>
          </div>
          
          <div className="space-y-4">
            {recentBooks.length === 0 ? (
              <div className="py-12 text-center text-zinc-400">
                <p>Chưa có sản phẩm nào.</p>
              </div>
            ) : (
              recentBooks.map((book) => (
                <div key={book.id} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-zinc-50 transition-colors border border-transparent hover:border-zinc-100">
                   <div className="w-12 h-16 bg-zinc-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                     {book.imageUrl ? (
                       <img src={book.imageUrl} alt="" className="w-full h-full object-cover rounded-lg" />
                     ) : (
                       <BookOpen className="w-6 h-6 text-zinc-300" />
                     )}
                   </div>
                   <div className="flex-1 min-w-0">
                     <p className="font-bold text-zinc-900 truncate">{book.title}</p>
                     <p className="text-xs text-zinc-500 font-medium">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(book.price))}</p>
                   </div>
                   <div className="text-right">
                      <span className="text-[10px] font-black uppercase px-2 py-1 rounded-md bg-zinc-100 text-zinc-500">
                        {book.condition.replace('_', ' ')}
                      </span>
                   </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-primary p-8 rounded-[40px] text-white overflow-hidden relative">
          <div className="relative z-10">
            <h3 className="text-2xl font-black mb-4">Bạn muốn bán thêm sách?</h3>
            <p className="text-white/70 font-medium mb-8">Hơn 2,000 người dùng đang tìm kiếm những tiêu đề mới mỗi ngày.</p>
            <Link href="/seller/books" className="inline-block px-8 py-4 bg-white text-primary rounded-2xl font-black hover:bg-zinc-100 transition-all shadow-xl shadow-black/10">
              Đăng sản phẩm mới
            </Link>
          </div>
          
          <Package className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5 -rotate-12" />
        </div>
      </div>
    </div>
  );
}
