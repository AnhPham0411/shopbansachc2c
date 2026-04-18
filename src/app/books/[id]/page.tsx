import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Shield, Truck, Info, BookOpen, Star, ArrowLeft, User } from "lucide-react";
import { PurchaseActions } from "./PurchaseActions";
import Link from "next/link";

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = await prisma.book.findUnique({
    where: { id },
    include: {
      seller: {
        select: { name: true, email: true }
      },
      reviews: {
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!book) {
    notFound();
  }

  const avgRating = book.reviews.length > 0
    ? book.reviews.reduce((acc, r) => acc + r.rating, 0) / book.reviews.length
    : 5;

  return (
    <main className="min-h-screen bg-[#F5F9F9] text-zinc-900">
      <Navbar />
      
      <div className="container mx-auto px-6 md:px-12 pt-44 pb-24">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-primary mb-8 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Quay lại danh sách
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left: Image Container */}
          <div className="lg:col-span-12 xl:col-span-5">
            <div className="sticky top-44 space-y-4">
              <div className="aspect-[3/4] bg-white rounded-[40px] border border-zinc-100 flex items-center justify-center overflow-hidden shadow-xl">
                {book.imageUrl ? (
                  <img src={book.imageUrl} alt={book.title} className="w-full h-full object-cover" />
                ) : (
                  <BookOpen className="w-24 h-24 text-zinc-100" />
                )}
              </div>
            </div>
          </div>

          {/* Right: Info Section */}
          <div className="lg:col-span-12 xl:col-span-7 space-y-10">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="px-5 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/10">
                  SÁCH {book.condition.replace('_', ' ')}
                </span>
                <div className="flex items-center gap-1.5 text-secondary">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="text-base font-black">{avgRating.toFixed(1)} / 5</span>
                  <span className="text-zinc-400 text-xs font-bold ml-1">({book.reviews.length} đánh giá)</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.1] text-zinc-900">
                  {book.title}
                </h1>
                <p className="text-xl font-bold text-zinc-400 uppercase tracking-widest">
                  Tác giả: <span className="text-zinc-900">{book.author || "Chưa cập nhật"}</span>
                </p>
              </div>
              
              <div className="flex flex-wrap items-center gap-8">
                <div className="flex items-center gap-3 p-2 pr-6 bg-white rounded-full border border-zinc-100 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-black">
                    {book.seller.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">Người bán</p>
                    <p className="text-sm font-bold text-zinc-900">{book.seller.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-primary font-black text-sm uppercase tracking-widest">
                  <Shield className="w-5 h-5" />
                  Giao dịch an toàn 100%
                </div>
              </div>
            </div>

            <div className="p-10 bg-white rounded-[48px] border border-zinc-100 shadow-2xl shadow-primary/5 space-y-10">
              <div className="flex items-end gap-4">
                <span className="text-6xl font-black text-primary leading-none tracking-tighter">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(book.price))}
                </span>
                {book.stockQuantity > 0 ? (
                  <span className="mb-2 px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black rounded-lg uppercase tracking-widest">Còn {book.stockQuantity} cuốn</span>
                ) : (
                  <span className="mb-2 px-3 py-1 bg-red-50 text-red-600 text-[10px] font-black rounded-lg uppercase tracking-widest">Hết hàng</span>
                )}
              </div>

              <PurchaseActions book={{
                ...book,
                price: Number(book.price)
              } as any} />
              
              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-zinc-50">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-[#F5F9F9] flex items-center justify-center border border-primary/10">
                      <Truck className="w-6 h-6 text-primary" />
                   </div>
                   <p className="text-xs font-black text-zinc-500 uppercase tracking-widest leading-snug">Giao hàng<br/>toàn quốc</p>
                </div>
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center border border-orange-100">
                      <Info className="w-6 h-6 text-secondary" />
                   </div>
                   <p className="text-xs font-black text-zinc-500 uppercase tracking-widest leading-snug">Kiểm tra<br/>khi nhận sách</p>
                </div>
              </div>
            </div>

            <div className="space-y-12">
              <div className="flex gap-12 border-b border-zinc-100">
                <button className="text-zinc-900 font-black border-b-4 border-primary pb-6 text-sm uppercase tracking-widest">Mô tả sản phẩm</button>
                <button className="text-zinc-300 font-black hover:text-zinc-500 transition-colors pb-6 text-sm uppercase tracking-widest flex items-center gap-2">
                   Nhận xét <span className="bg-zinc-100 px-2 py-0.5 rounded-full text-[10px]">{book.reviews.length}</span>
                </button>
              </div>
              
              <div className="space-y-12">
                <div className="text-zinc-600 leading-relaxed font-medium space-y-6">
                    <p className="text-lg whitespace-pre-line">
                    {book.description || "Người bán chưa cập nhật mô tả chi tiết cho cuốn sách này. Vui lòng liên hệ người bán để biết thêm thông tin."}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-8 bg-white rounded-[32px] border border-zinc-100 shadow-sm">
                        <h4 className="text-primary font-black text-xs mb-4 flex items-center gap-3 uppercase tracking-widest">
                        <Shield className="w-5 h-5 text-primary" /> Thanh toán Escrow
                        </h4>
                        <p className="text-xs text-zinc-500 leading-relaxed font-bold">
                        Tiền của bạn sẽ được giam tại sàn (Escrow) và chỉ nhả cho người bán khi bạn xác nhận đã nhận được sách đúng mô tả.
                        </p>
                    </div>
                    <div className="p-8 bg-white rounded-[32px] border border-zinc-100 shadow-sm">
                        <h4 className="text-zinc-900 font-black text-xs mb-4 flex items-center gap-3 uppercase tracking-widest">
                        <Truck className="w-5 h-5 text-zinc-900" /> Vận chuyển & Phí
                        </h4>
                        <p className="text-xs text-zinc-500 leading-relaxed font-bold">
                        Sách sẽ được đối soát và gửi qua đơn vị vận chuyển uy tín trong vòng 24-48h sau khi đặt hàng. 
                        </p>
                    </div>
                    </div>
                </div>

                {/* REAL REVIEWS SECTION */}
                <div className="space-y-8 pt-10 border-t border-zinc-100">
                   <h3 className="text-2xl font-black text-zinc-900 flex items-center gap-3">
                      <Star className="text-secondary fill-current" /> Đánh giá từ người mua
                   </h3>
                   
                   {book.reviews.length === 0 ? (
                      <div className="p-10 bg-zinc-50 rounded-[32px] border border-zinc-100 border-dashed text-center text-zinc-400 font-bold italic">
                         Chưa có đánh giá nào cho cuốn sách này.
                      </div>
                   ) : (
                      <div className="grid gap-6">
                        {book.reviews.map((review) => (
                           <div key={review.id} className="p-8 bg-white rounded-[32px] border border-zinc-100 shadow-sm space-y-4">
                              <div className="flex justify-between items-center">
                                 <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-zinc-400 text-sm">
                                       <User className="w-5 h-5" />
                                    </div>
                                    <div>
                                       <p className="text-sm font-black text-zinc-900">Người mua ẩn danh</p>
                                       <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{new Date(review.createdAt).toLocaleDateString('vi-VN')}</p>
                                    </div>
                                 </div>
                                 <div className="flex items-center gap-1 text-secondary">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                       <Star key={s} className={`w-3.5 h-3.5 ${review.rating >= s ? 'fill-current' : 'text-zinc-200'}`} />
                                    ))}
                                 </div>
                              </div>
                              <p className="text-zinc-700 font-medium leading-relaxed italic">"{review.comment}"</p>
                           </div>
                        ))}
                      </div>
                   )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
