"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Zap, ArrowRight, BookOpen, Star } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export function Hero() {
  const { data: session, status } = useSession();
  
  const userRole = (session?.user as any)?.role;
  const sellLink = !session 
    ? `/login?callbackUrl=${encodeURIComponent("/seller/books")}` 
    : "/seller/books";

  return (
    <section className="relative min-h-[90vh] flex items-center pt-44 overflow-hidden bg-[#F5F9F9]">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -mr-40 -mt-20 -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[80px] -ml-20 -mb-20 -z-10" />

      <div className="container mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/10 text-xs font-bold text-primary mb-8">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Sàn mua bán sách cũ an toàn & hiện đại nhất</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[1.1] text-zinc-900">
            Cho đi sách cũ, <br />
            <span className="text-primary">nhận lại tri thức mới.</span>
          </h1>
          
          <p className="text-xl text-zinc-600 mb-10 max-w-lg leading-relaxed font-medium">
            Tham gia cộng đồng hàng nghìn người yêu sách. 
            Giao dịch minh bạch, bảo mật với hệ thống <span className="text-zinc-900 font-bold underline decoration-primary/30">Libris Escrow</span>.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href="/books" className="px-10 py-5 bg-secondary text-white rounded-2xl font-black text-lg flex items-center gap-2 hover:bg-[#e67500] transition-all shadow-lg shadow-secondary/20 active:scale-95">
              MUA SÁCH NGAY <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href={sellLink} className="px-10 py-5 bg-white text-primary rounded-2xl font-black text-lg border-2 border-primary/20 hover:bg-primary/5 transition-all flex items-center gap-2 active:scale-95">
              BÁN SÁCH CỦA BẠN
            </Link>
          </div>

          <div className="mt-16 flex items-center gap-10">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-zinc-200 overflow-hidden">
                  <div className="w-full h-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">U{i}</div>
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-white bg-primary flex items-center justify-center text-[10px] font-bold text-white">+2k</div>
            </div>
            <div>
              <div className="flex items-center gap-1 text-secondary mb-1">
                {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-3 h-3 fill-current" />)}
              </div>
              <p className="text-sm font-bold text-zinc-800">Cộng đồng uy tín 100%</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative hidden md:block"
        >
          <div className="relative aspect-[4/5] max-w-md mx-auto rounded-[40px] overflow-hidden shadow-2xl border-8 border-white bg-white">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent" />
            <div className="flex flex-col items-center justify-center h-full p-12 text-center space-y-6">
               <div className="w-32 h-32 bg-primary/5 rounded-full flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-primary opacity-20" />
               </div>
               <div className="space-y-4">
                 <div className="h-4 w-48 bg-zinc-100 rounded-full mx-auto" />
                 <div className="h-4 w-40 bg-zinc-100 rounded-full mx-auto" />
                 <div className="h-4 w-56 bg-zinc-100 rounded-full mx-auto" />
               </div>
               <p className="text-zinc-400 text-sm font-medium italic">"Giao diện tối giản, trải nghiệm tối đa"</p>
            </div>
          </div>

          {/* Floating elements */}
          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-6 -right-10 p-5 bg-white rounded-3xl shadow-xl border border-zinc-50"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <ShieldCheck className="text-primary w-7 h-7" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Ví Escrow</div>
                <div className="text-base font-black text-zinc-900">An toàn 100%</div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute -bottom-6 -left-10 p-5 bg-white rounded-3xl shadow-xl border border-zinc-50"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center">
                <Star className="text-secondary w-7 h-7 fill-current" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Đánh giá</div>
                <div className="text-base font-black text-zinc-900">4.9/5 Sao</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
