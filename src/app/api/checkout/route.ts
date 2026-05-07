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

    // 1. Validate items and determine correct price
    const validatedItems = [];
    for (const item of items) {
      if (item.sellerId === session.user.id) {
        return NextResponse.json(
          { error: `Bạn không thể tự mua sách của chính mình (${item.title})` },
          { status: 400 }
        );
      }

      const book = await prisma.book.findUnique({ where: { id: item.id } });
      if (!book) {
        return NextResponse.json({ error: `Sách ${item.title} không tồn tại` }, { status: 400 });
      }

      // Check for accepted offer to determine the correct price
      const acceptedOffer = await prisma.offer.findFirst({
        where: {
          buyerId: session.user.id,
          bookId: item.id,
          status: "ACCEPTED"
        },
        orderBy: { updatedAt: "desc" }
      });

      const validPrice = acceptedOffer ? Number(acceptedOffer.amount) : Number(book.price);

      validatedItems.push({
        ...item,
        price: validPrice,
      });
    }

    // 2. Calculate base totals & group by seller
    const itemsBySeller = validatedItems.reduce((acc: any, item: any) => {
      if (!acc[item.sellerId]) {
        acc[item.sellerId] = [];
      }
      acc[item.sellerId].push(item);
      return acc;
    }, {});

    const subTotalAmount = validatedItems.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    // 2. Handle Voucher
    let discountAmount = 0;
    let voucherId = null;
    let totalSupportingSubTotal = 0;

    if (voucherCode) {
      const voucher = await prisma.voucher.findUnique({
        where: { code: voucherCode.toUpperCase(), isActive: true },
        include: { books: { select: { id: true } } }
      });

      if (voucher) {
        // Find items that support this voucher
        const supportingItems = validatedItems.filter(item => 
          voucher.books.some(b => b.id === item.id)
        );

        if (supportingItems.length > 0) {
          totalSupportingSubTotal = supportingItems.reduce(
            (sum: number, item: any) => sum + item.price * item.quantity,
            0
          );

          // Simple re-validation
          if (!voucher.expiryDate || new Date(voucher.expiryDate) >= new Date()) {
            if (voucher.usedCount < voucher.usageLimit && subTotalAmount >= Number(voucher.minOrderAmount)) {
              voucherId = voucher.id;
              if (voucher.discountType === "PERCENTAGE") {
                discountAmount = totalSupportingSubTotal * (Number(voucher.discountValue) / 100);
                if (voucher.maxDiscount && discountAmount > Number(voucher.maxDiscount)) {
                  discountAmount = Number(voucher.maxDiscount);
                }
              } else {
                discountAmount = Number(voucher.discountValue);
                // Ensure discount doesn't exceed supporting subtotal
                if (discountAmount > totalSupportingSubTotal) discountAmount = totalSupportingSubTotal;
              }
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

        // Calculate voucher discount for THIS seller's supporting products
        let sellerVoucherDiscount = 0;
        if (voucherId && totalSupportingSubTotal > 0) {
          const voucher = await tx.voucher.findUnique({
            where: { id: voucherId },
            include: { books: { select: { id: true } } }
          });
          
          const sellerSupportingSubTotal = sellerItems
            .filter((item: any) => voucher?.books.some(b => b.id === item.id))
            .reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
          
          sellerVoucherDiscount = (discountAmount * (sellerSupportingSubTotal / totalSupportingSubTotal));
        }

        // 50/50 Split Logic:
        // Seller bears 50%, Admin bears 50%
        const sellerContribution = sellerVoucherDiscount * 0.5;
        // If it's admin selling, they bear 100% (already handled by logic below)

        // Marketplace Logic: 
        // - Admin/Sàn self-selling: 0% Fee, 100% Net
        // - Others selling: 10% Fee, 90% Net
        const platformFeeAmount = isAdminSeller ? 0 : (sellerSubTotal * 0.1);
        
        // Final Net Amount for Seller:
        // If Admin: they get everything minus the full discount
        // If Other: they get (SubTotal - Fee) - (50% of Discount)
        const netAmountAmount = isAdminSeller 
          ? (sellerSubTotal - sellerVoucherDiscount) 
          : (sellerSubTotal - platformFeeAmount - sellerContribution);

        const subOrder = await tx.subOrder.create({
          data: {
            masterOrderId: masterOrder.id,
            sellerId: sellerId,
            subTotal: new Decimal(sellerSubTotal),
            platformFee: new Decimal(platformFeeAmount),
            netAmount: new Decimal(netAmountAmount),
            voucherDiscount: new Decimal(sellerVoucherDiscount),
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
          // Admin Revenue:
          // If Admin is selling, they get 100% of their net (already includes full discount).
          // If others are selling, Admin gets the 10% fee MINUS their 50% voucher share.
          const adminContribution = sellerVoucherDiscount * 0.5;
          const adminRevenueAmount = isAdminSeller 
            ? netAmountAmount 
            : (platformFeeAmount - adminContribution);

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
                  ? `Doanh thu bán hàng trực tiếp từ đơn hàng #${subOrder.id.slice(0, 8)}`
                  : `Hoa hồng hệ thống (10%) sau khi trừ 50% phí voucher cho đơn hàng #${subOrder.id.slice(0, 8)}`,
              },
            });
          }
        }

        if (!isAdminSeller) {
          // Add Net to Regular Seller Escrow
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
              description: `Tiền về ví chờ đối soát cho đơn hàng #${subOrder.id.slice(0, 8)} (Đã trừ 10% phí sàn và 50% phí voucher)`,
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
