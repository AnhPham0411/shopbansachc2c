"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookPlus, Wallet, Settings, ShoppingBag, Shield } from "lucide-react";

interface SidebarNavProps {
  role: string;
}

export function SidebarNav({ role }: SidebarNavProps) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Tổng quan", href: "/seller", icon: LayoutDashboard },
    { name: "Quản lý sách", href: "/seller/books", icon: BookPlus },
    { name: "Quản lý đơn hàng", href: "/seller/orders", icon: ShoppingBag },
    { name: "Ví tiền", href: "/seller/wallet", icon: Wallet },
    { name: "Đơn mua (Buyer)", href: "/buyer/orders", icon: ShoppingBag, secondary: true },
    { name: "Cài đặt", href: "/seller/settings", icon: Settings },
    ...(role === "ADMIN" ? [{ name: "Kênh Admin", href: "/admin/dashboard", icon: Shield, special: true }] : []),
  ];

  return (
    <nav className="flex-1 px-6 space-y-2">
      {menuItems.map((item) => {
        const isActive = pathname === item.href;
        
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group font-bold text-sm ${
              item.secondary 
                ? "text-zinc-400 hover:bg-zinc-50 hover:text-secondary border border-dashed border-zinc-100 mt-4"
                : isActive
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : item.special
                    ? "bg-secondary/10 text-secondary hover:bg-secondary/20"
                    : "text-zinc-500 hover:bg-zinc-50 hover:text-primary"
            }`}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
