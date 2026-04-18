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
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold">Ví tiền của bạn</h2>
        <p className="text-zinc-500 text-sm">Quản lý dòng tiền và yêu cầu rút tiền</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Available Balance */}
        <div className="glass p-8 rounded-[32px] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
            <WalletIcon className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">Số dư khả dụng</p>
            <h3 className="text-4xl font-black text-white mb-6">
               {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(wallet.availableBalance))}
            </h3>
            <WithdrawModal 
              availableBalance={Number(wallet.availableBalance)} 
              bankAccountInfo={user?.bankAccountInfo || null} 
            />
          </div>
        </div>

        {/* Escrow Balance */}
        <div className="glass p-8 rounded-[32px] relative overflow-hidden bg-primary/5 border-primary/20">
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-primary mb-2">
              <ShieldCheck className="w-4 h-4" />
              <p className="text-xs font-bold uppercase tracking-widest">Tiền đang tạm giữ (Escrow)</p>
            </div>
            <h3 className="text-4xl font-black text-white mb-6">
               {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(wallet.escrowBalance))}
            </h3>
            <p className="text-xs text-zinc-500 max-w-xs leading-relaxed">
              Đây là số tiền từ các đơn hàng đang trong quá trình vận chuyển. Tiền sẽ được giải ngân sau khi Buyer xác nhận nhận hàng thành công.
            </p>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-zinc-400">
          <History className="w-5 h-5" />
          <h3 className="font-bold">Lịch sử giao dịch</h3>
        </div>

        <div className="glass rounded-[32px] overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Ngày</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Loại</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Mô tả</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-zinc-500 text-right">Số tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {wallet.transactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">
                    Chưa có giao dịch nào được ghi nhận.
                  </td>
                </tr>
              ) : (
                wallet.transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-zinc-500" />
                        <span className="text-xs text-zinc-400">{new Date(tx.createdAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                        tx.type === 'ESCROW_RELEASE' ? 'bg-green-500/10 text-green-500' :
                        tx.type === 'IN_ESCROW' ? 'bg-blue-500/10 text-blue-500' :
                        tx.type === 'DEDUCT_FEE' ? 'bg-red-500/10 text-red-500' :
                        'bg-zinc-500/10 text-zinc-400'
                      }`}>
                        {tx.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-300">
                      {tx.description}
                    </td>
                    <td className={`px-6 py-4 text-sm font-bold text-right ${
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
  );
}
