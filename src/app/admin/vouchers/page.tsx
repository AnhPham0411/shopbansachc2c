import { getAllVouchers } from "@/lib/voucher-actions";
import { VoucherManagementClient } from "./VoucherManagementClient";

export default async function AdminVouchersPage() {
  const { vouchers } = await getAllVouchers();

  return (
    <div className="space-y-10">
      <VoucherManagementClient vouchers={vouchers} />
    </div>
  );
}
