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
import { useLanguage } from "@/components/providers/LanguageProvider";
import { validateVoucher, getActiveVouchers } from "@/lib/voucher-actions";
import { useSession } from "next-auth/react";
import { getAddresses } from "@/app/seller/settings/address-actions";

type PaymentMethod = "COD" | "VNPAY" | "MOMO";

export default function CheckoutPage() {
  const { cart: allItems, selectedTotal: total, removeSelected, isLoaded } = useCart();
  const cart = allItems.filter(item => item.selected !== false);
  const { data: session } = useSession();
  const router = useRouter();
  const { t } = useLanguage();

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
    name: "",
    phone: "",
    address: "",
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
  }, [cart.length, router, isProcessing, isLoaded, isSuccess]);

  useEffect(() => {
    if (isLoaded) {
      getActiveVouchers().then(res => {
        if (res.success) setAvailableVouchers(res.vouchers);
      });
    }
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded && session?.user?.id) {
      getAddresses().then(res => {
        if (res.success && res.data && res.data.length > 0) {
          const defaultAddr = res.data.find((a: any) => a.isDefault) || res.data[0];
          setShippingInfo({
            name: defaultAddr.name,
            phone: defaultAddr.phone,
            address: defaultAddr.address,
          });
        }
      });
    }
  }, [isLoaded, session]);

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

    const result = await validateVoucher(codeToUse, session?.user?.id as string, total, cart);
    if (result.success) {
      setAppliedVoucher({
        code: result.code!,
        discountAmount: result.discountAmount!,
        description: result.description,
      });
      setVoucherCode("");
      setIsVoucherModalOpen(false);
    } else {
      setVoucherError(t(result.error, (result as any).params) || t("checkout.invalidVoucher"));
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
      if (!res.ok) throw new Error(data.error || t("checkout.orderError"));

      setIsSuccess(true);
      removeSelected();
      router.push(`/checkout/success/${data.orderId}`);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F6F7F9] text-zinc-900 pb-10">
      <Navbar />

      <div className="container mx-auto px-4 md:px-8 pt-36 max-w-6xl">
        {/* Header Navigation */}
        <div className="flex items-center gap-3 mb-3">
          <Link href="/cart" className="p-1.5 bg-white rounded-lg border border-zinc-200 hover:border-primary/40 transition-all">
            <ChevronLeft className="w-4 h-4 text-zinc-500" />
          </Link>
          <div>
            <h1 className="text-xl font-black">{t("checkout.title")}</h1>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">{t("checkout.subtitle")}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          <div className="lg:col-span-8 space-y-4">

            {/* 1. Địa chỉ nhận hàng */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-4 border border-zinc-200 shadow-sm overflow-hidden relative"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary via-primary to-secondary/40" />
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-secondary" />
                </div>
                <h3 className="font-black text-base">{t("checkout.address")}</h3>
              </div>

              <div className="flex justify-between items-start text-sm">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
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
                  className="text-primary font-black text-xs hover:underline"
                >
                  {t("checkout.change")}
                </button>
              </div>
            </motion.div>

            {/* Address Modal */}
            <AnimatePresence>
              {isAddressModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsAddressModalOpen(false)}
                    className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
                  />
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 10 }}
                    className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-black">{t("checkout.newAddress")}</h3>
                        <button
                          onClick={() => setIsAddressModalOpen(false)}
                          className="p-1.5 hover:bg-zinc-100 rounded-full transition-all"
                        >
                          <X className="w-5 h-5 text-zinc-400" />
                        </button>
                      </div>

                      <form onSubmit={handleSaveAddress} className="space-y-4 text-sm">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">{t("checkout.fullName")}</label>
                          <input
                            type="text"
                            required
                            value={tempShippingInfo.name}
                            onChange={e => setTempShippingInfo({ ...tempShippingInfo, name: e.target.value })}
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-bold text-zinc-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                            placeholder={t("checkout.namePlaceholder")}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">{t("checkout.phone")}</label>
                          <input
                            type="tel"
                            required
                            value={tempShippingInfo.phone}
                            onChange={e => setTempShippingInfo({ ...tempShippingInfo, phone: e.target.value })}
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-bold text-zinc-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                            placeholder={t("checkout.phonePlaceholder")}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">{t("checkout.addressDetail")}</label>
                          <textarea
                            required
                            rows={2}
                            value={tempShippingInfo.address}
                            onChange={e => setTempShippingInfo({ ...tempShippingInfo, address: e.target.value })}
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 font-bold text-zinc-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
                            placeholder={t("checkout.addressPlaceholder")}
                          />
                        </div>

                        <div className="pt-2 flex gap-3">
                          <button
                            type="button"
                            onClick={() => setIsAddressModalOpen(false)}
                            className="flex-1 py-3 rounded-xl font-black text-zinc-500 hover:bg-zinc-50 transition-all border border-zinc-200"
                          >
                            {t("checkout.back")}
                          </button>
                          <button
                            type="submit"
                            className="flex-1 bg-primary text-white py-3 rounded-xl font-black hover:bg-[#00a39f] transition-all shadow-xl shadow-primary/20"
                          >
                            {t("checkout.complete")}
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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * (idx + 1) }}
                className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden"
              >
                <div className="px-4 py-2 bg-zinc-50 border-b border-zinc-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                      <ShoppingBag className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="text-xs font-black text-zinc-700">{t("checkout.packageFrom").replace("{name}", groupedItems[sellerId].sellerName)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-primary uppercase tracking-wider">
                    <Truck className="w-3 h-3" />
                    {t("checkout.fastPrep")}
                  </div>
                </div>

                <div className="p-4 space-y-4">
                  {groupedItems[sellerId].items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-12 h-16 bg-zinc-50 rounded-lg flex-shrink-0 flex items-center justify-center border border-zinc-100 overflow-hidden">
                        <ShoppingBag className="w-5 h-5 text-zinc-200" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-zinc-900 truncate leading-tight">{item.title}</h4>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[10px] font-bold text-zinc-400">{t("checkout.quantity").replace("{count}", String(item.quantity))}</span>
                          <span className="text-xs font-black text-primary">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="pt-4 border-t border-zinc-50 flex flex-col sm:flex-row justify-between items-center bg-zinc-50/50 -mx-4 -mb-4 px-4 py-2.5">
                    <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 mb-2 sm:mb-0">
                      <span>{t("checkout.shippingUnit")}</span>
                      <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-black text-[10px]">{t("checkout.freeShipping")}</span>
                    </div>
                    <div className="text-xs font-medium text-zinc-500">
                      {t("checkout.totalItems").replace("{count}", String(groupedItems[sellerId].items.length))}
                      <span className="text-primary font-black ml-1.5 text-base">
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-4 border border-zinc-200 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Ticket className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-black text-base">{t("checkout.voucher")}</h3>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder={t("checkout.voucherPlaceholder")}
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 font-bold text-zinc-900 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all pr-24 text-sm"
                  />
                  <button
                    onClick={handleApplyVoucher}
                    className="absolute right-1.5 top-1.5 bottom-1.5 bg-primary text-white rounded-lg px-3 font-black text-[10px] hover:bg-[#00a39f] transition-all"
                  >
                    {t("checkout.apply")}
                  </button>
                </div>

                <button
                  onClick={() => setIsVoucherModalOpen(true)}
                  className="flex items-center gap-1.5 text-zinc-400 hover:text-primary transition-all whitespace-nowrap"
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest pl-1">{t("checkout.selectOtherVoucher")}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {voucherError && <p className="text-red-500 text-[10px] mt-2 font-bold pl-1">{voucherError}</p>}

              <AnimatePresence>
                {appliedVoucher && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-4 p-3 bg-primary/5 border border-dashed border-primary/30 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-black text-primary">-{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(appliedVoucher.discountAmount)}</p>
                        <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{t("checkout.codeApplied")}: {appliedVoucher.code}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setAppliedVoucher(null)}
                      className="text-zinc-400 hover:text-red-500 font-bold text-[10px]"
                    >{t("checkout.remove")}</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-24">

            {/* 4. Phương thức thanh toán */}
            <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-zinc-400" />
                </div>
                <h3 className="font-black text-base">{t("checkout.payment")}</h3>
              </div>

              <div className="space-y-2">
                <label
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === "COD" ? "border-primary bg-primary/5" : "border-zinc-100 hover:border-zinc-200"
                    }`}
                >
                  <input type="radio" name="payment" className="hidden" onChange={() => setPaymentMethod("COD")} checked={paymentMethod === "COD"} />
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === "COD" ? "border-primary" : "border-zinc-300"}`}>
                    {paymentMethod === "COD" && <div className="w-2 h-2 rounded-full bg-primary" />}
                  </div>
                  <div className="flex-1 text-xs">
                    <p className="font-black text-zinc-900">{t("checkout.cod")}</p>
                    <p className="text-[9px] font-bold text-zinc-400 uppercase">{t("checkout.codDesc")}</p>
                  </div>
                  <Truck className={`w-4 h-4 ${paymentMethod === "COD" ? "text-primary" : "text-zinc-300"}`} />
                </label>

                <label
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === "VNPAY" ? "border-primary bg-primary/5" : "border-zinc-100 hover:border-zinc-200"
                    }`}
                >
                  <input type="radio" name="payment" className="hidden" onChange={() => setPaymentMethod("VNPAY")} checked={paymentMethod === "VNPAY"} />
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === "VNPAY" ? "border-primary" : "border-zinc-300"}`}>
                    {paymentMethod === "VNPAY" && <div className="w-2 h-2 rounded-full bg-primary" />}
                  </div>
                  <div className="flex-1 text-xs">
                    <p className="font-black text-zinc-900">{t("checkout.vnpay")}</p>
                    <p className="text-[9px] font-bold text-zinc-400 uppercase">{t("checkout.vnpayDesc")}</p>
                  </div>
                  <CreditCard className={`w-4 h-4 ${paymentMethod === "VNPAY" ? "text-primary" : "text-zinc-300"}`} />
                </label>

                <label
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === "MOMO" ? "border-primary bg-primary/5" : "border-zinc-100 hover:border-zinc-200"
                    }`}
                >
                  <input type="radio" name="payment" className="hidden" onChange={() => setPaymentMethod("MOMO")} checked={paymentMethod === "MOMO"} />
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === "MOMO" ? "border-primary" : "border-zinc-300"}`}>
                    {paymentMethod === "MOMO" && <div className="w-2 h-2 rounded-full bg-primary" />}
                  </div>
                  <div className="flex-1 text-xs">
                    <p className="font-black text-zinc-900">{t("checkout.momo")}</p>
                    <p className="text-[9px] font-bold text-zinc-400 uppercase">{t("checkout.momoDesc")}</p>
                  </div>
                  <Wallet className={`w-4 h-4 ${paymentMethod === "MOMO" ? "text-primary" : "text-zinc-300"}`} />
                </label>
              </div>
            </div>

            {/* 5. Tổng kết đơn hàng */}
            <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
              <h2 className="text-base font-black text-zinc-900 border-b border-zinc-50 pb-2">{t("checkout.paymentDetail")}</h2>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between font-medium">
                  <span className="text-zinc-500">{t("checkout.subtotal")}</span>
                  <span className="text-zinc-900 font-bold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-zinc-500">{t("checkout.shippingFee")}</span>
                  <span className="text-primary font-bold">{t("checkout.free")}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-zinc-500">{t("checkout.insurance")}</span>
                  <span className="text-zinc-900 font-bold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(insuranceFee)}</span>
                </div>
                {appliedVoucher && (
                  <div className="flex justify-between font-bold text-primary">
                    <span>{t("checkout.voucherDiscount")}</span>
                    <span>-{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(appliedVoucher.discountAmount)}</span>
                  </div>
                )}
              </div>

              <div className="h-px bg-zinc-100" />

              <div className="flex justify-between items-end">
                <span className="font-black text-zinc-900 uppercase tracking-wider text-[10px]">{t("checkout.total")}</span>
                <span className="text-xl font-black text-primary">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(grandTotal)}
                </span>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="w-full bg-secondary text-white font-black py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[#e67500] transition-all shadow-xl shadow-secondary/20 disabled:opacity-50 text-sm group"
              >
                {isProcessing ? t("checkout.processing") : t("checkout.orderNow")}
                {!isProcessing && <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />}
              </button>

              <div className="flex flex-col gap-3 pt-1">
                <div className="flex items-center gap-2 p-2.5 bg-zinc-50 rounded-xl border border-zinc-100">
                  <ShieldCheck className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                  <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest leading-relaxed">
                    {t("checkout.escrowNotice")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Voucher Selector Modal */}
        <AnimatePresence>
          {isVoucherModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsVoucherModalOpen(false)}
                className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                className="relative w-full max-w-md bg-[#F8F9FA] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
              >
                <div className="p-6 bg-white border-b border-zinc-100 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-black">{t("checkout.voucher")}</h3>
                      <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">{t("checkout.selectVoucher")}</p>
                    </div>
                    <button
                      onClick={() => setIsVoucherModalOpen(false)}
                      className="p-1.5 hover:bg-zinc-100 rounded-full transition-all"
                    >
                      <X className="w-5 h-5 text-zinc-400" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-3">
                  {availableVouchers.length === 0 ? (
                    <div className="text-center py-8">
                      <Ticket className="w-10 h-10 text-zinc-200 mx-auto mb-3" />
                      <p className="text-zinc-500 font-bold text-sm">{t("checkout.noVouchers")}</p>
                    </div>
                  ) : (
                    availableVouchers.map((v) => {
                      const userRank = (session?.user as any)?.rank || "BRONZE";
                      const ranks = ["BRONZE", "SILVER", "GOLD", "PLATINUM"];
                      const isRankEligible = ranks.indexOf(userRank) >= ranks.indexOf(v.minRank || "BRONZE");
                      const isAmountEligible = total >= v.minOrderAmount;

                      // Check if this voucher is linked to any book in the current cart
                      const isProductEligible = v.books?.some((vb: any) => cart.some(ci => ci.id === vb.id)) || (v.books === undefined);

                      const isEligible = isRankEligible && isAmountEligible && isProductEligible;
                      const shortDesc = v.discountType === "PERCENTAGE"
                        ? t("checkout.discountPercent").replace("{value}", String(v.discountValue))
                        : t("checkout.discountAmount").replace("{value}", new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v.discountValue));

                      return (
                        <div
                          key={v.id}
                          className={`bg-white rounded-2xl border-2 transition-all p-4 flex items-center gap-4 ${isEligible ? "border-zinc-100 hover:border-primary/30" : "opacity-60 border-zinc-100"
                            }`}
                        >
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${isEligible ? "bg-primary/10 text-primary" : "bg-zinc-100 text-zinc-400"
                            }`}>
                            <Ticket className="w-6 h-6" />
                          </div>
                          <div className="flex-1 min-w-0 text-xs">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-black text-zinc-900">{v.code}</span>
                              <span className="bg-secondary/10 text-secondary text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-tighter">Limited</span>
                            </div>
                            <p className="font-bold text-zinc-900 leading-snug">{v.description}</p>
                            {!isAmountEligible && (
                              <p className="text-[9px] text-red-500 font-black mt-1.5 uppercase tracking-wider">
                                {t("checkout.needMore").replace("{value}", new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v.minOrderAmount - total))}
                              </p>
                            )}
                            {!isRankEligible && (
                              <p className="text-[9px] text-red-500 font-black mt-1.5 uppercase tracking-wider">
                                {t("checkout.needRank").replace("{rank}", v.minRank)}
                              </p>
                            )}
                          </div>
                          <button
                            disabled={!isEligible}
                            onClick={() => handleApplyVoucher(v.code)}
                            className={`px-4 py-2 rounded-lg font-black text-[10px] transition-all flex-shrink-0 ${isEligible
                                ? "bg-primary text-white hover:bg-[#00a39f] shadow-lg shadow-primary/20"
                                : "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                              }`}
                          >
                            {t("checkout.use")}
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
