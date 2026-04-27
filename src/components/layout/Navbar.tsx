"use client";

import Link from "next/link";
import { BookOpen, Search, ShoppingCart, Menu, PlusCircle, Globe, HelpCircle, ChevronDown, List, MessageSquare, Heart, Trophy, Coins } from "lucide-react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { LogoutButton } from "./LogoutButton";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { useRouter } from "next/navigation";

export function Navbar() {
  const { data: session } = useSession();
  const [cartCount, setCartCount] = useState(0);
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/books?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  useEffect(() => {
    const updateCount = () => {
      const savedCart = localStorage.getItem("libris_cart");
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        setCartCount(parsed.reduce((sum: number, item: any) => sum + item.quantity, 0));
      } else {
        setCartCount(0);
      }
    };

    updateCount();
    window.addEventListener("cart-updated", updateCount);
    return () => window.removeEventListener("cart-updated", updateCount);
  }, []);

  useEffect(() => {
    if (session) {
      const fetchUnread = async () => {
        try {
          const res = await fetch("/api/chat/unread");
          if (res.ok) {
            const data = await res.json();
            setUnreadChatCount(data.count);
          }
        } catch (error) {}
      };

      fetchUnread();
      const interval = setInterval(fetchUnread, 15000); // 15s
      return () => clearInterval(interval);
    }
  }, [session]);

  const getDashboardLink = () => {
    const role = (session?.user as any)?.role;
    if (role === "ADMIN") return "/admin/dashboard";
    return "/seller/books";
  };

  const { status } = useSession();
  const userRole = (session?.user as any)?.role;
  const sellLink = !session 
    ? `/login?callbackUrl=${encodeURIComponent("/seller/books")}` 
    : "/seller/books";

  return (
    <header className="fixed top-0 w-full z-50 flex flex-col">
      {/* 1. Announcement Bar (Green) */}
      <div className="bg-[#198754] text-white py-1.5 px-4 md:px-12 text-[11px] font-medium">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              <span>Libris - Nền tảng mua bán sách cũ vì một cộng đồng tri thức xanh!</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5 before:content-['•'] before:mr-2">
              <span className="text-white/90">Cam kết hoàn tiền 100% nếu sách không đúng mô tả!</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1 cursor-pointer hover:text-white/80 transition-colors">
              <span className="flex items-center gap-1">
                 <img src="https://flagcdn.com/w20/vn.png" width="16" alt="VN Flag" className="rounded-sm" />
                 Tiếng Việt
              </span>
              <ChevronDown className="w-3 h-3" />
            </div>
            <Link href="/support" className="flex items-center gap-1.5 hover:text-white/80">
              <HelpCircle className="w-3.5 h-3.5" />
              Hỗ trợ
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Main Header (White) */}
      <nav className="bg-white border-b border-zinc-100 py-3 px-4 md:px-12 h-20 flex items-center shadow-sm">
        <div className="container mx-auto flex items-center justify-between gap-6 md:gap-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center transition-transform group-hover:rotate-12">
              <BookOpen className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-primary italic">libris</span>
          </Link>

          <form 
            onSubmit={handleSearch}
            className="flex-1 max-w-3xl relative hidden sm:block"
          >
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm tên sách, tác giả, ISBN trên Libris..." 
              className="w-full bg-[#f0f2f5] border-none rounded-lg py-3 pl-5 pr-12 text-sm focus:bg-white focus:ring-1 focus:ring-primary/20 transition-all outline-none"
            />
            <button 
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-primary transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>

          {/* Auth & CTAs */}
          <div className="flex items-center gap-4 md:gap-6">
            {!session ? (
              <div className="flex items-center gap-5 text-sm font-bold text-zinc-700">
                <Link href="/register" className="hover:text-primary transition-colors">Đăng ký</Link>
                <Link href="/login" className="hover:text-primary transition-colors">Đăng nhập</Link>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="hidden lg:flex flex-col items-end mr-2">
                   <div className="flex items-center gap-1.5 bg-zinc-50 px-2 py-0.5 rounded-full border border-zinc-100">
                      <Trophy className="w-3.5 h-3.5 text-yellow-600" />
                      <span className="text-[10px] font-black uppercase text-zinc-600 tracking-wider">
                        {(session.user as any).rank || "BRONZE"}
                      </span>
                   </div>
                   <div className="flex items-center gap-1 mt-0.5">
                      <Coins className="w-3 h-3 text-primary" />
                      <span className="text-[11px] font-bold text-primary">
                        {((session.user as any).points || 0).toLocaleString()} <span className="text-[9px] uppercase">vàng</span>
                      </span>
                   </div>
                </div>
                <Link href={getDashboardLink()} className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center border border-zinc-200 text-zinc-600 font-bold hover:bg-zinc-200 transition-all">
                   {session.user?.name?.charAt(0)}
                </Link>
                <LogoutButton />
              </div>
            )}

            <Link href="/cart" className="relative p-2 text-zinc-600 hover:bg-zinc-50 rounded-full transition-all">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#f4511e] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {session && (
              <Link href="/chat" className="relative p-2 text-zinc-600 hover:bg-zinc-50 rounded-full transition-all">
                <MessageSquare className="w-6 h-6" />
                {unreadChatCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {unreadChatCount}
                  </span>
                )}
              </Link>
            )}

            {session && (
              <Link href="/buyer/favorites" className="p-2 text-zinc-600 hover:bg-zinc-50 rounded-full transition-all group relative">
                <Heart className="w-6 h-6 group-hover:fill-primary group-hover:text-primary transition-all" />
              </Link>
            )}

            <Link 
              href={sellLink} 
              className="flex items-center gap-2 bg-[#ff5a1f] hover:bg-[#e64a19] text-white px-4 lg:px-6 py-2 md:py-2.5 rounded-lg text-[10px] md:text-sm font-black transition-all shadow-md active:scale-95 uppercase tracking-wide"
            >
              <PlusCircle className="w-4 h-4 md:hidden" />
              <span className="hidden md:inline">Đăng bán</span>
              <span className="md:hidden">Bán sách</span>
            </Link>

            <button className="lg:hidden p-2 text-zinc-600">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* 3. Category Bar (Simple - Just Books) */}
      <div className="bg-white border-b border-zinc-100 px-4 md:px-12 py-2 hidden md:block overflow-x-auto">
        <div className="container mx-auto flex items-center gap-8 text-[13px] font-bold text-zinc-600">
          <div className="flex items-center gap-2 cursor-pointer hover:text-primary">
            <List className="w-4 h-4" />
            <span>Tất cả danh mục</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
          <div className="w-px h-4 bg-zinc-200" />
          <nav className="flex items-center gap-10">
            <Link href="/" className="text-primary border-b-2 border-primary pb-px">Sách</Link>
            <Link href="/collections/sach-cu" className="hover:text-primary transition-colors">Sách cũ</Link>
            <Link href="/collections/sach-moi" className="hover:text-primary transition-colors">Sách mới</Link>
            <Link href="/collections/truyen-tranh" className="hover:text-primary transition-colors">Truyện tranh</Link>
            <Link href="/collections/giao-khoa" className="hover:text-primary transition-colors">Sách giáo khoa</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
