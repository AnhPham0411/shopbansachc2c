"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  const userId = (session.user as any).id;
  const name = formData.get("name") as string;
  const phoneNumber = formData.get("phoneNumber") as string;
  const address = formData.get("address") as string;
  const bankAccountInfo = formData.get("bankAccountInfo") as string;

  if (!name) {
    return { success: false, error: "Tên không được để trống" };
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        phoneNumber,
        address,
        bankAccountInfo,
      },
    });

    revalidatePath("/seller/settings");
    revalidatePath("/seller/books");
    revalidatePath("/seller");
    revalidatePath("/books");
    revalidatePath("/");

    return { success: true };
  } catch (error: any) {
    console.error("Profile update error:", error);
    return { success: false, error: "Đã có lỗi xảy ra khi cập nhật hồ sơ" };
  }
}
