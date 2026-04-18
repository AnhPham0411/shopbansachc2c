"use server";

import { prisma } from "@/lib/prisma";
import { DiscountType } from "@prisma/client";

export async function validateVoucher(code: string, userId: string, orderAmount: number) {
  try {
    const voucher = await prisma.voucher.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!voucher) {
      return { success: false, error: "Mã giảm giá không tồn tại" };
    }

    if (!voucher.isActive) {
      return { success: false, error: "Mã giảm giá không còn hoạt động" };
    }

    if (voucher.expiryDate && new Date(voucher.expiryDate) < new Date()) {
      return { success: false, error: "Mã giảm giá đã hết hạn" };
    }

    if (voucher.usedCount >= voucher.usageLimit) {
      return { success: false, error: "Mã giảm giá đã hết lượt sử dụng" };
    }

    if (orderAmount < Number(voucher.minOrderAmount)) {
      return { 
        success: false, 
        error: `Đơn hàng tối thiểu ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(voucher.minOrderAmount))} để sử dụng mã này` 
      };
    }

    // Calculate discount
    let discount = 0;
    if (voucher.discountType === DiscountType.PERCENTAGE) {
      discount = orderAmount * (Number(voucher.discountValue) / 100);
      if (voucher.maxDiscount && discount > Number(voucher.maxDiscount)) {
        discount = Number(voucher.maxDiscount);
      }
    } else {
      discount = Number(voucher.discountValue);
    }

    return {
      success: true,
      voucherId: voucher.id,
      code: voucher.code,
      discountAmount: discount,
      description: voucher.description,
    };
  } catch (error: any) {
    return { success: false, error: "Đã có lỗi xảy ra khi kiểm tra mã giảm giá" };
  }
}

export async function getActiveVouchers() {
  try {
    const vouchers = await prisma.voucher.findMany({
      where: {
        isActive: true,
        OR: [
          { expiryDate: null },
          { expiryDate: { gte: new Date() } }
        ]
      },
      orderBy: { createdAt: "desc" }
    });
    
    // Convert Decimal to numbers for frontend if necessary, 
    // although Prisma client might handle basic serialization in server actions.
    return { success: true, vouchers: vouchers.map(v => ({
      ...v,
      discountValue: Number(v.discountValue),
      minOrderAmount: Number(v.minOrderAmount),
      maxDiscount: v.maxDiscount ? Number(v.maxDiscount) : null
    })) };
  } catch (error) {
    console.error("Error fetching vouchers:", error);
    return { success: false, vouchers: [] };
  }
}

export async function getAllVouchers() {
  try {
    const vouchers = await prisma.voucher.findMany({
      orderBy: { createdAt: "desc" }
    });
    return { 
      success: true, 
      vouchers: vouchers.map(v => ({
        ...v,
        discountValue: Number(v.discountValue),
        minOrderAmount: Number(v.minOrderAmount),
        maxDiscount: v.maxDiscount ? Number(v.maxDiscount) : null
      })) 
    };
  } catch (error) {
    console.error("Error fetching all vouchers:", error);
    return { success: false, vouchers: [] };
  }
}

export async function createVoucher(data: any) {
  try {
    const voucher = await prisma.voucher.create({
      data: {
        code: data.code.toUpperCase(),
        description: data.description,
        discountType: data.discountType,
        discountValue: data.discountValue,
        minOrderAmount: data.minOrderAmount || 0,
        maxDiscount: data.maxDiscount || null,
        usageLimit: data.usageLimit || 100,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
      }
    });
    return { success: true, voucher };
  } catch (error: any) {
    console.error("Error creating voucher:", error);
    return { success: false, error: error.message || "Không thể tạo mã giảm giá" };
  }
}

export async function toggleVoucherStatus(id: string, isActive: boolean) {
  try {
    await prisma.voucher.update({
      where: { id },
      data: { isActive }
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: "Không thể cập nhật trạng thái" };
  }
}

export async function deleteVoucher(id: string) {
  try {
    await prisma.voucher.delete({
      where: { id }
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: "Không thể xóa mã giảm giá" };
  }
}

