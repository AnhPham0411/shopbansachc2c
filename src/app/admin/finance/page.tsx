import { prisma } from "@/lib/prisma";
import { Wallet, ArrowUpRight, CheckCircle2, Clock, History, CreditCard } from "lucide-react";
import { auth } from "@/lib/auth";
import { WithdrawModal } from "@/app/seller/wallet/WithdrawModal";
import { approveWithdrawal } from "@/lib/finance-actions";

export default async function AdminFinancePage() {
  const session = await auth();
  const userId = (session?.user as any)?.id;

  const [transactions, wallet, user] = await Promise.all([
    prisma.walletTransaction.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      wallet: {
        include: { user: { select: { name: true, email: true } } }
      }
    }
    }),
    userId ? prisma.wallet.findUnique({ where: { userId } }) : null,
    userId ? prisma.user.findUnique({ where: { id: userId }, select: { bankAccountInfo: true } }) : null
  ]);

  const pendingWithdrawals = transactions.filter(t => t.type === "WITHDRAW_PENDING");
  
  // Calculate Platform Revenue (10% fees) from SubOrders for consistency with dashboard
  const subOrderStats = await prisma.subOrder.aggregate({
    where: { status: { not: "REFUNDED" } },
    _sum: { platformFee: true }
  });
  const totalRev = subOrderStats._sum.platformFee ? Number(subOrderStats._sum.platformFee) : 0;

  const availableBalance = wallet ? Number(wallet.availableBalance) : 0;

  return (
    <div className="space-y-10">
      <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-6">
        <div>
          <h2 className="text-3xl font-black text-zinc-900 tracking-tight">Quản lý Tài chính</h2>
          <p className="text-zinc-500 font-medium">Theo dõi doanh thu và duyệt yêu cầu thanh khoản</p>
        </div>
        <div className="flex gap-4">
          <div className="glass px-6 py-4 rounded-2xl border-primary/20 bg-primary/5">
            <p className="text-[10px] font-bold uppercase text-primary tracking-widest mb-1">Tổng doanh thu sàn</p>
            <h3 className="text-2xl font-black text-primary">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalRev)}
            </h3>
          </div>
          <div className="glass px-6 py-4 rounded-2xl border-emerald-500/20 bg-emerald-500/5">
            <p className="text-[10px] font-bold uppercase text-emerald-600 tracking-widest mb-1">Ví của bạn (Khả dụng)</p>
            <h3 className="text-2xl font-black text-emerald-600">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(availableBalance)}
            </h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-10">

      {/* Pending Withdrawals */}
      <section className="space-y-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Clock className="w-5 h-5 text-orange-500" />
          Yêu cầu rút tiền chờ duyệt ({pendingWithdrawals.length})
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingWithdrawals.length === 0 ? (
            <div className="col-span-full glass p-10 text-center text-zinc-500 rounded-[32px]">
              Không có yêu cầu rút tiền nào đang chờ.
            </div>
          ) : (
            pendingWithdrawals.map((tx) => (
              <div key={tx.id} className="glass p-6 rounded-[32px] border-orange-500/20 bg-orange-500/5 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-zinc-900">{tx.wallet.user.name}</p>
                    <p className="text-xs text-zinc-500">{tx.wallet.user.email}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
                    <Wallet size={20} />
                  </div>
                </div>
                
                <div className="py-4 border-y border-orange-500/10">
                  <p className="text-xs text-zinc-500 uppercase font-black tracking-widest mb-1">Số tiền rút</p>
                  <p className="text-2xl font-black text-orange-500">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Math.abs(Number(tx.amount)))}
                  </p>
                </div>

                <form action={async () => {
                   "use server";
                   await approveWithdrawal(tx.id);
                }}>
                  <button className="w-full py-3 bg-orange-500 text-white font-black rounded-xl hover:bg-orange-600 transition-all flex items-center justify-center gap-2">
                    Duyệt thanh khoản <CheckCircle2 size={18} />
                  </button>
                </form>
              </div>
            ))
          )}
        </div>
      </section>

      {/* All Transactions */}
      <section className="space-y-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <History className="w-5 h-5 text-primary" />
          Lịch sử giao dịch toàn hệ thống
        </h3>

        <div className="glass rounded-[32px] overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50">
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-zinc-500">Ngày</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-zinc-500">Người dùng</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-zinc-500">Loại</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-zinc-500">Mô tả</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-zinc-500 text-right">Biến động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-6 py-4 text-xs text-zinc-500">
                    {new Date(tx.createdAt).toLocaleString('vi-VN')}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-zinc-900">{tx.wallet.user.name}</p>
                    <p className="text-[10px] text-zinc-400">{tx.wallet.user.email}</p>
                  </td>
                  <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${
                        tx.type === 'DEDUCT_FEE' ? 'bg-primary/10 text-primary' :
                        tx.type === 'DIRECT_SALE' ? 'bg-emerald-500/10 text-emerald-600' :
                        tx.type === 'REFUND' ? 'bg-red-500/10 text-red-600' :
                        tx.type === 'WITHDRAW_PENDING' ? 'bg-orange-500/10 text-orange-500' :
                        tx.type === 'WITHDRAW_SUCCESS' ? 'bg-green-500/10 text-green-500' :
                        'bg-zinc-100 text-zinc-500'
                      }`}>
                       {tx.type.replace('_', ' ')}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-600">
                    {tx.description}
                  </td>
                  <td className={`px-6 py-4 text-sm font-black text-right ${
                    tx.amount.toString().startsWith('-') ? 'text-red-500' : 'text-green-600'
                  }`}>
                    {Number(tx.amount) > 0 ? '+' : ''}
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(tx.amount))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
        </div>
        
        {/* Right side: Admin Wallet panel */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Wallet className="w-5 h-5 text-emerald-500" />
            Rút tiền (Admin)
          </h3>
          <WithdrawModal 
            availableBalance={availableBalance} 
            bankAccountInfo={user?.bankAccountInfo || null} 
          />
        </div>
      </div>
    </div>
  );
}
