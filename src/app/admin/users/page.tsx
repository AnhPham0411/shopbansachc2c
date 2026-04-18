import { prisma } from "@/lib/prisma";
import { Users, Mail, UserCheck, Calendar, Shield, BookOpen } from "lucide-react";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { books: true, masterOrders: true }
      }
    }
  });

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-black text-zinc-900 tracking-tight">Quản lý người dùng</h2>
        <p className="text-zinc-500 font-medium">Danh sách toàn bộ thành viên trong hệ thống</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[
          { label: "Tổng người dùng", value: users.length, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Admin", value: users.filter(u => u.role === "ADMIN").length, icon: Shield, color: "text-red-500", bg: "bg-red-500/10" },
          { label: "User", value: users.filter(u => u.role === "USER").length, icon: UserCheck, color: "text-primary", bg: "bg-primary/10" },
        ].map((stat, i) => (
          <div key={i} className="glass p-6 rounded-3xl">
            <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-2xl font-black">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="glass rounded-[32px] overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50">
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-zinc-500">Người dùng</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-zinc-500">Vai trò</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-zinc-500">Hoạt động</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-zinc-500">Ngày tham gia</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-zinc-500 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-zinc-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-white">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-900">{user.name}</p>
                      <div className="flex items-center gap-1 text-[10px] text-zinc-400">
                        <Mail size={10} />
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                   <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${
                     user.role === 'ADMIN' ? 'bg-red-500/10 text-red-500' :
                     'bg-primary/10 text-primary'
                   }`}>
                     {user.role}
                   </span>
                </td>
                <td className="px-6 py-4 text-xs text-zinc-500">
                  <p>{user._count.books} Sách đăng bán</p>
                  <p>{user._count.masterOrders} Đơn hàng mua</p>
                </td>
                <td className="px-6 py-4 text-xs text-zinc-500">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                   <button className="text-xs font-bold text-zinc-400 hover:text-primary transition-colors">Chi tiết</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
