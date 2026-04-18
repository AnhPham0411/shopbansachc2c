"use client";

import { useState } from "react";
import { User, Phone, MapPin, CreditCard, Save, CheckCircle, AlertCircle } from "lucide-react";
import { updateProfile } from "./actions";
import { motion, AnimatePresence } from "framer-motion";

interface ProfileFormProps {
  user: {
    name: string;
    phoneNumber: string | null;
    address: string | null;
    bankAccountInfo: string | null;
  };
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setMessage(null);
    
    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setMessage({ type: "success", text: "Cập nhật hồ sơ thành công!" });
        // Auto-hide message after 3 seconds
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: "error", text: result.error || "Đã có lỗi xảy ra" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Đã có lỗi xảy ra khi kết nối máy chủ" });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-8">
      <AnimatePresence>
        {message && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`p-4 rounded-2xl flex items-center gap-3 border shadow-sm ${
              message.type === "success" 
                ? "bg-green-50 border-green-100 text-green-700" 
                : "bg-red-50 border-red-100 text-red-700"
            }`}
          >
            {message.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <p className="text-sm font-bold">{message.text}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Personal Info */}
        <div className="glass p-8 rounded-[40px] space-y-6">
          <h3 className="text-lg font-black flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Thông tin cá nhân
          </h3>
          
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-4">Họ và tên</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                <input 
                  name="name" 
                  required 
                  defaultValue={user.name} 
                  className="w-full bg-zinc-50 border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-bold focus:ring-2 ring-primary/20 transition-all outline-none" 
                  disabled={isPending}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-4">Số điện thoại</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                <input 
                  name="phoneNumber" 
                  defaultValue={user.phoneNumber || ""} 
                  className="w-full bg-zinc-50 border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-bold focus:ring-2 ring-primary/20 transition-all outline-none" 
                  disabled={isPending}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-4">Địa chỉ</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                <input 
                  name="address" 
                  defaultValue={user.address || ""} 
                  className="w-full bg-zinc-50 border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-bold focus:ring-2 ring-primary/20 transition-all outline-none" 
                  disabled={isPending}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="glass p-8 rounded-[40px] space-y-6">
          <h3 className="text-lg font-black flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-secondary" />
            Thông tin thanh toán
          </h3>
          
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-4">STK / Thông tin nhận tiền</label>
              <textarea 
                name="bankAccountInfo" 
                rows={4} 
                defaultValue={user.bankAccountInfo || ""} 
                placeholder="Ví dụ: Techcombank - 190xxxxxx - NGUYEN VAN A"
                className="w-full bg-zinc-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 ring-primary/20 transition-all outline-none resize-none" 
                disabled={isPending}
              />
            </div>
            <p className="text-[10px] text-zinc-400 font-medium px-4 italic leading-relaxed">
              * Thông tin này sẽ được sử dụng để Admin đối soát và chuyển tiền bán sách cho bạn.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          type="submit" 
          disabled={isPending}
          className="px-12 py-4 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 disabled:opacity-70 disabled:hover:scale-100"
        >
          {isPending ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          {isPending ? "Đang lưu..." : "Lưu thay đổi hồ sơ"}
        </button>
      </div>
    </form>
  );
}
