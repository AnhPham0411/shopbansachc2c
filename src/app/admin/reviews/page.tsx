import { prisma } from "@/lib/prisma";
import { Star, MessageSquare, Trash2, Calendar, BookOpen, ExternalLink } from "lucide-react";
import { deleteReview } from "@/lib/review-actions";
import Link from "next/link";

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      book: { select: { title: true, id: true } },
      subOrder: { 
        include: { 
          masterOrder: { 
            include: { 
              buyer: { select: { name: true, email: true } } 
            } 
          } 
        } 
      }
    }
  });

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-black text-zinc-900 tracking-tight">Quản lý đánh giá</h2>
        <p className="text-zinc-500 font-medium">Theo dõi và điều hướng đánh giá từ khách hàng</p>
      </div>

      <div className="glass rounded-[32px] overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50">
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-zinc-500">Người đánh giá</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-zinc-500">Sách</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-zinc-500">Nội dung</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-zinc-500">Ngày</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-zinc-500 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {reviews.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center text-zinc-500 font-medium">
                  Chưa có đánh giá nào trên hệ thống.
                </td>
              </tr>
            ) : (
              reviews.map((review) => (
                <tr key={review.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-zinc-900">{review.subOrder.masterOrder.buyer.name}</p>
                    <p className="text-[10px] text-zinc-400">{review.subOrder.masterOrder.buyer.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <BookOpen size={16} />
                      </div>
                      <div className="max-w-[200px]">
                        <p className="text-sm font-bold text-zinc-900 truncate">{review.book.title}</p>
                        <Link 
                          href={`/books/${review.book.id}`} 
                          target="_blank"
                          className="flex items-center gap-1 text-[10px] text-primary hover:underline font-bold"
                        >
                          Xem sách <ExternalLink size={8} />
                        </Link>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-0.5 mb-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star 
                          key={s} 
                          size={12} 
                          className={s <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-zinc-200"} 
                        />
                      ))}
                    </div>
                    <p className="text-xs text-zinc-600 line-clamp-2 italic italic-quote">"{review.comment}"</p>
                  </td>
                  <td className="px-6 py-4 text-xs text-zinc-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <form action={async () => {
                      "use server";
                      await deleteReview(review.id);
                    }}>
                      <button className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                        <Trash2 size={18} />
                      </button>
                    </form>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
