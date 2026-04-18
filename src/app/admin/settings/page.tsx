import { getAllVouchers } from "@/lib/voucher-actions";
import { SettingsClient } from "./SettingsClient";

export default async function AdminSettingsPage() {
  const { vouchers } = await getAllVouchers();

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-black text-zinc-900 tracking-tight">Cài đặt hệ thống</h2>
        <p className="text-zinc-500 font-medium">Quản lý cấu hình, mã giảm giá và chính sách sàn</p>
      </div>

      <SettingsClient vouchers={vouchers} />
    </div>
  );
}
