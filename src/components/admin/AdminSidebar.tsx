"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, CreditCard, ShieldAlert, Settings, BookOpen, Star, ShoppingBag, Tag, MessageSquare } from "lucide-react";
import { LogoutButton } from "@/components/layout/LogoutButton";

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 border-r border-zinc-200 bg-white flex flex-col fixed inset-y-0 z-10">
      <div className="p-8">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary p-2 rounded-2xl group-hover:rotate-12 transition-transform">
            <BookOpen className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-primary">LIBRIS</span>
        </Link>
        <div className="mt-4 px-2 py-1 bg-secondary/10 rounded-lg border border-secondary/10 inline-block">
           <span className="text-[10px] font-black uppercase text-secondary tracking-widest">Hệ thống quản trị</span>
        </div>
      </div>

      <nav className="flex-1 px-6 space-y-2">
        {/* ... existing links ... */}
        {[
          { name: "Tổng quan", href: "/admin/dashboard", icon: LayoutDashboard },
          { name: "Sản phẩm", href: "/admin/books", icon: BookOpen },
          { name: "Mã giảm giá", href: "/admin/vouchers", icon: Tag },
          { name: "Đơn hàng", href: "/admin/orders", icon: ShoppingBag },
          { name: "Người dùng", href: "/admin/users", icon: Users },
          { name: "Tài chính", href: "/admin/finance", icon: CreditCard },
          { name: "Giám sát Chat", href: "/admin/chat", icon: MessageSquare },
          { name: "Đánh giá", href: "/admin/reviews", icon: Star },
          { name: "Tranh chấp", href: "/admin/disputes", icon: ShieldAlert },
          { name: "Cài đặt", href: "/admin/settings", icon: Settings },
          { name: "Kênh Người bán", href: "/seller/books", icon: ShoppingBag, special: true },
        ].map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group font-bold text-sm ${
              pathname === item.href
              ? "bg-primary text-white shadow-lg shadow-primary/20"
              : (item as any).special 
                ? "bg-secondary/10 text-secondary hover:bg-secondary/20"
                : "text-zinc-500 hover:bg-zinc-50 hover:text-primary"
            }`}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="p-6 border-t border-zinc-100">
        <LogoutButton 
          variant="sidebar" 
          label="Đăng xuất Admin" 
          callbackUrl="/login" 
        />
      </div>
    </aside>
  );
}
