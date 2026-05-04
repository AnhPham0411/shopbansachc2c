"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import Link from "next/link";
import { getUnreadCount } from "@/lib/notification-actions";
import { useSession } from "next-auth/react";

export function NotificationBell() {
  const { data: session } = useSession();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (session?.user) {
      const fetchCount = async () => {
        const count = await getUnreadCount((session.user as any).id);
        setUnreadCount(count);
      };

      fetchCount();
      const interval = setInterval(fetchCount, 30000); // 30s
      return () => clearInterval(interval);
    }
  }, [session]);

  return (
    <Link href="/notifications" className="relative p-2 text-zinc-600 hover:bg-zinc-50 rounded-full transition-all group">
      <Bell className="w-6 h-6 group-hover:text-primary transition-all" />
      {unreadCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-white">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </Link>
  );
}
