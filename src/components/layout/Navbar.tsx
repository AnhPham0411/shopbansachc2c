"use client";

import Link from "next/link";
import { BookOpen, Search, ShoppingCart, Menu, PlusCircle, Globe, HelpCircle, ChevronDown, List, MessageSquare, Heart, Trophy, Coins, LayoutGrid } from "lucide-react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { LogoutButton } from "./LogoutButton";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { useRouter } from "next/navigation";
import { NotificationBell } from "./NotificationBell";
import { useLanguage } from "@/components/providers/LanguageProvider";



export function Navbar() {
  const { data: session } = useSession();
  const [cartCount, setCartCount] = useState(0);
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isAllCategoriesOpen, setIsAllCategoriesOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const [categories, setCategories] = useState<{id: string, name: string, slug?: string}[]>([
    { id: "LITERATURE", name: "Văn học", slug: "van-hoc" },
    { id: "CHILDRENS", name: "Thiếu nhi", slug: "thieu-nhi" },
    { id: "COMICS", name: "Truyện tranh", slug: "truyen-tranh" },
    { id: "TEXTBOOK", name: "Sách giáo khoa", slug: "sach-giao-khoa" },
    { id: "ECONOMY", name: "Kinh tế", slug: "kinh-te" },
    { id: "SKILLS", name: "Kỹ năng sống", slug: "ky-nang-song" },
    { id: "OTHERS", name: "Khác", slug: "khac" },
  ]);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const data = await res.json();
            setCategories(data);
          } else {
            const text = await res.text();
            console.error("Expected JSON but received HTML:", text.slice(0, 100));
          }
        } else {
          console.error("Fetch failed with status:", res.status);
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

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
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
              const data = await res.json();
              setUnreadChatCount(data.count);
            } else {
              console.error("Expected JSON from /api/chat/unread but received HTML");
            }
          }
        } catch (error) {}
      };

      fetchUnread();
      const interval = setInterval(fetchUnread, 15000); // 15s
      return () => clearInterval(interval);
    }
  }, [session]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoadingSuggestions(true);
      try {
        const res = await fetch(`/api/books/suggestions?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const data = await res.json();
            setSuggestions(data);
            setShowSuggestions(true);
          } else {
            console.error("Expected JSON from suggestions API but received HTML");
          }
        }
      } catch (error) {
        console.error("Failed to fetch suggestions", error);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

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
            <div 
              className="relative flex items-center gap-1 cursor-pointer hover:text-white/80 transition-colors"
              onClick={() => setIsLangOpen(!isLangOpen)}
            >
              <span className="flex items-center gap-1">
                 <img src={language === "vi" ? "https://flagcdn.com/w20/vn.png" : "https://flagcdn.com/w20/gb.png"} width="16" alt="Flag" className="rounded-sm" />
                 {language === "vi" ? "Tiếng Việt" : "English"}
              </span>
              <ChevronDown className={`w-3 h-3 transition-transform ${isLangOpen ? "rotate-180" : ""}`} />
              
              {isLangOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white text-zinc-800 rounded-lg shadow-xl z-50 py-1.5 w-36 border border-zinc-100 font-medium overflow-hidden">
                  <div 
                    className="px-4 py-2 hover:bg-zinc-50 cursor-pointer flex items-center gap-2 text-xs transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLanguage("vi");
                      setIsLangOpen(false);
                    }}
                  >
                    <img src="https://flagcdn.com/w20/vn.png" width="16" alt="VN Flag" className="rounded-sm" />
                    Tiếng Việt
                  </div>
                  <div 
                    className="px-4 py-2 hover:bg-zinc-50 cursor-pointer flex items-center gap-2 text-xs transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLanguage("en");
                      setIsLangOpen(false);
                    }}
                  >
                    <img src="https://flagcdn.com/w20/gb.png" width="16" alt="GB Flag" className="rounded-sm" />
                    English
                  </div>
                </div>
              )}
            </div>
            <Link href="/support" className="flex items-center gap-1.5 hover:text-white/80">
              <HelpCircle className="w-3.5 h-3.5" />
              {t("nav.support")}
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
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) {
                setTimeout(() => setShowSuggestions(false), 200);
              }
            }}
          >
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => {
                if (suggestions.length > 0) setShowSuggestions(true);
              }}
              placeholder={t("nav.searchPlaceholder")} 
              className="w-full bg-[#f0f2f5] border-none rounded-lg py-3 pl-5 pr-12 text-sm focus:bg-white focus:ring-1 focus:ring-primary/20 transition-all outline-none"
            />
            <button 
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-primary transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-zinc-100 mt-1 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                {suggestions.map((book) => (
                  <Link 
                    key={book.id} 
                    href={`/books/${book.id}`}
                    className="flex items-center gap-3 p-3 hover:bg-zinc-50 transition-colors cursor-pointer border-b border-zinc-50 last:border-b-0"
                    onClick={() => {
                      setShowSuggestions(false);
                      setSearchQuery("");
                    }}
                  >
                    {book.imageUrl ? (
                      <img src={book.imageUrl} alt={book.title} className="w-8 h-10 object-cover rounded" />
                    ) : (
                      <div className="w-8 h-10 bg-zinc-100 rounded flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-zinc-400" />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-zinc-800 line-clamp-1">{book.title}</span>
                      {book.author && (
                        <span className="text-xs text-zinc-500 line-clamp-1">{book.author}</span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
            
            {showSuggestions && isLoadingSuggestions && (
              <div className="absolute top-full left-0 right-0 bg-white border border-zinc-100 mt-1 rounded-lg shadow-lg z-50 p-3 text-center text-sm text-zinc-500">
                Đang tìm kiếm...
              </div>
            )}
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

            {session && <NotificationBell />}

            <Link 
              href={sellLink} 
              className="flex items-center gap-2 bg-[#ff5a1f] hover:bg-[#e64a19] text-white px-4 lg:px-6 py-2 md:py-2.5 rounded-lg text-[10px] md:text-sm font-black transition-all shadow-md active:scale-95 uppercase tracking-wide"
            >
              <PlusCircle className="w-4 h-4 md:hidden" />
              <span className="hidden md:inline">{t("nav.sell")}</span>
              <span className="md:hidden">{t("nav.sell")}</span>
            </Link>

            <button className="lg:hidden p-2 text-zinc-600">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* 3. Categories Bar */}
      <div className="bg-white border-b border-zinc-100 py-2.5 px-4 md:px-12 hidden md:block">
        <div className="container mx-auto flex items-center gap-6 text-xs font-bold text-zinc-600">
          {/* Dropdown for All Categories */}
          <div 
            className="relative flex items-center gap-1.5 cursor-pointer hover:text-primary transition-colors"
            onClick={() => setIsAllCategoriesOpen(!isAllCategoriesOpen)}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>{t("category.all")}</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${isAllCategoriesOpen ? "rotate-180" : ""}`} />
            
            {isAllCategoriesOpen && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-zinc-100 rounded-xl shadow-lg z-50 py-2 w-48 font-medium">
                <Link 
                  href="/books"
                  className="block px-4 py-2 hover:bg-zinc-50 text-zinc-700 hover:text-primary text-sm transition-colors"
                  onClick={() => setIsAllCategoriesOpen(false)}
                >
                  {t("category.all")}
                </Link>
                {categories.map((cat) => (
                  <Link 
                    key={cat.id} 
                    href={`/books?category=${cat.id}`}
                    className="block px-4 py-2 hover:bg-zinc-50 text-zinc-700 hover:text-primary text-sm transition-colors"
                    onClick={() => setIsAllCategoriesOpen(false)}
                  >
                    {t(`category.${cat.slug || cat.id.toLowerCase()}`)}
                  </Link>
                ))}
              </div>
            )}
          </div>
          
          <span className="text-zinc-300">|</span>
          
          {/* 5 Categories */}
          {categories.slice(0, 5).map((cat) => (
            <Link 
              key={cat.id} 
              href={`/books?category=${cat.id}`} 
              className="hover:text-primary transition-colors"
            >
              {t(`category.${cat.slug || cat.id.toLowerCase()}`)}
            </Link>
          ))}
        </div>
      </div>

    </header>
  );
}
