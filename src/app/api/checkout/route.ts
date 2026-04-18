import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Decimal } from "@prisma/client/runtime/library";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items, paymentMethod, voucherCode, shippingInfo } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Giỏ hàng trống" }, { status: 400 });
    }

    // 1. Validate that the buyer is NOT the seller of any item
    for (const item of items) {
      if (item.sellerId === session.user.id) {
        return NextResponse.json(
          { error: `Bạn không thể tự mua sách của chính mình (${item.title})` },
          { status: 400 }
        );
      }
    }

    // 2. Calculate base totals & group by seller
    const itemsBySeller = items.reduce((acc: any, item: any) => {
      if (!acc[item.sellerId]) {
        acc[item.sellerId] = [];
      }
      acc[item.sellerId].push(item);
      return acc;
    }, {});

    const subTotalAmount = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    // 2. Handle Voucher
    let discountAmount = 0;
    let voucherId = null;

    if (voucherCode) {
      const voucher = await prisma.voucher.findUnique({
        where: { code: voucherCode.toUpperCase(), isActive: true }
      });

      if (voucher) {
        // Simple re-validation
        if (!voucher.expiryDate || new Date(voucher.expiryDate) >= new Date()) {
          if (voucher.usedCount < voucher.usageLimit && subTotalAmount >= Number(voucher.minOrderAmount)) {
            voucherId = voucher.id;
            if (voucher.discountType === "PERCENTAGE") {
              discountAmount = subTotalAmount * (Number(voucher.discountValue) / 100);
              if (voucher.maxDiscount && discountAmount > Number(voucher.maxDiscount)) {
                discountAmount = Number(voucher.maxDiscount);
              }
            } else {
              discountAmount = Number(voucher.discountValue);
            }
          }
        }
      }
    }

    const finalTotalPayment = subTotalAmount - discountAmount;

    // 3. Start ACID Transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create Master Order
      const masterOrder = await tx.masterOrder.create({
        data: {
          buyerId: session.user.id!,
          totalPayment: new Decimal(finalTotalPayment),
          paymentMethod: paymentMethod || "COD",
          paymentStatus: paymentMethod === "COD" ? "PENDING" : "PENDING", // Simplified for demo
          voucherId: voucherId,
          discountAmount: new Decimal(discountAmount),
          shippingName: shippingInfo?.name,
          shippingPhone: shippingInfo?.phone,
          shippingAddress: shippingInfo?.address,
        },
      });

      // Update Voucher Usage
      if (voucherId) {
        await tx.voucher.update({
          where: { id: voucherId },
          data: { usedCount: { increment: 1 } }
        });
      }

      // 4. Find Admin for fee distribution
      const admin = await tx.user.findFirst({ where: { role: "ADMIN" } });

      // Create Sub Orders for each seller
      for (const sellerId in itemsBySeller) {
        const sellerItems = itemsBySeller[sellerId];
        const sellerSubTotal = sellerItems.reduce(
          (sum: number, item: any) => sum + item.price * item.quantity,
          0
        );

        const isAdminSeller = admin && sellerId === admin.id;
        
        // Calculate pro-rated discount for this seller
        const sellerDiscount = subTotalAmount > 0 
          ? (discountAmount * (sellerSubTotal / subTotalAmount)) 
          : 0;
        
        const discountedSellerSubTotal = sellerSubTotal - sellerDiscount;
        
        // Marketplace Logic: 
        // - Admin/Sàn self-selling: 0% Fee, 100% Net
        // - Others selling: 10% Fee, 90% Net
        const platformFeeAmount = isAdminSeller ? 0 : (discountedSellerSubTotal * 0.1);
        const netAmountAmount = discountedSellerSubTotal - platformFeeAmount;

        const subOrder = await tx.subOrder.create({
          data: {
            masterOrderId: masterOrder.id,
            sellerId: sellerId,
            subTotal: new Decimal(sellerSubTotal),
            platformFee: new Decimal(platformFeeAmount),
            netAmount: new Decimal(netAmountAmount),
            status: "PENDING",
            orderItems: {
              create: sellerItems.map((item: any) => ({
                bookId: item.id,
                quantity: item.quantity,
                priceAtPurchase: new Decimal(item.price),
              })),
            },
          },
        });

        // 5. Revenue Distribution
        if (admin) {
          // If Admin is selling, they get 100% (netAmountAmount).
          // If others are selling, Admin gets the 10% fee (platformFeeAmount).
          const adminRevenueAmount = isAdminSeller ? netAmountAmount : platformFeeAmount;

          if (adminRevenueAmount > 0) {
            const adminWallet = await tx.wallet.upsert({
              where: { userId: admin.id },
              update: { availableBalance: { increment: adminRevenueAmount } },
              create: { userId: admin.id, availableBalance: adminRevenueAmount, escrowBalance: 0 },
            });

            await tx.walletTransaction.create({
              data: {
                walletId: adminWallet.id,
                referenceSubOrderId: subOrder.id,
                type: isAdminSeller ? "DIRECT_SALE" : "DEDUCT_FEE",
                amount: new Decimal(adminRevenueAmount),
                description: isAdminSeller 
                  ? `Doanh thu bán hàng trực tiếp (Trang chủ Libris) từ đơn hàng #${subOrder.id.slice(0, 8)}`
                  : `Hoa hồng hệ thống (10%) từ đơn hàng #${subOrder.id.slice(0, 8)}`,
              },
            });
          }
        }

        if (!isAdminSeller) {
          // Add 90% to Regular Seller Escrow
          const sellerWallet = await tx.wallet.upsert({
            where: { userId: sellerId },
            update: { escrowBalance: { increment: netAmountAmount } },
            create: { userId: sellerId, availableBalance: 0, escrowBalance: netAmountAmount },
          });

          await tx.walletTransaction.create({
            data: {
              walletId: sellerWallet.id,
              referenceSubOrderId: subOrder.id,
              type: "IN_ESCROW",
              amount: new Decimal(netAmountAmount),
              description: `Giam tiền chờ đối soát (90%) cho đơn hàng #${subOrder.id.slice(0, 8)}`,
            },
          });
        }

        // 5. Update stock
        for (const item of sellerItems) {
          const book = await tx.book.findUnique({ where: { id: item.id } });
          if (!book || book.stockQuantity < item.quantity) {
            throw new Error(`Sách ${item.title} đã hết hàng hoặc không đủ số lượng.`);
          }
          await tx.book.update({
            where: { id: item.id },
            data: { stockQuantity: { decrement: item.quantity } },
          });
        }
      }

      return masterOrder;
    });

    return NextResponse.json({
      message: "Đặt hàng thành công",
      orderId: result.id,
    });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Đã có lỗi xảy ra khi thanh toán" },
      { status: 500 }
    );
  }
}
