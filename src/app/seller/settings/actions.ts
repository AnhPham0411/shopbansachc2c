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

export async function requestVerification(formData: FormData) {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  const userId = (session.user as any).id;
  const docs = formData.get("verificationDocs") as string;

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        verificationDocs: docs,
        isVerified: false, // Reset status if they re-upload? Or keep pending
      },
    });

    revalidatePath("/seller/settings");
    return { success: true, message: "Yêu cầu xác thực đã được gửi. Admin sẽ kiểm duyệt trong vòng 24-48h." };
  } catch (error) {
    return { success: false, error: "Lỗi khi gửi yêu cầu xác thực" };
  }
}

export async function getReferralStats() {
  const session = await auth();
  if (!session?.user) return null;

  const userId = (session.user as any).id;
  
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { referralCode: true, points: true },
  });

  // If no referral code, generate one
  if (user && !user.referralCode) {
    const newCode = `REF-${userId.slice(0, 8).toUpperCase()}`;
    await prisma.user.update({
      where: { id: userId },
      data: { referralCode: newCode },
    });
    return { referralCode: newCode, points: user.points };
  }

  return user;
}
