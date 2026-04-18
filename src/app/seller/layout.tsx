import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { LayoutDashboard, BookPlus, Wallet, Settings, BookOpen, User, Bell, ChevronLeft, Shield, ShoppingBag } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { LogoutButton } from "@/components/layout/LogoutButton";
import { SidebarNav } from "./SidebarNav";

export default async function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  if (!session) {
    redirect("/login?callbackUrl=/seller/books");
  }

  const role = (session.user as any)?.role;

  // Everyone who is logged in can now sell
  return (
    <div className="min-h-screen bg-[#F8F9FA] flex">
      {/* Sidebar */}
      <aside className="w-72 border-r border-zinc-200 bg-white flex flex-col fixed inset-y-0 z-10 transition-all">
        <div className="p-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary p-2 rounded-2xl group-hover:rotate-12 transition-transform">
              <BookOpen className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-primary">LIBRIS</span>
          </Link>
          <div className="mt-4 px-2 py-1 bg-primary/5 rounded-lg border border-primary/10 inline-block">
             <span className="text-[10px] font-black uppercase text-primary tracking-widest">Kênh người bán</span>
          </div>
        </div>

        <SidebarNav role={role} />

        <div className="p-6 border-t border-zinc-100">
          <LogoutButton 
            variant="sidebar" 
            callbackUrl="/login" 
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72">
        <header className="h-20 bg-white border-b border-zinc-100 flex items-center justify-between px-10 sticky top-0 z-20">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400">
                <LayoutDashboard className="w-5 h-5" />
             </div>
             <h1 className="font-black text-zinc-900 tracking-tight">Trang quản trị Seller</h1>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-zinc-400 hover:bg-zinc-50 rounded-xl transition-all">
               <Bell className="w-5 h-5" />
               <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full border-2 border-white" />
            </button>
            <div className="w-px h-6 bg-zinc-200" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-zinc-900">{session.user?.name}</p>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Hạng Thành Viên</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black shadow-sm">
                {session.user?.name?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        <div className="p-10 container max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
