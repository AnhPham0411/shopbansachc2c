"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { BookCondition } from "@prisma/client";

export async function createBook(formData: FormData) {
  const session = await auth();
  if (!session || ((session.user as any).role !== "USER" && (session.user as any).role !== "ADMIN")) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const author = formData.get("author") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const stockQuantity = parseInt(formData.get("stockQuantity") as string);
  const isbn = formData.get("isbn") as string;

  if (isNaN(price) || price < 0) throw new Error("Giá không hợp lệ");
  if (isNaN(stockQuantity) || stockQuantity < 0) throw new Error("Số lượng không hợp lệ");
  const condition = formData.get("condition") as BookCondition;
  const category = formData.get("category") as any;
  const imageUrl = formData.get("imageUrl") as string;

  const book = await prisma.book.create({
    data: {
      title,
      author,
      description,
      price,
      stockQuantity,
      condition,
      category: category || "OTHERS",
      imageUrl,
      isbn,
      sellerId: (session.user as any).id,
    },
  });

  // Record Initial Price History
  await prisma.priceHistory.create({
    data: {
      bookId: book.id,
      price: price,
    }
  });

  revalidatePath("/seller/books");
  revalidatePath("/books");
  revalidatePath("/");
}

export async function deleteBook(id: string) {
  const session = await auth();
  if (!session || ((session.user as any).role !== "USER" && (session.user as any).role !== "ADMIN")) {
    throw new Error("Unauthorized");
  }

  await prisma.book.delete({
    where: { 
      id,
      sellerId: (session.user as any).id // Security check
    },
  });

  revalidatePath("/seller/books");
  revalidatePath("/books");
  revalidatePath("/");
}

export async function updateBook(id: string, formData: FormData) {
  const session = await auth();
  if (!session || ((session.user as any).role !== "USER" && (session.user as any).role !== "ADMIN")) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const author = formData.get("author") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const stockQuantity = parseInt(formData.get("stockQuantity") as string);
  const condition = formData.get("condition") as BookCondition;
  const category = formData.get("category") as any;
  const imageUrl = formData.get("imageUrl") as string;
  const isbn = formData.get("isbn") as string;

  if (isNaN(price) || price < 0) throw new Error("Giá không hợp lệ");
  if (isNaN(stockQuantity) || stockQuantity < 0) throw new Error("Số lượng không hợp lệ");

  const oldBook = await prisma.book.findUnique({
    where: { id },
    select: { price: true }
  });

  await prisma.book.update({
    where: { 
      id,
      sellerId: (session.user as any).id // Security check
    },
    data: {
      title,
      author,
      description,
      price,
      stockQuantity,
      condition,
      category: category || "OTHERS",
      imageUrl,
      isbn,
    },
  });

  // Record Price History if price changed
  if (oldBook && Number(oldBook.price) !== price) {
    await prisma.priceHistory.create({
      data: {
        bookId: id,
        price: price,
      }
    });
  }

  revalidatePath("/seller/books");
  revalidatePath("/books");
  revalidatePath("/");
}
