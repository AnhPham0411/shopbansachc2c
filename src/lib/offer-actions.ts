"use server";

import { prisma } from "./prisma";
import { OfferStatus } from "@prisma/client";
import { createNotification } from "./notification-actions";
import { revalidatePath } from "next/cache";

export async function createOffer({
  buyerId,
  sellerId,
  bookId,
  amount,
  message,
}: {
  buyerId: string;
  sellerId: string;
  bookId: string;
  amount: number;
  message?: string;
}) {
  try {
    const offer = await prisma.offer.create({
      data: {
        buyerId,
        sellerId,
        bookId,
        amount,
        message,
        status: "PENDING",
      },
      include: {
        buyer: { select: { name: true } },
        book: { select: { title: true } },
      },
    });

    // Notify Seller
    await createNotification({
      userId: sellerId,
      title: "Lời đề nghị mới",
      message: `${offer.buyer.name} đã đề nghị mua "${offer.book.title}" với giá ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)}`,
      type: "OFFER",
      link: `/seller/offers/${offer.id}`,
    });

    return { success: true, offer };
  } catch (error) {
    console.error("Error creating offer:", error);
    return { success: false, error: "Failed to create offer" };
  }
}

export async function respondToOffer(offerId: string, status: "ACCEPTED" | "REJECTED") {
  try {
    const offer = await prisma.offer.update({
      where: { id: offerId },
      data: { status },
      include: {
        seller: { select: { name: true } },
        book: { select: { title: true } },
      },
    });

    // Notify Buyer
    await createNotification({
      userId: offer.buyerId,
      title: status === "ACCEPTED" ? "Lời đề nghị được chấp nhận" : "Lời đề nghị bị từ chối",
      message: `Người bán ${offer.seller.name} đã ${status === "ACCEPTED" ? "chấp nhận" : "từ chối"} lời đề nghị của bạn cho "${offer.book.title}".`,
      type: "OFFER",
      link: status === "ACCEPTED" ? `/books/${offer.bookId}` : undefined,
    });

    revalidatePath("/seller/offers");

    return { success: true, offer };
  } catch (error) {
    console.error("Error responding to offer:", error);
    return { success: false, error: "Failed to respond to offer" };
  }
}

export async function getBuyerOffers(buyerId: string) {
  return await prisma.offer.findMany({
    where: { buyerId },
    include: {
      book: true,
      seller: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getSellerOffers(sellerId: string) {
  return await prisma.offer.findMany({
    where: { sellerId },
    include: {
      book: true,
      buyer: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}
