import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Wallet as WalletIcon, Clock, ShieldCheck, History } from "lucide-react";
import { WithdrawModal } from "./WithdrawModal";

export default async function SellerWalletPage() {
  const session = await auth();
  const userId = (session?.user as any)?.id;

  const [wallet, user] = await Promise.all([
    prisma.wallet.findUnique({
      where: { userId },
      include: {
        transactions: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { bankAccountInfo: true }
    })
  ]);

  if (!wallet) {
    return <div>Không tìm thấy thông tin ví.</div>;
  }

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tighter uppercase text-white">Ví tiền của bạn</h2>
          <p className="text-zinc-500 text-sm font-medium">Quản lý dòng tiền và thực hiện yêu cầu rút tiền về tài khoản</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Balances & History */}
        <div className="lg:col-span-7 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Available Balance Card */}
            <div className="glass p-8 rounded-[40px] relative overflow-hidden group border-white/5 bg-zinc-900/30">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                <WalletIcon className="w-20 h-20" />
              </div>
              <div className="relative z-10">
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2">Số dư khả dụng</p>
                <h3 className="text-3xl font-black text-white whitespace-nowrap">
                   {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(wallet.availableBalance))}
                </h3>
              </div>
            </div>

            {/* Escrow Balance Card */}
            <div className="glass p-8 rounded-[40px] relative overflow-hidden bg-primary/5 border-primary/20">
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-primary mb-2">
                  <ShieldCheck className="w-4 h-4" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Tiền đang tạm giữ</p>
                </div>
                <h3 className="text-3xl font-black text-white whitespace-nowrap">
                   {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(wallet.escrowBalance))}
                </h3>
              </div>
            </div>
          </div>

          <div className="p-8 bg-zinc-950/50 border border-white/5 rounded-[40px] space-y-2">
             <div className="flex items-center gap-3 text-zinc-400 mb-4">
               <ShieldCheck size={20} className="text-primary" />
               <p className="text-sm font-bold text-zinc-300">Giải thích về Tiền tạm giữ (Escrow)</p>
             </div>
             <p className="text-xs text-zinc-500 leading-relaxed font-medium">
               Đây là số tiền từ các đơn hàng đang trong quá trình vận chuyển. Tiền sẽ được tự động giải ngân vào "Số dư khả dụng" ngay sau khi người mua xác nhận đã nhận hàng thành công qua hệ thống.
             </p>
          </div>

          {/* Transaction History */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-zinc-400 ml-4">
              <History className="w-5 h-5 text-primary" />
              <h3 className="font-black uppercase text-xs tracking-widest text-white">Lịch sử giao dịch gần đây</h3>
            </div>

            <div className="glass rounded-[40px] overflow-hidden border-white/5">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/5">
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Ngày</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Loại</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Số tiền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {wallet.transactions.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-8 py-16 text-center text-zinc-500 font-medium">
                          Chưa có giao dịch nào được ghi nhận.
                        </td>
                      </tr>
                    ) : (
                      wallet.transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-white/5 transition-colors group">
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-zinc-500 group-hover:text-primary transition-colors">
                                <Clock size={14} />
                              </div>
                              <span className="text-xs font-bold text-zinc-400">{new Date(tx.createdAt).toLocaleDateString('vi-VN')}</span>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${
                              tx.type === 'ESCROW_RELEASE' ? 'bg-green-500/10 text-green-500' :
                              tx.type === 'IN_ESCROW' ? 'bg-blue-500/10 text-blue-500' :
                              tx.type === 'DEDUCT_FEE' ? 'bg-red-500/10 text-red-500' :
                              tx.type === 'WITHDRAW' ? 'bg-amber-500/10 text-amber-500' :
                              'bg-zinc-500/10 text-zinc-400'
                            }`}>
                              {tx.type.replace('_', ' ')}
                            </span>
                            <p className="text-[10px] text-zinc-500 mt-1 font-medium">{tx.description}</p>
                          </td>
                          <td className={`px-8 py-5 text-sm font-black text-right ${
                            tx.amount.toString().startsWith('-') ? 'text-red-500' : 'text-green-500'
                          }`}>
                            {Number(tx.amount) > 0 ? '+' : ''}
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(tx.amount))}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Withdrawal Portal */}
        <div className="lg:col-span-5">
          <WithdrawModal 
            availableBalance={Number(wallet.availableBalance)} 
            bankAccountInfo={user?.bankAccountInfo || null} 
          />
        </div>
      </div>
    </div>
  );
}
