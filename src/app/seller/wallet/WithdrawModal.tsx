"use client";

import { useState, useEffect } from "react";
import { ArrowUpRight, CreditCard, Wallet, AlertCircle, CheckCircle, Sparkles, Loader2, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { requestWithdrawal } from "./actions";

interface WithdrawFormProps {
  availableBalance: number;
  bankAccountInfo: string | null;
}

const MIN_WITHDRAW = 50000;
const MAX_WITHDRAW = 10000000;

export function WithdrawModal({ availableBalance, bankAccountInfo }: WithdrawFormProps) {
  const [amountInput, setAmountInput] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Parse amount from formatted string
  const amount = parseInt(amountInput.replace(/\./g, "")) || 0;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value === "") {
      setAmountInput("");
      return;
    }
    const num = parseInt(value);
    // Limit to 10 decimal digits for safety
    if (num > 9999999999) return;
    
    setAmountInput(new Intl.NumberFormat("vi-VN").format(num));
  };

  const handleQuickSelect = (val: number) => {
    const finalVal = Math.min(val, availableBalance, MAX_WITHDRAW);
    setAmountInput(new Intl.NumberFormat("vi-VN").format(finalVal));
  };

  const handleMax = () => {
    const finalVal = Math.min(availableBalance, MAX_WITHDRAW);
    setAmountInput(new Intl.NumberFormat("vi-VN").format(finalVal));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount < MIN_WITHDRAW || amount > MAX_WITHDRAW || amount > availableBalance) return;
    
    setIsPending(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("amount", amount.toString());

    try {
      const result = await requestWithdrawal(formData);
      if (result.success) {
        setMessage({ type: "success", text: "Yêu cầu rút tiền đã được gửi thành công!" });
        setAmountInput("");
        setTimeout(() => setMessage(null), 5000);
      } else {
        setMessage({ type: "error", text: result.error || "Đã có lỗi xảy ra" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Đã có lỗi xảy ra khi kết nối máy chủ" });
    } finally {
      setIsPending(false);
    }
  };

  const isInvalid = amount > 0 && (amount < MIN_WITHDRAW || amount > MAX_WITHDRAW || amount > availableBalance);

  if (!bankAccountInfo) {
    return (
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
    );
  }

  return (
    <div className="glass p-10 rounded-[48px] border-primary/20 bg-gradient-to-br from-zinc-900/50 to-black h-full flex flex-col justify-between">
      <div className="space-y-8">
        <div>
          <div className="flex items-center gap-2 text-primary mb-2">
            <Sparkles size={16} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Cổng giao dịch</span>
          </div>
          <h3 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">Rút tiền về thẻ</h3>
          <div className="flex items-center gap-2 text-zinc-500 text-xs">
            <CreditCard size={14} />
            <span>Chuyển tới: <span className="text-zinc-300 font-bold">{bankAccountInfo}</span></span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Số tiền VNĐ</label>
              <div className="flex items-center gap-2">
                <Info size={12} className="text-zinc-500" />
                <span className="text-[10px] text-zinc-500 font-bold uppercase">Min: 50k - Max: 10M</span>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-primary transition-colors">
                <Wallet size={24} />
              </div>
              <input 
                type="text"
                required
                placeholder="0"
                value={amountInput}
                onChange={handleInputChange}
                className={`w-full bg-white/[0.03] border-2 rounded-[32px] py-8 pl-18 pr-8 text-4xl font-black text-white transition-all outline-none 
                  ${isInvalid ? 'border-red-500 ring-red-500/10 focus:ring-4' : 'border-white/5 focus:border-primary/50 focus:ring-4 ring-primary/10'}
                  placeholder:text-zinc-800 tracking-tight
                `}
                style={{ paddingLeft: '72px' }}
                disabled={isPending}
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2">
                <span className="text-zinc-600 font-black text-xl italic uppercase">VND</span>
              </div>
            </div>

            {/* Error Messages */}
            <AnimatePresence mode="wait">
              {amount > 0 && amount < MIN_WITHDRAW && (
                <motion.p initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} exit={{opacity:0}} className="text-[10px] font-bold text-red-400 ml-4 uppercase tracking-widest">Số tiền tối thiểu là 50.000đ</motion.p>
              )}
              {amount > MAX_WITHDRAW && (
                <motion.p initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} exit={{opacity:0}} className="text-[10px] font-bold text-red-400 ml-4 uppercase tracking-widest">Tối đa 10.000.000đ mỗi lần rút</motion.p>
              )}
              {amount > availableBalance && (
                <motion.p initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} exit={{opacity:0}} className="text-[10px] font-bold text-red-500 ml-4 uppercase tracking-widest">Vượt quá số dư khả dụng</motion.p>
              )}
            </AnimatePresence>

            {/* Quick Select Chips */}
            <div className="flex flex-wrap gap-2 pt-2">
              {[50000, 100000, 500000, 1000000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleQuickSelect(val)}
                  disabled={isPending || val > availableBalance}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-[10px] font-black text-zinc-400 hover:text-white transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
                >
                  {val >= 1000000 ? `${val/1000000}M` : `${val/1000}K`}
                </button>
              ))}
              <button
                type="button"
                onClick={handleMax}
                disabled={isPending || availableBalance < MIN_WITHDRAW}
                className="px-4 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/20 rounded-2xl text-[10px] font-black text-primary transition-all active:scale-95 disabled:opacity-30"
              >
                TỐI ĐA
              </button>
            </div>
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

          <button 
            type="submit" 
            disabled={isPending || amount < MIN_WITHDRAW || amount > MAX_WITHDRAW || amount > availableBalance}
            className="group relative w-full py-8 bg-primary text-white rounded-[32px] font-black shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-40 disabled:grayscale disabled:hover:scale-100 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
            {isPending ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : (
              <>
                <ArrowUpRight className="w-6 h-6 -rotate-45 group-hover:rotate-0 transition-transform" />
                <span className="uppercase tracking-[0.2em] text-sm">Xác nhận giao dịch</span>
              </>
            )}
          </button>
        </form>
      </div>

      <p className="text-center text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mt-10">
        Thời gian xử lý dự kiến: trong vòng 24 giờ
      </p>
    </div>
  );
}
