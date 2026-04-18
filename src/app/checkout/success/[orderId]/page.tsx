import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { 
  CheckCircle2, 
  ShoppingBag, 
  ChevronRight, 
  Home, 
  Package, 
  MapPin, 
  CreditCard 
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SuccessLayout } from "./SuccessLayout";

export default async function OrderSuccessPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  const order = await prisma.masterOrder.findUnique({
    where: { id: orderId },
    include: {
      subOrders: {
        include: {
          orderItems: {
            include: { book: { select: { title: true } } }
          }
        }
      }
    }
  });

  if (!order) {
    notFound();
  }

  const totalItems = order.subOrders.reduce(
    (acc, sub) => acc + sub.orderItems.reduce((s, i) => s + i.quantity, 0),
    0
  );

  return (
    <main className="min-h-screen bg-[#F8F9FA] pb-20">
      <Navbar />
      
      <div className="container mx-auto px-6 pt-32 max-w-4xl">
        <SuccessLayout>
          {/* Main Success Card */}
          <div className="bg-white rounded-[48px] p-12 shadow-2xl shadow-primary/5 border border-zinc-100 flex flex-col items-center text-center relative overflow-hidden">
            {/* Background Decorative Element */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />

            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8 relative">
                <CheckCircle2 className="w-12 h-12 text-primary" />
                <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping opacity-20" />
            </div>

            <h1 className="text-4xl font-black text-zinc-900 mb-4 tracking-tighter">Đặt hàng thành công!</h1>
            <p className="text-zinc-500 font-medium max-w-md mx-auto mb-10">
              Cảm ơn bạn đã tin tưởng Libris. Đơn hàng của bạn đang được các chủ tiệm chuẩn bị và sẽ sớm được giao đến bạn.
            </p>

            {/* Order Brief */}
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
              <div className="bg-zinc-50 p-6 rounded-[32px] border border-zinc-100 text-left">
                 <div className="flex items-center gap-2 mb-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    <Package className="w-3.5 h-3.5" />
                    Đơn hàng
                 </div>
                 <p className="text-sm font-black text-zinc-900">#{order.id.slice(0, 8).toUpperCase()}</p>
                 <p className="text-[10px] text-zinc-500 font-bold">{totalItems} món đồ</p>
              </div>

              <div className="bg-zinc-50 p-6 rounded-[32px] border border-zinc-100 text-left">
                 <div className="flex items-center gap-2 mb-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    <CreditCard className="w-3.5 h-3.5" />
                    Thanh toán
                 </div>
                 <p className="text-sm font-black text-zinc-900">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(order.totalPayment))}
                 </p>
                 <p className="text-[10px] text-zinc-500 font-bold uppercase">{order.paymentMethod}</p>
              </div>

              <div className="bg-zinc-50 p-6 rounded-[32px] border border-zinc-100 text-left">
                 <div className="flex items-center gap-2 mb-2 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    <MapPin className="w-3.5 h-3.5" />
                    Địa chỉ
                 </div>
                 <p className="text-sm font-black text-zinc-900 truncate">{order.shippingName}</p>
                 <p className="text-[10px] text-zinc-500 font-bold truncate">{order.shippingAddress}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
               <Link 
                href="/buyer/orders"
                className="px-10 py-5 bg-zinc-900 text-white font-black rounded-3xl flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all active:scale-95 shadow-xl shadow-zinc-200"
               >
                 XEM ĐƠN HÀNG <ShoppingBag className="w-4 h-4" />
               </Link>
               <Link 
                href="/"
                className="px-10 py-5 bg-white text-zinc-900 font-black rounded-3xl flex items-center justify-center gap-2 hover:bg-zinc-50 transition-all border border-zinc-200 active:scale-95"
               >
                 TIẾP TỤC MUA SẮM <Home className="w-4 h-4" />
               </Link>
            </div>
          </div>

          {/* Shopee-style Additional Info */}
          <div className="mt-10 p-8 glass rounded-[40px] border-zinc-200/50 flex flex-col md:flex-row items-center justify-between gap-6">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                   <Package className="w-6 h-6" />
                </div>
                <div>
                   <h4 className="font-black text-zinc-900 uppercase tracking-tighter">Bạn sẽ sớm nhận được sách</h4>
                   <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-none mt-1">Hệ thống đang điều phối Seller chuẩn bị hàng</p>
                </div>
             </div>
             <Link href="/buyer/orders" className="flex items-center gap-2 text-primary font-black text-sm group">
               Kiểm tra hành trình đơn hàng <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
             </Link>
          </div>
        </SuccessLayout>
      </div>
    </main>
  );
}
