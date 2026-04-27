"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

/**
 * Đăng đánh giá cho sách sau khi nhận hàng thành công
 */
export async function postReview(subOrderId: string, rating: number, comment: string) {
  try {
    return await prisma.$transaction(async (tx) => {
      // 1. Kiểm tra đơn hàng có status COMPLETED chưa
      const subOrder = await tx.subOrder.findUnique({
        where: { id: subOrderId },
        include: { orderItems: true }
      });

      if (!subOrder || subOrder.status !== "COMPLETED") {
        throw new Error("Chỉ có thể đánh giá sau khi đã nhận hàng thành công.");
      }

      // 2. Chặn đánh giá trùng
      const existing = await tx.review.findUnique({
        where: { subOrderId }
      });
      if (existing) throw new Error("Bạn đã đánh giá đơn hàng này rồi.");

      // 3. Tạo đánh giá (Gắn vào sách đầu tiên trong đơn hàng cho bản demo)
      const bookId = subOrder.orderItems[0].bookId;

      await tx.review.create({
        data: {
          subOrderId,
          bookId,
          rating,
          comment
        }
      });

      revalidatePath(`/books/${bookId}`);
      revalidatePath("/buyer/orders");
      return { success: true };
    });
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Admin xóa đánh giá (Moderation)
 */
export async function deleteReview(reviewId: string) {
  try {
    const review = await prisma.review.delete({
      where: { id: reviewId }
    });
    revalidatePath(`/books/${review.bookId}`);
    revalidatePath("/admin/reviews");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Phản hồi đánh giá (Người bán hoặc Admin)
 */
export async function replyToReview(reviewId: string, content: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Chưa đăng nhập");

    const userId = session.user.id;
    const role = (session.user as any).role;

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: { 
        book: {
          select: { id: true, sellerId: true }
        }
      }
    });

    if (!review) throw new Error("Đánh giá không tồn tại");

    if (role !== "ADMIN" && review.book.sellerId !== userId) {
      throw new Error("Bạn không có quyền phản hồi đánh giá này");
    }

    await prisma.reviewReply.create({
      data: {
        reviewId,
        userId,
        content,
      }
    });

    revalidatePath(`/books/${review.book.id}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
