"use client";

import { useState } from "react";
import { 
  Settings, 
  Tag, 
  CreditCard, 
  Plus, 
  Trash2, 
  Power, 
  ShieldCheck, 
  Globe, 
  Mail,
  MoreVertical,
  ChevronRight
} from "lucide-react";
import { VoucherForm } from "./VoucherForm";
import { toggleVoucherStatus, deleteVoucher } from "@/lib/voucher-actions";
import { useRouter } from "next/navigation";

export function SettingsClient({ vouchers }: { vouchers: any[] }) {
  const [activeTab, setActiveTab ] = useState<"general" | "vouchers" | "finance">("vouchers");
  const [showVoucherForm, setShowVoucherForm] = useState(false);
  const router = useRouter();

  const handleToggleVoucher = async (id: string, currentStatus: boolean) => {
    const res = await toggleVoucherStatus(id, !currentStatus);
    if (res.success) router.refresh();
  };

  const handleDeleteVoucher = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa mã này?")) return;
    const res = await deleteVoucher(id);
    if (res.success) router.refresh();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-10">
      {/* Settings Navigation */}
      <div className="w-full lg:w-80 space-y-2">
        {[
          { id: "general", label: "Cấu hình chung", icon: Globe },
          { id: "vouchers", label: "Mã giảm giá", icon: Tag },
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
        {activeTab === "vouchers" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-2">
               <div>
                 <h3 className="text-2xl font-black text-zinc-900 tracking-tight">Quản lý mã giảm giá</h3>
                 <p className="text-zinc-500 text-sm font-medium">Tạo và quản lý các chương trình khuyến mãi</p>
               </div>
               <button 
                onClick={() => setShowVoucherForm(true)}
                className="flex items-center gap-2 px-6 py-3.5 bg-primary text-white rounded-2xl font-black text-sm shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
               >
                 <Plus size={18} />
                 <span>Thêm mã mới</span>
               </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {vouchers.map((voucher) => (
                <div key={voucher.id} className="glass group">
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${voucher.isActive ? 'bg-primary/10 text-primary' : 'bg-zinc-100 text-zinc-400'}`}>
                           <Tag size={24} />
                        </div>
                        <div>
                          <h4 className="text-xl font-black text-zinc-900 leading-none">{voucher.code}</h4>
                          <p className="text-xs font-bold text-zinc-400 mt-2 uppercase tracking-widest leading-none">
                            {voucher.discountType === 'PERCENTAGE' ? `Giảm ${voucher.discountValue}%` : `Giảm ${new Intl.NumberFormat('vi-VN').format(voucher.discountValue)}đ`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleToggleVoucher(voucher.id, voucher.isActive)}
                          className={`p-2.5 rounded-xl transition-all ${voucher.isActive ? 'bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white' : 'bg-zinc-100 text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
                          title={voucher.isActive ? "Tạm dừng" : "Kích hoạt"}
                        >
                          <Power size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteVoucher(voucher.id)}
                          className="p-2.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                          title="Xóa"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-sm font-medium text-zinc-500 line-clamp-2 min-h-[40px] mb-6">
                      {voucher.description || "Không có mô tả"}
                    </p>

                    <div className="pt-6 border-t border-zinc-100 grid grid-cols-2 gap-4">
                       <div>
                         <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Đã dùng</p>
                         <p className="text-sm font-black text-zinc-900">{voucher.usedCount} / {voucher.usageLimit}</p>
                       </div>
                       <div>
                         <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Hết hạn</p>
                         <p className="text-sm font-black text-zinc-900">
                           {voucher.expiryDate ? new Date(voucher.expiryDate).toLocaleDateString('vi-VN') : "Không thời hạn"}
                         </p>
                       </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {vouchers.length === 0 && (
                <div className="col-span-full py-20 bg-zinc-50 rounded-[40px] border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-white rounded-3xl shadow-sm flex items-center justify-center text-zinc-300 mb-6">
                    <Tag size={32} />
                  </div>
                  <h4 className="text-lg font-black text-zinc-900">Chưa có mã giảm giá nào</h4>
                  <p className="text-zinc-500 text-sm font-medium mt-2 max-w-sm px-10">
                    Bắt đầu tạo các chương trình khuyến mãi đầu tiên để kích thích người mua hàng.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

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

      {showVoucherForm && <VoucherForm onClose={() => setShowVoucherForm(false)} />}
    </div>
  );
}
