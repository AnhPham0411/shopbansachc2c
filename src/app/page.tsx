import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/home/Hero";
import { FeaturedBooks } from "@/components/home/FeaturedBooks";
import { Shield, RefreshCcw, Truck, Wallet } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { getActiveVouchers } from "@/lib/voucher-actions";
import { Promotions } from "@/components/home/Promotions";
import { serializePrisma } from "@/lib/utils";
import { getDictionary } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await auth();
  const dict = await getDictionary();
  const rawBooks = await prisma.book.findMany({
    take: 40,
    orderBy: { createdAt: "desc" },
    include: {
      seller: {
        select: { name: true, id: true }
      },
      reviews: {
        select: { rating: true }
      }
    }
  });

  // Convert Decimal to Number for serialization to Client Components
  const books = serializePrisma(rawBooks);

  const { vouchers } = await getActiveVouchers();

  const avgRatingData = await prisma.review.aggregate({
    _avg: {
      rating: true
    }
  });
  const systemAvgRating = avgRatingData._avg.rating || 5.0;

  return (
    <main className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <Hero avgRating={systemAvgRating} />
      
      {vouchers.length > 0 && <Promotions vouchers={vouchers} />}
      
      {/* Trust Badges */}
      <section className="py-12 border-y border-zinc-100 bg-[#F5F9F9]">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: dict["home.trust1.title"], desc: dict["home.trust1.desc"] },
              { icon: RefreshCcw, title: dict["home.trust2.title"], desc: dict["home.trust2.desc"] },
              { icon: Truck, title: dict["home.trust3.title"], desc: dict["home.trust3.desc"] },
              { icon: Wallet, title: dict["home.trust4.title"], desc: dict["home.trust4.desc"] },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-sm mb-1">{item.title}</h3>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FeaturedBooks books={books} />

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[120px] -z-10" />
        <div className="container mx-auto px-6 md:px-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 italic text-zinc-900" dangerouslySetInnerHTML={{ __html: dict["home.cta.title"] }} />
          <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
            {dict["home.cta.desc"]}
          </p>
          <Link 
            href={!session ? "/login?callbackUrl=/seller/books" : "/seller/books"} 
            className="inline-block px-10 py-5 bg-primary text-white rounded-2xl font-black text-xl hover:bg-[#00a39f] transition-all shadow-xl shadow-primary/20 active:scale-95"
          >
            {dict["home.cta.button"]}
          </Link>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-12 border-t border-zinc-100 bg-white">
        <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-md">
              <Shield className="text-white w-4 h-4" />
            </div>
            <span className="text-xl font-bold tracking-tighter text-gradient">LIBRIS</span>
          </div>
          <p className="text-zinc-500 text-sm">{dict["footer.rights"]}</p>
          <div className="flex gap-6 text-sm text-zinc-500 font-medium">
            <a href="#" className="hover:text-primary transition-colors">{dict["footer.terms"]}</a>
            <a href="#" className="hover:text-primary transition-colors">{dict["footer.privacy"]}</a>
            <a href="#" className="hover:text-primary transition-colors">{dict["footer.contact"]}</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
