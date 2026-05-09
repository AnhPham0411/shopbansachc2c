"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAddresses() {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized", data: [] };
  }

  const userId = session.user.id;

  try {
    const addresses = await prisma.userAddress.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: addresses };
  } catch (error) {
    return { success: false, error: "Lỗi khi lấy danh sách địa chỉ", data: [] };
  }
}

export async function createAddress(data: {
  title?: string;
  name: string;
  phone: string;
  address: string;
  isDefault?: boolean;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const userId = session.user.id;

  try {
    // If this is the first address, make it default
    const count = await prisma.userAddress.count({ where: { userId } });
    const isDefault = count === 0 ? true : data.isDefault;

    // If setting as default, unset other defaults
    if (isDefault) {
      await prisma.userAddress.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const newAddress = await prisma.userAddress.create({
      data: {
        userId,
        title: data.title,
        name: data.name,
        phone: data.phone,
        address: data.address,
        isDefault: isDefault || false,
      },
    });

    revalidatePath("/seller/settings");
    return { success: true, data: newAddress };
  } catch (error) {
    return { success: false, error: "Lỗi khi tạo địa chỉ" };
  }
}

export async function updateAddress(id: string, data: {
  title?: string;
  name: string;
  phone: string;
  address: string;
  isDefault?: boolean;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const userId = session.user.id;

  try {
    // If setting as default, unset other defaults
    if (data.isDefault) {
      await prisma.userAddress.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const updatedAddress = await prisma.userAddress.update({
      where: { id, userId }, // Ensure user owns the address
      data: {
        title: data.title,
        name: data.name,
        phone: data.phone,
        address: data.address,
        isDefault: data.isDefault,
      },
    });

    revalidatePath("/seller/settings");
    return { success: true, data: updatedAddress };
  } catch (error) {
    return { success: false, error: "Lỗi khi cập nhật địa chỉ" };
  }
}

export async function deleteAddress(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const userId = session.user.id;

  try {
    const address = await prisma.userAddress.findUnique({
      where: { id, userId },
    });

    if (!address) {
      return { success: false, error: "Không tìm thấy địa chỉ" };
    }

    await prisma.userAddress.delete({
      where: { id },
    });

    // If we deleted the default address, set another one as default if available
    if (address.isDefault) {
      const nextAddress = await prisma.userAddress.findFirst({
        where: { userId },
      });
      if (nextAddress) {
        await prisma.userAddress.update({
          where: { id: nextAddress.id },
          data: { isDefault: true },
        });
      }
    }

    revalidatePath("/seller/settings");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Lỗi khi xóa địa chỉ" };
  }
}

export async function setDefaultAddress(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const userId = session.user.id;

  try {
    await prisma.userAddress.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });

    await prisma.userAddress.update({
      where: { id, userId },
      data: { isDefault: true },
    });

    revalidatePath("/seller/settings");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Lỗi khi đặt địa chỉ mặc định" };
  }
}
