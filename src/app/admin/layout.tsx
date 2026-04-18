import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ShieldCheck, Bell } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex">
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 ml-72">
        <header className="h-20 bg-white border-b border-zinc-100 flex items-center justify-between px-10 sticky top-0 z-20">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-secondary/10 border border-secondary/10 flex items-center justify-center text-secondary">
                <ShieldCheck className="w-5 h-5" />
             </div>
             <h1 className="font-black text-zinc-900 tracking-tight">Admin Control Center</h1>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-zinc-400 hover:bg-zinc-50 rounded-xl transition-all">
               <Bell className="w-5 h-5" />
               <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="w-px h-6 bg-zinc-200" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-zinc-900">Administrator</p>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Root Access</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary font-black shadow-sm">
                A
              </div>
            </div>
          </div>
        </header>
        <div className="p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
