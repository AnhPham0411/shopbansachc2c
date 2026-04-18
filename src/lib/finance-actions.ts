"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

/**
 * Seller yêu cầu rút tiền
 */
export async function requestWithdrawal(amount: number) {
  const session = await auth();
  const userId = (session?.user as any)?.id;

  if (!userId) return { error: "Bạn cần đăng nhập để thực hiện" };

  try {
    return await prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.findUnique({
        where: { userId }
      });

      if (!wallet || Number(wallet.availableBalance) < amount) {
        throw new Error("Số dư khả dụng không đủ để thực hiện giao dịch này.");
      }

      // 1. Trừ số dư khả dụng ngay lập tức (Tạm giữ để chờ Admin duyệt)
      await tx.wallet.update({
        where: { userId },
        data: { availableBalance: { decrement: amount } }
      });

      // 2. Tạo bản ghi giao dịch ở trạng thái PENDING
      await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: "WITHDRAW_PENDING",
          amount: -amount,
          description: `Yêu cầu rút tiền: ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)}`
        }
      });

      revalidatePath("/seller/wallet");
      revalidatePath("/admin/dashboard");
      return { success: true };
    });
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Admin duyệt yêu cầu rút tiền
 */
export async function approveWithdrawal(transactionId: string) {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") return { error: "Không có quyền thực hiện" };

  try {
    await prisma.walletTransaction.update({
      where: { id: transactionId },
      data: { 
        type: "WITHDRAW_SUCCESS",
        description: "Yêu cầu rút tiền đã được Admin duyệt thành công."
      }
    });

    revalidatePath("/admin/finance");
    revalidatePath("/admin/dashboard");
    revalidatePath("/seller/wallet");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
