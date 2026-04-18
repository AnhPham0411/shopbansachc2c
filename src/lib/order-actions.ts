"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function completeOrder(subOrderId: string) {
  try {
    return await prisma.$transaction(async (tx) => {
      // 1. Get SubOrder details
      const subOrder = await tx.subOrder.findUnique({
        where: { id: subOrderId },
        include: { masterOrder: true }
      });

      if (!subOrder || subOrder.status === "COMPLETED") {
        throw new Error("Đơn hàng không hợp lệ hoặc đã hoàn thành");
      }

      // 2. Update status
      await tx.subOrder.update({
        where: { id: subOrderId },
        data: { status: "COMPLETED" },
      });

      // 3. Update Seller Wallet (Release Escrow)
      const admin = await tx.user.findFirst({ where: { role: "ADMIN" } });
      const isSellerAdmin = admin && subOrder.sellerId === admin.id;

      if (!isSellerAdmin) {
        // Only regular sellers have money in escrow
        const sellerWallet = await tx.wallet.update({
          where: { userId: subOrder.sellerId },
          data: {
            availableBalance: { increment: subOrder.netAmount },
            escrowBalance: { decrement: subOrder.netAmount },
          },
        });

        // 4. Record Seller Transaction
        await tx.walletTransaction.create({
          data: {
            walletId: sellerWallet.id,
            referenceSubOrderId: subOrderId,
            type: "ESCROW_RELEASE",
            amount: subOrder.netAmount,
            description: `Giải ngân tiền bán sách (90%) từ đơn hàng con #${subOrder.id.slice(0, 8)}`,
          },
        });
      }
      // Note: Admin sellers already received 100% in availableBalance at checkout.

      revalidatePath("/seller/wallet");
      revalidatePath("/admin/dashboard");
      return { success: true };
    });
  } catch (error: any) {
    console.error("Lỗi giải ngân:", error);
    return { success: false, error: error.message };
  }
}

export async function updateTrackingCode(subOrderId: string, formData: FormData) {
  const trackingCode = formData.get("trackingCode") as string;
  if (!trackingCode) return { error: "Mã vận đơn không được để trống" };

  try {
    const subOrder = await prisma.subOrder.findUnique({
      where: { id: subOrderId }
    });

    if (!subOrder || subOrder.status !== "PACKED") {
      throw new Error("Chỉ có thể giao cho ship khi đơn hàng đã đóng gói thành công");
    }

    await prisma.subOrder.update({
      where: { id: subOrderId },
      data: { trackingCode, status: "SHIPPING" },
    });
    revalidatePath("/seller/orders");
    revalidatePath("/buyer/orders");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function confirmOrder(subOrderId: string) {
  try {
    const subOrder = await prisma.subOrder.findUnique({
      where: { id: subOrderId }
    });

    if (!subOrder || subOrder.status !== "PENDING") {
      throw new Error("Chỉ có thể xác nhận đơn hàng đang chờ");
    }

    await prisma.subOrder.update({
      where: { id: subOrderId },
      data: { status: "CONFIRMED" },
    });
    revalidatePath("/seller/orders");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function packOrder(subOrderId: string) {
  try {
    const subOrder = await prisma.subOrder.findUnique({
      where: { id: subOrderId }
    });

    if (!subOrder || subOrder.status !== "CONFIRMED") {
      throw new Error("Chỉ có thể đóng gói khi đơn hàng đã xác nhận thông tin");
    }

    await prisma.subOrder.update({
      where: { id: subOrderId },
      data: { status: "PACKED" },
    });
    revalidatePath("/seller/orders");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateOrderStatus(subOrderId: string, status: any) {
  try {
    await prisma.subOrder.update({
      where: { id: subOrderId },
      data: { status },
    });
    revalidatePath("/seller/orders");
    revalidatePath("/buyer/orders");
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function cancelOrder(subOrderId: string) {
  try {
    return await prisma.$transaction(async (tx) => {
      // 1. Get SubOrder details with related info
      const subOrder = await tx.subOrder.findUnique({
        where: { id: subOrderId },
        include: { 
          masterOrder: true,
          orderItems: true 
        }
      });

      if (!subOrder || subOrder.status !== "PENDING") {
        throw new Error("Chỉ có thể hủy đơn hàng đang ở trạng thái chờ xác nhận");
      }

      // 2. Update status
      await tx.subOrder.update({
        where: { id: subOrderId },
        data: { status: "REFUNDED" },
      });

      // 3. Refund Money (Subtract from recipients -> Add to Buyer)
      const admin = await tx.user.findFirst({ 
        where: { role: "ADMIN" },
        include: { wallets: true }
      });
      const isSellerAdmin = admin && subOrder.sellerId === admin.id;

      if (isSellerAdmin) {
        // Full 100% was in Admin Available
        await tx.wallet.update({
          where: { userId: admin!.id },
          data: { availableBalance: { decrement: subOrder.netAmount } },
        });

        // Record Revenue Loss for Admin
        await tx.walletTransaction.create({
          data: {
            walletId: admin!.wallets!.id,
            referenceSubOrderId: subOrderId,
            type: "DIRECT_SALE",
            amount: new Decimal(-subOrder.netAmount),
            description: `Hoàn doanh thu do hủy đơn hàng tự bán #${subOrder.id.slice(0, 8)}`,
          },
        });
      } else {
        // 10% was in Admin Available, 90% was in Seller Escrow
        if (admin && admin.wallets) {
          await tx.wallet.update({
            where: { userId: admin.id },
            data: { availableBalance: { decrement: subOrder.platformFee } },
          });

          // Record Fee Loss for Admin
          await tx.walletTransaction.create({
            data: {
              walletId: admin.wallets.id,
              referenceSubOrderId: subOrderId,
              type: "DEDUCT_FEE",
              amount: new Decimal(-subOrder.platformFee),
              description: `Hoàn phí hệ thống do hủy đơn hàng #${subOrder.id.slice(0, 8)}`,
            },
          });
        }
        await tx.wallet.update({
          where: { userId: subOrder.sellerId },
          data: { escrowBalance: { decrement: subOrder.netAmount } },
        });
      }

      // Increment Buyer Available
      const buyerWallet = await tx.wallet.update({
        where: { userId: subOrder.masterOrder.buyerId },
        data: { availableBalance: { increment: subOrder.subTotal } },
      });

      // 4. Record Transaction for Buyer
      await tx.walletTransaction.create({
        data: {
          walletId: buyerWallet.id,
          referenceSubOrderId: subOrderId,
          type: "REFUND",
          amount: subOrder.subTotal,
          description: `Hoàn tiền do hủy đơn hàng #${subOrder.id.slice(0, 8)}`,
        },
      });

      // 5. Restore Book Stock
      for (const item of subOrder.orderItems) {
        await tx.book.update({
          where: { id: item.bookId },
          data: { stockQuantity: { increment: item.quantity } },
        });
      }

      revalidatePath("/buyer/orders");
      revalidatePath("/seller/orders");
      revalidatePath("/admin/orders");
      revalidatePath("/buyer/wallet");
      return { success: true };
    });
  } catch (error: any) {
    console.error("Lỗi hủy đơn:", error);
    return { success: false, error: error.message };
  }
}
