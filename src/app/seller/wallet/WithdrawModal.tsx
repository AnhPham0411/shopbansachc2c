"use client";

import { useState } from "react";
import { ArrowUpRight, X, CreditCard, Wallet, AlertCircle, CheckCircle, Sparkles, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { requestWithdrawal } from "./actions";

interface WithdrawModalProps {
  availableBalance: number;
  bankAccountInfo: string | null;
}

export function WithdrawModal({ availableBalance, bankAccountInfo }: WithdrawModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleMax = () => {
    setAmount(availableBalance.toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;
    
    setIsPending(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("amount", amount);

    try {
      const result = await requestWithdrawal(formData);
      if (result.success) {
        setMessage({ type: "success", text: "Yêu cầu rút tiền đã được gửi thành công!" });
        setAmount("");
        setTimeout(() => {
          setIsOpen(false);
          setMessage(null);
        }, 2500);
      } else {
        setMessage({ type: "error", text: result.error || "Đã có lỗi xảy ra" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Đã có lỗi xảy ra khi kết nối máy chủ" });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="group relative flex items-center gap-2 px-8 py-4 bg-white text-black font-black rounded-3xl hover:bg-zinc-100 transition-all shadow-xl shadow-white/5 active:scale-95 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        <span className="uppercase tracking-widest text-xs">Rút tiền về ngân hàng</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
              onClick={() => !isPending && setIsOpen(false)}
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="bg-zinc-950 border border-white/10 w-full max-w-lg rounded-[48px] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] relative flex flex-col max-h-[90vh]"
            >
              <div className="p-10 pb-6 flex justify-between items-center border-b border-white/5">
                <div>
                  <div className="flex items-center gap-2 text-primary mb-1">
                    <Sparkles size={14} className="animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Yêu cầu giao dịch</span>
                  </div>
                  <h3 className="text-3xl font-black text-white tracking-tighter uppercase">Rút tiền</h3>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  disabled={isPending}
                  className="w-12 h-12 flex items-center justify-center bg-white/5 text-zinc-500 hover:text-white hover:bg-white/10 rounded-full transition-all disabled:opacity-30"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-8 scrollbar-hide">
                {!bankAccountInfo ? (
                  <div className="p-8 bg-red-500/5 border border-red-500/20 rounded-[32px] space-y-4">
                    <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center text-red-500">
                      <AlertCircle size={24} />
                    </div>
                    <div>
                      <h4 className="font-black text-white uppercase tracking-tighter mb-2">Thiếu thông tin ngân hàng</h4>
                      <p className="text-zinc-400 text-sm leading-relaxed">
                        Để rút tiền, bạn cần cập nhật thông tin tài khoản thụ hưởng trong phần cài đặt nhà bán hàng.
                      </p>
                    </div>
                    <a 
                      href="/seller/settings" 
                      className="flex items-center justify-center gap-2 w-full py-4 bg-white text-black font-black rounded-2xl hover:bg-zinc-200 transition-all uppercase tracking-widest text-xs"
                    >
                      Cập nhật ngay <ArrowUpRight size={14} />
                    </a>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-6 bg-white/[0.03] rounded-3xl border border-white/10 flex flex-col justify-between">
                        <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-4">Số dư khả dụng</p>
                        <p className="text-2xl font-black text-white tracking-tight">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(availableBalance)}
                        </p>
                      </div>

                      <div className="p-6 bg-white/[0.03] rounded-3xl border border-white/10">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-4">
                          <CreditCard size={12} />
                          Tài khoản thụ hưởng
                        </div>
                        <p className="text-sm font-bold text-zinc-300 leading-tight">
                          {bankAccountInfo}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center ml-2">
                        <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Số tiền muốn rút (VND)</label>
                        <button 
                          type="button"
                          onClick={handleMax}
                          className="text-[10px] font-black uppercase text-primary hover:text-primary/80 transition-colors tracking-widest"
                        >
                          Rút toàn bộ
                        </button>
                      </div>
                      <div className="relative group">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-primary transition-colors">
                          <Wallet size={20} />
                        </div>
                        <input 
                          type="number"
                          required
                          min="1000"
                          step="1000"
                          placeholder="0.00"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          max={availableBalance}
                          autoFocus
                          className="w-full bg-white/[0.03] border-2 border-white/5 rounded-[32px] py-6 pl-16 pr-8 text-2xl font-black text-white focus:border-primary/50 focus:ring-4 ring-primary/10 transition-all outline-none"
                          disabled={isPending}
                        />
                      </div>
                      
                      {parseFloat(amount) > availableBalance && (
                        <p className="text-[10px] font-bold text-red-500 ml-6 uppercase tracking-widest">Số dư không đủ để thực hiện</p>
                      )}
                    </div>

                    <AnimatePresence>
                      {message && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className={`p-6 rounded-3xl flex items-center gap-4 ${
                            message.type === "success" 
                              ? "bg-green-500/10 text-green-500 border border-green-500/20" 
                              : "bg-red-500/10 text-red-500 border border-red-500/20"
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                            message.type === "success" ? "bg-green-500/20" : "bg-red-500/20"
                          }`}>
                            {message.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                          </div>
                          <p className="text-xs font-black uppercase tracking-widest">{message.text}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="pt-4">
                      <button 
                        type="submit" 
                        disabled={isPending || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > availableBalance}
                        className="group relative w-full py-6 bg-primary text-white rounded-[32px] font-black shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-40 disabled:grayscale disabled:hover:scale-100 overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                        {isPending ? (
                          <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                          <>
                            <ArrowUpRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform" />
                            <span className="uppercase tracking-[0.2em] text-xs">Xác nhận rút tiền</span>
                          </>
                        )}
                      </button>
                      <p className="text-center text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mt-6">Hệ thống sẽ xử lý yêu cầu trong 24h</p>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

