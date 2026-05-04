import { auth } from "@/lib/auth";
import { getSellerOffers, respondToOffer } from "@/lib/offer-actions";
import { redirect } from "next/navigation";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

export default async function SellerOffersPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const userId = (session.user as any).id;
  const offers = await getSellerOffers(userId);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Lời mời mua hàng</h1>
        <p className="text-zinc-500 mt-2">Quản lý các đề nghị thương lượng giá từ người mua</p>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
        {offers.length === 0 ? (
          <div className="p-12 text-center text-zinc-500">
            <p>Chưa có lời mời mua hàng nào.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {offers.map((offer) => (
              <div key={offer.id} className="p-6 flex items-start gap-6 hover:bg-zinc-50 transition-colors">
                <div className="w-16 h-20 bg-zinc-100 rounded-lg overflow-hidden relative shrink-0">
                  <Image 
                    src={offer.book.imageUrl || "/placeholder-book.png"} 
                    alt={offer.book.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-zinc-900 mb-1">{offer.book.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-zinc-500 mb-3">
                    <span className="font-medium text-zinc-900">{offer.buyer.name}</span>
                    <span>•</span>
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatDistanceToNow(new Date(offer.createdAt), { addSuffix: true, locale: vi })}</span>
                  </div>
                  
                  {offer.message && (
                    <div className="bg-zinc-100 p-3 rounded-lg text-sm text-zinc-700 italic mb-4 border-l-4 border-zinc-300">
                      "{offer.message}"
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm text-zinc-500 block mb-1">Giá đề nghị:</span>
                      <span className="text-xl font-black text-primary">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(offer.amount)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {offer.status === "PENDING" ? (
                        <>
                          <form action={async () => {
                            "use server";
                            await respondToOffer(offer.id, "REJECTED");
                          }}>
                            <button type="submit" className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors">
                              <XCircle className="w-4 h-4" />
                              Từ chối
                            </button>
                          </form>
                          <form action={async () => {
                            "use server";
                            await respondToOffer(offer.id, "ACCEPTED");
                          }}>
                            <button type="submit" className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-white bg-green-500 hover:bg-green-600 transition-colors">
                              <CheckCircle className="w-4 h-4" />
                              Chấp nhận
                            </button>
                          </form>
                        </>
                      ) : (
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          offer.status === "ACCEPTED" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                          {offer.status === "ACCEPTED" ? "Đã chấp nhận" : "Đã từ chối"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
