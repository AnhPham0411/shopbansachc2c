import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "./ProfileForm";

export default async function SettingsPage() {
  const session = await auth();
  const userId = (session?.user as any)?.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) return <div>User not found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div>
        <h2 className="text-3xl font-black text-zinc-900 tracking-tight">Cài đặt tài khoản</h2>
        <p className="text-zinc-500 font-medium">Quản lý thông tin cá nhân và phương thức thanh toán</p>
      </div>

      <ProfileForm user={user as any} />

      {/* Security note */}
      <div className="p-8 bg-zinc-900 rounded-[40px] text-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <h4 className="text-xl font-bold">Bảo mật tài khoản</h4>
          <p className="text-zinc-400 text-sm">Email đăng nhập: <span className="text-white font-bold">{user.email}</span></p>
        </div>
        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 max-w-xs text-right opacity-50">
          Vui lòng liên hệ Admin nếu bạn muốn thay đổi email hoặc mật khẩu.
        </p>
      </div>
    </div>
  );
}
