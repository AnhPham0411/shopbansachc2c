"use client";

import { useCart } from "@/lib/cart";
import { Navbar } from "@/components/layout/Navbar";
import { 
  ChevronLeft, 
  MapPin, 
  ShoppingBag, 
  Ticket, 
  CreditCard, 
  Wallet, 
  Truck, 
  ShieldCheck, 
  CheckCircle2,
  ChevronRight,
  X
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { validateVoucher, getActiveVouchers } from "@/lib/voucher-actions";

type PaymentMethod = "COD" | "VNPAY" | "MOMO";

export default function CheckoutPage() {
  const { cart, total, clearCart, isLoaded } = useCart();
  const router = useRouter();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<{
    code: string;
    discountAmount: number;
    description?: string | null;
  } | null>(null);
  const [voucherError, setVoucherError] = useState("");
  
  const [shippingInfo, setShippingInfo] = useState({
    name: "Lê Tuấn Anh",
    phone: "039 123 4567",
    address: "Số 123, Đường Láng, Q. Đống Đa, Hà Nội",
  });

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [tempShippingInfo, setTempShippingInfo] = useState(shippingInfo);

  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [availableVouchers, setAvailableVouchers] = useState<any[]>([]);

  // Group items by Seller (reusing logic from cart)
  const groupedItems = cart.reduce((acc, item) => {
    if (!acc[item.sellerId]) {
      acc[item.sellerId] = {
        sellerName: item.sellerName,
        items: [],
      };
    }
    acc[item.sellerId].items.push(item);
    return acc;
  }, {} as Record<string, { sellerName: string; items: any[] }>);

  const sellers = Object.keys(groupedItems);

  useEffect(() => {
    if (isLoaded && cart.length === 0 && !isProcessing && !isSuccess) {
      router.push("/cart");
    }
  }, [cart, router, isProcessing, isLoaded, isSuccess]);

  useEffect(() => {
    if (isLoaded) {
      getActiveVouchers().then(res => {
        if (res.success) setAvailableVouchers(res.vouchers);
      });
    }
  }, [isLoaded]);

  if (!isLoaded || (cart.length === 0 && !isProcessing && !isSuccess)) {
    return (
      <div className="min-h-screen bg-[#F6F7F9] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const insuranceFee = total * 0.02;
  const finalDiscount = appliedVoucher?.discountAmount || 0;
  const grandTotal = total + insuranceFee - finalDiscount;

  const handleApplyVoucher = async (codeOverride?: string) => {
    const codeToUse = codeOverride || voucherCode;
    if (!codeToUse) return;
    setVoucherError("");
    
    // In demo, we use a placeholder userId
    const result = await validateVoucher(codeToUse, "current-user-id", total);
    if (result.success) {
      setAppliedVoucher({
        code: result.code!,
        discountAmount: result.discountAmount!,
        description: result.description,
      });
      setVoucherCode("");
      setIsVoucherModalOpen(false);
    } else {
      setVoucherError(result.error || "Mã không hợp lệ");
    }
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    setShippingInfo(tempShippingInfo);
    setIsAddressModalOpen(false);
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          paymentMethod,
          voucherCode: appliedVoucher?.code,
          shippingInfo, // In real app, we'd save this too
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lỗi đặt hàng");

      // Redirect to success or order recap
      setIsSuccess(true);
      clearCart();
      router.push(`/checkout/success/${data.orderId}`);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F6F7F9] text-zinc-900 pb-20">
      <Navbar />
      
      <div className="container mx-auto px-6 md:px-12 pt-32 max-w-6xl">
        {/* Header Navigation */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/cart" className="p-2 bg-white rounded-xl border border-zinc-200 hover:border-primary/40 transition-all">
            <ChevronLeft className="w-5 h-5 text-zinc-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-black">Xác nhận đơn hàng</h1>
            <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-0.5">Bước cuối cùng để sở hữu sách hay</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. Địa chỉ nhận hàng */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[32px] p-8 border border-zinc-200 shadow-sm overflow-hidden relative"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-secondary via-primary to-secondary/40" />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-secondary/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-secondary" />
                </div>
                <h3 className="font-black text-lg">Địa chỉ nhận hàng</h3>
              </div>
              
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-black text-zinc-900">{shippingInfo.name}</span>
                    <div className="w-1 h-1 rounded-full bg-zinc-300" />
                    <span className="font-bold text-zinc-600">{shippingInfo.phone}</span>
                  </div>
                  <p className="text-zinc-500 font-medium">{shippingInfo.address}</p>
                </div>
                <button 
                  onClick={() => {
                    setTempShippingInfo(shippingInfo);
                    setIsAddressModalOpen(true);
                  }}
                  className="text-primary font-black text-sm hover:underline"
                >
                  Thay đổi
                </button>
              </div>
            </motion.div>

        {/* Address Modal */}
        <AnimatePresence>
          {isAddressModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 onClick={() => setIsAddressModalOpen(false)}
                 className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
               />
               <motion.div 
                 initial={{ scale: 0.95, opacity: 0, y: 20 }}
                 animate={{ scale: 1, opacity: 1, y: 0 }}
                 exit={{ scale: 0.95, opacity: 0, y: 20 }}
                 className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden"
               >
                 <div className="p-8">
                   <div className="flex items-center justify-between mb-8">
                      <h3 className="text-2xl font-black">Địa chỉ mới</h3>
                      <button 
                        onClick={() => setIsAddressModalOpen(false)}
                        className="p-2 hover:bg-zinc-100 rounded-full transition-all"
                      >
                        <X className="w-6 h-6 text-zinc-400" />
                      </button>
                   </div>

                   <form onSubmit={handleSaveAddress} className="space-y-6">
                     <div className="space-y-2">
                       <label className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1">Họ và tên</label>
                       <input 
                         type="text" 
                         required
                         value={tempShippingInfo.name}
                         onChange={e => setTempShippingInfo({...tempShippingInfo, name: e.target.value})}
                         className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-5 py-4 font-bold text-zinc-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                         placeholder="Nhập tên người nhận"
                       />
                     </div>

                     <div className="space-y-2">
                       <label className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1">Số điện thoại</label>
                       <input 
                         type="tel" 
                         required
                         value={tempShippingInfo.phone}
                         onChange={e => setTempShippingInfo({...tempShippingInfo, phone: e.target.value})}
                         className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-5 py-4 font-bold text-zinc-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                         placeholder="Nhập số điện thoại"
                       />
                     </div>

                     <div className="space-y-2">
                       <label className="text-xs font-black text-zinc-400 uppercase tracking-widest ml-1">Địa chỉ chi tiết</label>
                       <textarea 
                         required
                         rows={3}
                         value={tempShippingInfo.address}
                         onChange={e => setTempShippingInfo({...tempShippingInfo, address: e.target.value})}
                         className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-5 py-4 font-bold text-zinc-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
                         placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                       />
                     </div>

                     <div className="pt-4 flex gap-4">
                       <button 
                         type="button"
                         onClick={() => setIsAddressModalOpen(false)}
                         className="flex-1 py-4 rounded-2xl font-black text-zinc-500 hover:bg-zinc-50 transition-all border border-zinc-200"
                       >
                         TRỞ LẠI
                       </button>
                       <button 
                         type="submit"
                         className="flex-1 bg-primary text-white py-4 rounded-2xl font-black hover:bg-[#00a39f] transition-all shadow-xl shadow-primary/20"
                       >
                         HOÀN THÀNH
                       </button>
                     </div>
                   </form>
                 </div>
               </motion.div>
            </div>
          )}
        </AnimatePresence>

            {/* 2. Danh sách sản phẩm grouped by Shop */}
            {sellers.map((sellerId, idx) => (
              <motion.div 
                key={sellerId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (idx + 1) }}
                className="bg-white rounded-[32px] border border-zinc-200 shadow-sm overflow-hidden"
              >
                <div className="px-8 py-4 bg-zinc-50 border-b border-zinc-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                      <ShoppingBag className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-black text-zinc-700">Gói hàng từ Shop: {groupedItems[sellerId].sellerName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-bold text-primary uppercase tracking-wider">
                    <Truck className="w-3.5 h-3.5" />
                    Chuẩn bị hàng nhanh
                  </div>
                </div>

                <div className="p-8 space-y-6">
                  {groupedItems[sellerId].items.map((item) => (
                    <div key={item.id} className="flex gap-6">
                      <div className="w-16 h-20 bg-zinc-50 rounded-xl flex-shrink-0 flex items-center justify-center border border-zinc-100 overflow-hidden">
                        <ShoppingBag className="w-6 h-6 text-zinc-200" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-zinc-900 truncate leading-tight">{item.title}</h4>
                        <div className="flex items-center gap-2 mt-2">
                           <span className="text-xs font-bold text-zinc-400">Số lượng: {item.quantity}</span>
                           <span className="text-sm font-black text-primary">
                             {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                           </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-6 border-t border-zinc-50 flex flex-col sm:flex-row justify-between items-center bg-zinc-50/50 -mx-8 -mb-8 px-8 py-4">
                    <div className="flex items-center gap-4 text-sm font-medium text-zinc-500 mb-4 sm:mb-0">
                      <span>Đơn vị vận chuyển:</span>
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-black text-xs">TIẾT KIỆM - MIỄN PHÍ</span>
                    </div>
                    <div className="text-sm font-medium text-zinc-500">
                      Tổng số tiền ({groupedItems[sellerId].items.length} sản phẩm): 
                      <span className="text-primary font-black ml-2 text-lg">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                          groupedItems[sellerId].items.reduce((sum, i) => sum + i.price * i.quantity, 0)
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* 3. Voucher Platform */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[32px] p-8 border border-zinc-200 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Ticket className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-black text-lg">LIBRIS Voucher</h3>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    placeholder="Nhập mã giảm giá..."
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-5 py-4 font-bold text-zinc-900 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all pr-24"
                  />
                  <button 
                    onClick={handleApplyVoucher}
                    className="absolute right-2 top-2 bottom-2 bg-primary text-white rounded-xl px-4 font-black text-xs hover:bg-[#00a39f] transition-all"
                  >
                    ÁP DỤNG
                  </button>
                </div>
                
                <button 
                  onClick={() => setIsVoucherModalOpen(true)}
                  className="flex items-center gap-2 text-zinc-400 hover:text-primary transition-all whitespace-nowrap"
                >
                  <span className="text-xs font-bold uppercase tracking-widest pl-2">Chọn Voucher khác</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {voucherError && <p className="text-red-500 text-xs mt-3 font-bold pl-1">{voucherError}</p>}

              <AnimatePresence>
                {appliedVoucher && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-6 p-4 bg-primary/5 border border-dashed border-primary/30 rounded-2xl flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-primary">-{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(appliedVoucher.discountAmount)}</p>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Đã áp dụng mã: {appliedVoucher.code}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setAppliedVoucher(null)}
                      className="text-zinc-400 hover:text-red-500 font-bold text-xs"
                    >Gỡ bỏ</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-32">
            
            {/* 4. Phương thức thanh toán */}
            <div className="bg-white p-8 rounded-[32px] border border-zinc-200 shadow-sm space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-zinc-400" />
                </div>
                <h3 className="font-black text-lg">Thanh toán</h3>
              </div>

              <div className="space-y-3">
                <label 
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "COD" ? "border-primary bg-primary/5" : "border-zinc-100 hover:border-zinc-200"
                  }`}
                >
                   <input type="radio" name="payment" className="hidden" onChange={() => setPaymentMethod("COD")} checked={paymentMethod === "COD"} />
                   <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "COD" ? "border-primary" : "border-zinc-300"}`}>
                      {paymentMethod === "COD" && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                   </div>
                   <div className="flex-1">
                      <p className="text-sm font-black">Thanh toán khi nhận hàng (COD)</p>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase">Trả tiền mặt khi Shipper tới</p>
                   </div>
                   <Truck className={`w-5 h-5 ${paymentMethod === "COD" ? "text-primary" : "text-zinc-300"}`} />
                </label>

                <label 
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "VNPAY" ? "border-primary bg-primary/5" : "border-zinc-100 hover:border-zinc-200"
                  }`}
                >
                   <input type="radio" name="payment" className="hidden" onChange={() => setPaymentMethod("VNPAY")} checked={paymentMethod === "VNPAY"} />
                   <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "VNPAY" ? "border-primary" : "border-zinc-300"}`}>
                      {paymentMethod === "VNPAY" && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                   </div>
                   <div className="flex-1">
                      <p className="text-sm font-black">Ví điện tử VNPAY</p>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase">Thanh toán ATM/QR Code nhanh</p>
                   </div>
                   <CreditCard className={`w-5 h-5 ${paymentMethod === "VNPAY" ? "text-primary" : "text-zinc-300"}`} />
                </label>

                <label 
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "MOMO" ? "border-primary bg-primary/5" : "border-zinc-100 hover:border-zinc-200"
                  }`}
                >
                   <input type="radio" name="payment" className="hidden" onChange={() => setPaymentMethod("MOMO")} checked={paymentMethod === "MOMO"} />
                   <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "MOMO" ? "border-primary" : "border-zinc-300"}`}>
                      {paymentMethod === "MOMO" && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                   </div>
                   <div className="flex-1">
                      <p className="text-sm font-black">Ví điện tử MoMo</p>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase">Sử dụng tài khoản MoMo cá nhân</p>
                   </div>
                   <Wallet className={`w-5 h-5 ${paymentMethod === "MOMO" ? "text-primary" : "text-zinc-300"}`} />
                </label>
              </div>
            </div>

            {/* 5. Tổng kết đơn hàng */}
            <div className="bg-white p-8 rounded-[40px] border border-zinc-200 shadow-sm space-y-8">
               <h2 className="text-xl font-black text-zinc-900 border-b border-zinc-50 pb-4">Chi tiết thanh toán</h2>
               
               <div className="space-y-4">
                 <div className="flex justify-between text-sm font-medium">
                   <span className="text-zinc-500">Tổng tiền hàng</span>
                   <span className="text-zinc-900 font-bold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}</span>
                 </div>
                 <div className="flex justify-between text-sm font-medium">
                   <span className="text-zinc-500">Phí vận chuyển</span>
                   <span className="text-primary font-bold">Miễn phí</span>
                 </div>
                 <div className="flex justify-between text-sm font-medium">
                   <span className="text-zinc-500">Bảo hiểm Escrow (2%)</span>
                   <span className="text-zinc-900 font-bold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(insuranceFee)}</span>
                 </div>
                 {appliedVoucher && (
                   <div className="flex justify-between text-sm font-bold text-primary">
                     <span>Giảm giá Voucher</span>
                     <span>-{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(appliedVoucher.discountAmount)}</span>
                   </div>
                 )}
               </div>

               <div className="h-px bg-zinc-100" />

               <div className="flex justify-between items-end">
                 <span className="font-black text-zinc-900 uppercase tracking-wider text-xs">Tổng thanh toán</span>
                 <span className="text-3xl font-black text-primary">
                   {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(grandTotal)}
                 </span>
               </div>

               <button 
                 onClick={handlePlaceOrder}
                 disabled={isProcessing}
                 className="w-full bg-secondary text-white font-black py-5 rounded-[24px] flex items-center justify-center gap-3 hover:bg-[#e67500] transition-all shadow-xl shadow-secondary/20 disabled:opacity-50 text-lg group"
               >
                 {isProcessing ? "ĐANG XỬ LÝ..." : "ĐẶT HÀNG NGAY"}
                 {!isProcessing && <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
               </button>

               <div className="flex flex-col gap-4 pt-4">
                <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-2xl border border-zinc-100">
                  <ShieldCheck className="w-5 h-5 text-zinc-400" />
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest leading-relaxed">
                    Đảm bảo an toàn 100% với hệ thống Libris Escrow.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Voucher Selector Modal */}
        <AnimatePresence>
          {isVoucherModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 onClick={() => setIsVoucherModalOpen(false)}
                 className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
               />
               <motion.div 
                 initial={{ scale: 0.95, opacity: 0, y: 20 }}
                 animate={{ scale: 1, opacity: 1, y: 0 }}
                 exit={{ scale: 0.95, opacity: 0, y: 20 }}
                 className="relative w-full max-w-lg bg-[#F8F9FA] rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
               >
                 <div className="p-8 bg-white border-b border-zinc-100 flex-shrink-0">
                   <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-black">Libris Voucher</h3>
                        <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mt-1">Chọn 1 mã giảm giá</p>
                      </div>
                      <button 
                        onClick={() => setIsVoucherModalOpen(false)}
                        className="p-2 hover:bg-zinc-100 rounded-full transition-all"
                      >
                        <X className="w-6 h-6 text-zinc-400" />
                      </button>
                   </div>
                 </div>

                 <div className="flex-1 overflow-y-auto p-8 space-y-4">
                    {availableVouchers.length === 0 ? (
                      <div className="text-center py-10">
                        <Ticket className="w-12 h-12 text-zinc-200 mx-auto mb-4" />
                        <p className="text-zinc-500 font-bold">Hiện không có voucher nào khả dụng</p>
                      </div>
                    ) : (
                      availableVouchers.map((v) => {
                        const isEligible = total >= v.minOrderAmount;
                        const shortDesc = v.discountType === "PERCENTAGE" 
                          ? `Giảm ${v.discountValue}%` 
                          : `Giảm ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v.discountValue)}`;

                        return (
                          <div 
                            key={v.id} 
                            className={`bg-white rounded-[24px] border-2 transition-all p-5 flex items-center gap-5 ${
                              isEligible ? "border-zinc-100 hover:border-primary/30" : "opacity-60 border-zinc-100"
                            }`}
                          >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                              isEligible ? "bg-primary/10 text-primary" : "bg-zinc-100 text-zinc-400"
                            }`}>
                              <Ticket className="w-7 h-7" />
                            </div>
                            <div className="flex-1 min-w-0">
                               <div className="flex items-center gap-2 mb-1">
                                 <span className="font-black text-zinc-900">{v.code}</span>
                                 <span className="bg-secondary/10 text-secondary text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">Limited</span>
                               </div>
                               <p className="text-xs font-bold text-zinc-900 leading-snug">{v.description}</p>
                               {!isEligible && (
                                 <p className="text-[10px] text-red-500 font-black mt-2 uppercase tracking-wider">
                                   Cần mua thêm {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v.minOrderAmount - total)}
                                 </p>
                               )}
                            </div>
                            <button 
                              disabled={!isEligible}
                              onClick={() => handleApplyVoucher(v.code)}
                              className={`px-5 py-2.5 rounded-xl font-black text-xs transition-all ${
                                isEligible 
                                ? "bg-primary text-white hover:bg-[#00a39f] shadow-lg shadow-primary/20" 
                                : "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                              }`}
                            >
                              DÙNG
                            </button>
                          </div>
                        );
                      })
                    )}
                 </div>
               </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
