"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function savePrivateNote(bookId: string, content: string) {
  const session = await auth();
  const userId = (session?.user as any)?.id;

  if (!userId) {
    throw new Error("Bạn cần đăng nhập để lưu ghi chú");
  }

  if (!content.trim()) {
    // Delete note if empty
    await prisma.privateNote.deleteMany({
      where: { userId, bookId }
    });
  } else {
    // Create or update note
    await prisma.privateNote.upsert({
      where: {
        userId_bookId: { userId, bookId }
      },
      update: { content },
      create: { userId, bookId, content }
    });
  }

  revalidatePath(`/books/${bookId}`);
  return { success: true };
}

export async function getPrivateNote(bookId: string) {
  const session = await auth();
  const userId = (session?.user as any)?.id;

  if (!userId) return null;

  const note = await prisma.privateNote.findUnique({
    where: {
      userId_bookId: { userId, bookId }
    }
  });

  return note?.content || "";
}
