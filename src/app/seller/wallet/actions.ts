"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function requestWithdrawal(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  const userId = (session.user as any).id;
  const amountStr = formData.get("amount") as string;
  const amount = parseFloat(amountStr);

  if (isNaN(amount) || amount <= 0) {
    return { success: false, error: "Số tiền không hợp lệ" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { bankAccountInfo: true }
    });

    if (!user?.bankAccountInfo) {
      return { success: false, error: "Vui lòng cập nhật thông tin ngân hàng trước khi rút tiền" };
    }

    const wallet = await prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      return { success: false, error: "Không tìm thấy thông tin ví" };
    }

    if (Number(wallet.availableBalance) < amount) {
      return { success: false, error: "Số dư khả dụng không đủ" };
    }

    // Use transaction to ensure consistency
    await prisma.$transaction(async (tx) => {
      // 1. Create the transaction record
      await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: "WITHDRAW_PENDING",
          amount: -amount, // Negative because it's a withdrawal
          description: `Yêu cầu rút tiền về ngân hàng: ${user.bankAccountInfo}`,
        },
      });

      // 2. Update wallet balance
      await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          availableBalance: {
            decrement: amount,
          },
        },
      });
    });

    revalidatePath("/seller/wallet");
    revalidatePath("/seller");
    
    return { success: true };
  } catch (error: any) {
    console.error("Withdrawal error:", error);
    return { success: false, error: "Đã có lỗi xảy ra khi xử lý yêu cầu rút tiền" };
  }
}
