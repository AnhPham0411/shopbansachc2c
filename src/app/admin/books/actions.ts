"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { BookCondition } from "@prisma/client";

async function checkAdmin() {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function createBookAdmin(formData: FormData) {
  try {
    const session = await checkAdmin();

    const title = formData.get("title") as string;
    const author = formData.get("author") as string;
    const description = formData.get("description") as string;
    const priceStr = formData.get("price") as string;
    const stockStr = formData.get("stockQuantity") as string;
    const condition = formData.get("condition") as BookCondition;
    const category = formData.get("category") as any;
    const imageUrl = formData.get("imageUrl") as string;

    if (!title || !priceStr) {
      return { success: false, error: "Tiêu đề và giá là bắt buộc" };
    }

    const price = parseFloat(priceStr);
    const stockQuantity = parseInt(stockStr);

    if (isNaN(price)) return { success: false, error: "Giá không hợp lệ" };
    if (isNaN(stockQuantity)) return { success: false, error: "Số lượng không hợp lệ" };
    if (stockQuantity < 0) return { success: false, error: "Số lượng không được nhỏ hơn 0" };

    await prisma.book.create({
      data: {
        title,
        author,
        description,
        price,
        stockQuantity,
        condition,
        category: category || "OTHERS",
        imageUrl,
        sellerId: (session.user as any).id,
      },
    });

    revalidatePath("/admin/books");
    revalidatePath("/books");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Admin Create Book Error:", error);
    return { success: false, error: String(error.message || "Không thể tạo sách") };
  }
}

export async function updateBookAdmin(id: string, formData: FormData) {
  try {
    await checkAdmin();

    const title = formData.get("title") as string;
    const author = formData.get("author") as string;
    const description = formData.get("description") as string;
    const priceStr = formData.get("price") as string;
    const stockStr = formData.get("stockQuantity") as string;
    const condition = formData.get("condition") as BookCondition;
    const category = formData.get("category") as any;
    const imageUrl = formData.get("imageUrl") as string;

    if (!title) return { success: false, error: "Tiêu đề không được để trống" };
    
    const price = parseFloat(priceStr);
    const stockQuantity = parseInt(stockStr);

    if (isNaN(price)) return { success: false, error: "Giá không hợp lệ" };
    if (isNaN(stockQuantity)) return { success: false, error: "Số lượng không hợp lệ" };
    if (stockQuantity < 0) return { success: false, error: "Số lượng không được nhỏ hơn 0" };

    await prisma.book.update({
      where: { id },
      data: {
        title,
        author,
        description,
        price,
        stockQuantity,
        condition,
        category: (category as any) || "OTHERS",
        imageUrl,
      },
    });

    revalidatePath("/admin/books");
    revalidatePath("/books");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Admin Update Book Error:", error);
    return { success: false, error: String(error.message || "Không thể cập nhật sách") };
  }
}

export async function deleteBookAdmin(id: string) {
  try {
    await checkAdmin();

    await prisma.book.delete({
      where: { id },
    });

    revalidatePath("/admin/books");
    revalidatePath("/books");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Admin Delete Book Error:", error);
    return { success: false, error: "Không thể xóa sách" };
  }
}

