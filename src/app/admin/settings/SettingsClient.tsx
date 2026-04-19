"use client";

import { useState } from "react";
import { 
  Settings, 
  CreditCard, 
  ShieldCheck, 
  Globe, 
  Mail,
  ChevronRight
} from "lucide-react";
import { useRouter } from "next/navigation";

export function SettingsClient({ vouchers }: { vouchers: any[] }) {
  const [activeTab, setActiveTab ] = useState<"general" | "finance">("general");
  const router = useRouter();


  return (
    <div className="flex flex-col lg:flex-row gap-10">
      {/* Settings Navigation */}
      <div className="w-full lg:w-80 space-y-2">
        {[
          { id: "general", label: "Cấu hình chung", icon: Globe },
          { id: "finance", label: "Chính sách tài chính", icon: CreditCard },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`w-full flex items-center justify-between px-6 py-5 rounded-3xl font-black text-sm transition-all ${
              activeTab === tab.id 
              ? "bg-white shadow-xl shadow-zinc-200/50 text-primary border-2 border-primary/5" 
              : "text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
            }`}
          >
            <div className="flex items-center gap-4">
               <tab.icon size={20} />
               <span>{tab.label}</span>
            </div>
            {activeTab === tab.id && <ChevronRight size={18} />}
          </button>
        ))}
      </div>

      {/* Settings Content */}
      <div className="flex-1">

        {activeTab === "finance" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h3 className="text-2xl font-black text-zinc-900 tracking-tight">Chính sách tài chính</h3>
              <p className="text-zinc-500 text-sm font-medium">Thiết lập biểu phí và hoa hồng của hệ thống</p>
            </div>

            <div className="glass p-10 space-y-10">
              <div className="flex items-start gap-8">
                 <div className="w-16 h-16 bg-primary/10 text-primary rounded-3xl flex items-center justify-center flex-shrink-0">
                    <CreditCard size={32} />
                 </div>
                 <div className="flex-1 space-y-6">
                    <div>
                       <h4 className="text-lg font-black text-zinc-900 leading-none">Phí nền tảng (Platform Fee)</h4>
                       <p className="text-sm font-medium text-zinc-500 mt-2">
                        Phần trăm hoa hồng hệ thống thu trên mỗi đơn hàng hoàn thành của Người bán.
                       </p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-32 py-4 bg-zinc-50 rounded-2xl text-center">
                         <span className="text-xl font-black text-zinc-900">10%</span>
                      </div>
                      <div className="flex-1 p-4 bg-blue-50 text-blue-700 rounded-2xl border border-blue-100 flex items-center gap-3">
                         <ShieldCheck size={18} />
                         <span className="text-xs font-bold italic">Giá trị hiện tại đang được áp dụng mặc định cho toàn hệ thống.</span>
                      </div>
                    </div>
                 </div>
              </div>

              <div className="pt-10 border-t border-zinc-100 flex items-start gap-8 opacity-50 pointer-events-none">
                 <div className="w-16 h-16 bg-zinc-100 text-zinc-400 rounded-3xl flex items-center justify-center flex-shrink-0">
                    <ShieldCheck size={32} />
                 </div>
                 <div className="flex-1 space-y-4">
                    <h4 className="text-lg font-black text-zinc-900 leading-none">Chính sách thanh toán</h4>
                    <p className="text-sm font-medium text-zinc-500">
                      Tự động chuyển đổi trạng thái đơn hàng khi nhận được thanh toán từ cổng trung gian.
                    </p>
                    <div className="flex gap-2">
                       <span className="px-3 py-1 bg-zinc-100 rounded text-[10px] font-black uppercase">VNPAY: ON</span>
                       <span className="px-3 py-1 bg-zinc-100 rounded text-[10px] font-black uppercase">MOMO: OFF</span>
                       <span className="px-3 py-1 bg-zinc-100 rounded text-[10px] font-black uppercase">COD: ON</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "general" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h3 className="text-2xl font-black text-zinc-900 tracking-tight">Cấu hình chung</h3>
              <p className="text-zinc-500 text-sm font-medium">Thông tin hiển thị và vận hành website</p>
            </div>

            <div className="glass p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4">Tên sàn thương mại</label>
                   <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                      <input type="text" readOnly value="LIBRIS BOOKSTORE" className="w-full bg-zinc-50 border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-zinc-500" />
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4">Email hỗ trợ</label>
                   <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                      <input type="text" readOnly value="support@libris.vn" className="w-full bg-zinc-50 border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-zinc-500" />
                   </div>
                </div>
              </div>

              <div className="p-6 bg-secondary/5 border border-secondary/10 rounded-[32px] flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center">
                       <Settings size={20} />
                    </div>
                    <div>
                       <p className="text-sm font-black text-zinc-900">Chế độ bảo trì (Maintenance Mode)</p>
                       <p className="text-xs font-medium text-zinc-500">Tạm dừng hoạt động toàn bộ website để nâng cấp</p>
                    </div>
                 </div>
                 <div className="w-14 h-8 bg-zinc-200 rounded-full relative cursor-not-allowed">
                    <div className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-sm" />
                 </div>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
