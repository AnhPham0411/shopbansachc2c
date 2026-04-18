"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Buyer gửi khiêu nại cho đơn hàng (Ví dụ: Sách rách, không đúng mô tả)
 */
export async function raiseDispute(subOrderId: string, reason: string, description: string, images?: string) {
  try {
    return await prisma.$transaction(async (tx) => {
      // 1. Kiểm tra đơn hàng hợp lệ
      const subOrder = await tx.subOrder.findUnique({
        where: { id: subOrderId }
      });

      if (!subOrder || (subOrder.status !== "SHIPPING" && subOrder.status !== "DELIVERED")) {
        throw new Error("Chỉ có thể khiếu nại đơn hàng đang giao hoặc đã giao.");
      }

      // 2. Chuyển trạng thái đơn hàng sang DISPUTED
      await tx.subOrder.update({
        where: { id: subOrderId },
        data: { status: "DISPUTED" }
      });

      // 3. Tạo bản ghi khiếu nại
      await tx.dispute.create({
        data: {
          subOrderId,
          reason,
          description,
          images,
          status: "PENDING_SELLER"
        }
      });

      revalidatePath("/buyer/orders");
      revalidatePath("/seller/orders");
      return { success: true };
    });
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * User chấp nhận hoàn tiền -> Trả tiền về cho Buyer
 */
async function processRefund(tx: any, subOrder: any, dispute: any) {
  const subOrderId = subOrder.id;
  
  // 1. Cập nhật trạng thái
  await tx.subOrder.update({
    where: { id: subOrderId },
    data: { status: "REFUNDED" }
  });

  await tx.dispute.update({
    where: { subOrderId },
    data: { status: "RESOLVED_REFUND" }
  });

  // 2. Tìm Admin và tính toán phần hoàn trả
  const admin = await tx.user.findFirst({ 
    where: { role: "ADMIN" },
    include: { wallets: true }
  });
  const isSellerAdmin = admin && subOrder.sellerId === admin.id;

  // 3. Khấu trừ thực tế từ người nhận tiền
  if (isSellerAdmin) {
    // Nếu Seller là Admin, hoàn 100% từ ví Admin
    await tx.wallet.update({
      where: { userId: admin!.id },
      data: { availableBalance: { decrement: subOrder.subTotal } }
    });

    await tx.walletTransaction.create({
      data: {
        walletId: admin!.wallets!.id,
        referenceSubOrderId: subOrderId,
        type: "DIRECT_SALE",
        amount: -subOrder.subTotal,
        description: `Hoàn doanh thu từ khiếu nại đơn hàng trực tiếp #${subOrderId.slice(0, 8)}`
      }
    });
  } else {
    // Nếu Seller là người khác: 10% từ Admin, 90% từ Seller Escrow
    if (admin && admin.wallets) {
      await tx.wallet.update({
        where: { userId: admin.id },
        data: { availableBalance: { decrement: subOrder.platformFee } }
      });

      await tx.walletTransaction.create({
        data: {
          walletId: admin.wallets.id,
          referenceSubOrderId: subOrderId,
          type: "DEDUCT_FEE",
          amount: -subOrder.platformFee,
          description: `Hoàn phí hệ thống từ khiếu nại đơn hàng #${subOrderId.slice(0, 8)}`
        }
      });
    }

    await tx.wallet.update({
      where: { userId: subOrder.sellerId },
      data: { escrowBalance: { decrement: subOrder.netAmount } }
    });
  }

  // 4. Cộng tiền cho Buyer
  const masterOrder = await tx.masterOrder.findUnique({ where: { id: subOrder.masterOrderId } });
  const buyerWallet = await tx.wallet.update({
    where: { userId: masterOrder!.buyerId },
    data: { availableBalance: { increment: subOrder.subTotal } }
  });

  // 5. Ghi nhận giao dịch hoàn tiền cho Buyer
  await tx.walletTransaction.create({
    data: {
      walletId: buyerWallet.id,
      referenceSubOrderId: subOrderId,
      type: "REFUND",
      amount: subOrder.subTotal,
      description: `Hoàn tiền thành công từ đơn hàng #${subOrderId.slice(0, 8)}`
    }
  });
}

/**
 * Seller phản hồi khiếu nại
 */
export async function respondToDispute(subOrderId: string, action: "ACCEPT_REFUND" | "ESCALATE_TO_ADMIN", reply?: string) {
  try {
    return await prisma.$transaction(async (tx) => {
      const dispute = await tx.dispute.findUnique({
        where: { subOrderId },
        include: { subOrder: true }
      });

      if (!dispute) throw new Error("Không tìm thấy khiếu nại.");

      if (action === "ACCEPT_REFUND") {
        await processRefund(tx, dispute.subOrder, dispute);
      } else {
        // Seller không đồng ý -> Chuyển lên cho Admin
        await tx.dispute.update({
          where: { subOrderId },
          data: { 
            status: "PENDING_ADMIN",
            sellerReply: reply || "Người bán từ chối khiếu nại và yêu cầu Admin phân xử."
          }
        });
      }

      revalidatePath("/seller/orders");
      revalidatePath("/buyer/orders");
      revalidatePath("/admin/disputes");
      return { success: true };
    });
  } catch (error: any) {
    console.error("Lỗi phản hồi khiếu nại:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Admin giải quyết khiếu nại
 */
export async function resolveDisputeByAdmin(subOrderId: string, decision: "REFUND_BUYER" | "PAY_SELLER") {
  try {
    return await prisma.$transaction(async (tx) => {
      const dispute = await tx.dispute.findUnique({
        where: { subOrderId },
        include: { subOrder: true }
      });

      if (!dispute) throw new Error("Không tìm thấy khiếu nại.");

      const subOrder = dispute.subOrder;

      if (decision === "REFUND_BUYER") {
        await processRefund(tx, subOrder, dispute);
      } else {
        // Admin quyết định trả tiền cho Seller (Bác bỏ khiếu nại của Buyer)
        // Chạy lại logic giống completeOrder
        await tx.subOrder.update({ where: { id: subOrderId }, data: { status: "COMPLETED" } });
        await tx.dispute.update({ where: { subOrderId }, data: { status: "RESOLVED_PAY_SELLER" } });

        const admin = await tx.user.findFirst({ where: { role: "ADMIN" } });
        const isSellerAdmin = admin && subOrder.sellerId === admin.id;

        if (!isSellerAdmin) {
          const sellerWallet = await tx.wallet.update({
            where: { userId: subOrder.sellerId },
            data: {
              availableBalance: { increment: subOrder.netAmount },
              escrowBalance: { decrement: subOrder.netAmount }
            }
          });

          await tx.walletTransaction.create({
            data: {
              walletId: sellerWallet.id,
              referenceSubOrderId: subOrderId,
              type: "ESCROW_RELEASE",
              amount: subOrder.netAmount,
              description: `Giải ngân tiền (90%) sau khi khiếu nại bị bác bỏ, đơn #${subOrderId.slice(0, 8)}`
            }
          });
        }
      }

      revalidatePath("/admin/disputes");
      revalidatePath("/buyer/orders");
      revalidatePath("/seller/orders");
      return { success: true };
    });
  } catch (error: any) {
    console.error("Lỗi xử lý khiếu nại bởi Admin:", error);
    return { success: false, error: error.message };
  }
}
