import { auth } from "@/lib/auth";
import { getNotifications, markAllAsRead } from "@/lib/notification-actions";
import { Navbar } from "@/components/layout/Navbar";
import { Bell, CheckCircle2, MessageSquare, Tag, Info, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { enUS } from "date-fns/locale"; // Import English locale
import Link from "next/link";
import { redirect } from "next/navigation";
import { getDictionary, getLanguage } from "@/lib/i18n";

export default async function NotificationsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const dict = await getDictionary();
  const lang = await getLanguage();

  const userId = (session.user as any).id;
  const notifications = await getNotifications(userId);

  // Mark all as read when viewing the page
  await markAllAsRead(userId);

  const getIcon = (type: string) => {
    switch (type) {
      case "ORDER": return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "OFFER": return <Tag className="w-5 h-5 text-orange-500" />;
      case "SYSTEM": return <Info className="w-5 h-5 text-blue-500" />;
      default: return <Bell className="w-5 h-5 text-zinc-400" />;
    }
  };

  const getTranslatedTitle = (title: string, lang: string) => {
    if (lang === 'en') {
      if (title === "Lời đề nghị mới") return "New Offer";
      if (title === "Lời đề nghị được chấp nhận") return "Offer Accepted";
      if (title === "Lời đề nghị bị từ chối") return "Offer Rejected";
    }
    return title;
  };

  const getTranslatedMessage = (message: string, lang: string) => {
    if (lang === 'en') {
      // Match "X đã đề nghị mua "Y" với giá Z"
      const offerMatch = message.match(/(.+) đã đề nghị mua "(.+)" với giá (.+)/);
      if (offerMatch) {
        return `${offerMatch[1]} offered to buy "${offerMatch[2]}" for ${offerMatch[3]}`;
      }
      
      // Match "Người bán X đã chấp nhận lời đề nghị của bạn cho "Y"."
      const acceptMatch = message.match(/Người bán (.+) đã chấp nhận lời đề nghị của bạn cho "(.+)"\./);
      if (acceptMatch) {
        return `Seller ${acceptMatch[1]} accepted your offer for "${acceptMatch[2]}".`;
      }
      
      // Match "Người bán X đã từ chối lời đề nghị của bạn cho "Y"."
      const rejectMatch = message.match(/Người bán (.+) đã từ chối lời đề nghị của bạn cho "(.+)"\./);
      if (rejectMatch) {
        return `Seller ${rejectMatch[1]} rejected your offer for "${rejectMatch[2]}".`;
      }
    }
    return message;
  };

  return (
    <main className="min-h-screen bg-[#f8f9fa]">
      <Navbar />
      <div className="pt-48 pb-24 container mx-auto px-6 md:px-12 max-w-4xl">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-black text-zinc-900 tracking-tight flex items-center gap-4">
              {dict["notif.title"]}
              {notifications.length > 0 && (
                <span className="bg-primary text-white text-xs px-3 py-1 rounded-full font-black">
                  {notifications.length}
                </span>
              )}
            </h1>
            <p className="text-zinc-500 font-medium mt-2 text-lg">{dict["notif.subtitle"]}</p>
          </div>
        </div>

        <div className="bg-white rounded-[40px] border border-zinc-100 shadow-sm overflow-hidden">
          {notifications.length === 0 ? (
            <div className="py-32 flex flex-col items-center justify-center text-zinc-400">
              <Bell className="w-20 h-20 mb-6 opacity-10" />
              <p className="font-bold text-xl text-zinc-900">{dict["notif.empty"]}</p>
              <p className="font-medium">{dict["notif.emptyDesc"]}</p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-50">
              {notifications.map((notif) => (
                <div 
                  key={notif.id}
                  className={`p-8 hover:bg-zinc-50 transition-all flex gap-6 group ${!notif.isRead ? 'bg-primary/[0.02]' : ''}`}
                >
                  <div className="w-14 h-14 rounded-2xl bg-white border border-zinc-100 shadow-sm flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-zinc-900 text-lg">
                        {getTranslatedTitle(notif.title, lang)}
                      </h3>
                      <span className="text-xs font-bold text-zinc-400 flex items-center gap-1.5 bg-zinc-50 px-2 py-1 rounded-md">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: lang === 'vi' ? vi : enUS })}
                      </span>
                    </div>
                    <p className="text-zinc-600 font-medium mb-4 leading-relaxed">
                      {getTranslatedMessage(notif.message, lang)}
                    </p>
                    {notif.link && (
                      <Link 
                        href={notif.link}
                        className="inline-flex items-center gap-2 text-sm font-black text-primary hover:underline group-hover:translate-x-1 transition-transform"
                      >
                        {dict["notif.details"]}
                        <span className="text-lg">→</span>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
