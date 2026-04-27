"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function toggleFavorite(bookId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Bạn cần đăng nhập để thực hiện tính năng này");

    const userId = session.user.id;

    const existing = await prisma.favorite.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
    });

    if (existing) {
      await prisma.favorite.delete({
        where: { id: existing.id },
      });
    } else {
      await prisma.favorite.create({
        data: {
          userId,
          bookId,
        },
      });
    }

    revalidatePath(`/books/${bookId}`);
    revalidatePath("/buyer/favorites");
    return { success: true, isFavorite: !existing };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getFavorites() {
  try {
    const session = await auth();
    if (!session?.user?.id) return [];

    const favorites = await prisma.favorite.findMany({
      where: { userId: session.user.id },
      include: {
        book: {
          include: {
            seller: {
              select: { name: true }
            }
          }
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return favorites.map(f => ({
      ...f.book,
      price: Number(f.book.price)
    }));
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return [];
  }
}

export async function isBookFavorite(bookId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return false;

    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_bookId: {
          userId: session.user.id,
          bookId,
        },
      },
    });

    return !!favorite;
  } catch (error) {
    return false;
  }
}
