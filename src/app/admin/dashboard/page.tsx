import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Wallet, Users, BookOpen, ArrowUpRight, ShieldCheck, Activity, CreditCard } from "lucide-react";

export default async function AdminDashboardPage() {
  const session = await auth();
  
  // Calculate Platform Revenue (10% fees) from SubOrders
  const subOrderStats = await prisma.subOrder.aggregate({
    where: { status: { not: "REFUNDED" } },
    _sum: { platformFee: true }
  });

  const totalRevenue = subOrderStats._sum.platformFee ? Number(subOrderStats._sum.platformFee) : 0;

  // Fetch Admin Wallet for actual balance display
  const admin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
    include: { wallets: true }
  });
  const adminBalance = admin?.wallets?.availableBalance ? Number(admin.wallets.availableBalance) : 0;

  
  const userCount = await prisma.user.count();
  const bookCount = await prisma.book.count();
  const totalOrderCount = await prisma.subOrder.count();

  // Dynamic stats for the status card
  const pendingOrderCount = await prisma.subOrder.count({ where: { status: "PENDING" } });
  const pendingWithdrawCount = await prisma.walletTransaction.count({ where: { type: "WITHDRAW_PENDING" } });

  const recentTransactions = await prisma.walletTransaction.findMany({
    orderBy: { createdAt: "desc" },
    take: 8,
    include: {
      wallet: {
        include: { user: { select: { name: true } } }
      }
    }
  });

  return (
    <div className="space-y-10">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Doanh thu sàn (10%)", value: totalRevenue, icon: Wallet, color: "text-primary", bg: "bg-primary/10" },
          { label: "Tổng người dùng", value: userCount, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Số lượng sách", value: bookCount, icon: BookOpen, color: "text-accent", bg: "bg-accent/10" },
          { label: "Tổng đơn hàng", value: totalOrderCount, icon: Activity, color: "text-orange-500", bg: "bg-orange-500/10" },
        ].map((stat, i) => (
          <div key={i} className="glass p-6 rounded-3xl group hover:border-white/20 transition-all">
            <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-2xl font-black">
              {typeof stat.value === 'number' && stat.label.includes('Doanh thu') 
                ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stat.value)
                : stat.value}
            </h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Recent Activity */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Giao dịch toàn sàn mới nhất
            </h3>
            <Link href="/admin/finance" className="text-sm text-primary hover:underline font-medium">Tất cả sao kê</Link>
          </div>

          <div className="glass rounded-[32px] overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/5">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Người dùng</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Loại</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Trạng thái</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500 text-right">Biến động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-white">
                          {tx.wallet.user.name.charAt(0)}
                        </div>
                        <span className="text-sm font-medium">{tx.wallet.user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-zinc-500">
                      {tx.type}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-green-500">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase">Đã đối soát</span>
                      </div>
                    </td>
                    <td className={`px-6 py-4 text-sm font-black text-right ${
                       tx.amount.toString().startsWith('-') ? 'text-red-500' : 'text-primary'
                    }`}>
                      {Number(tx.amount) > 0 ? '+' : ''}
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(tx.amount))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Financial Overview Card */}
        <div className="lg:col-span-4 space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-accent" />
            Tình trạng tài chính
          </h3>
          <div className="glass p-8 rounded-[32px] bg-accent/5 border-accent/20">
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-center">Tài khoản thu phí Admin</p>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mb-6">
                <Wallet className="w-10 h-10 text-accent" />
              </div>
              <h4 className="text-3xl font-black mb-2">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(adminBalance)}
              </h4>

              <p className="text-xs text-accent font-bold">Lợi nhuận gộp hiện tại</p>
            </div>
            
            <div className="mt-8 space-y-4 pt-8 border-t border-accent/10">
               <Link 
                 href="/admin/orders?status=PENDING"
                 className="flex justify-between items-center text-xs group hover:bg-white/5 p-2 -mx-2 rounded-lg transition-all"
               >
                 <span className="text-zinc-500 group-hover:text-zinc-300">Đơn hàng chờ xử lý</span>
                 <span className="text-white font-bold">{pendingOrderCount}</span>
               </Link>
               <div className="flex justify-between items-center text-xs">
                 <span className="text-zinc-500">Yêu cầu rút tiền</span>
                 <span className="text-orange-500 font-bold">{pendingWithdrawCount}</span>
               </div>
               <Link 
                href="/admin/finance"
                className="w-full py-4 bg-accent text-black font-black rounded-2xl hover:bg-accent/90 transition-all flex items-center justify-center gap-2 mt-4 shadow-[0_0_30px_rgba(16,185,129,0.3)] text-sm"
               >
                 Duyệt thanh khoản <ArrowUpRight className="w-5 h-5" />
               </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
