"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

function toSlug(str: string) {
  str = str.toLowerCase();
  str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Remove accents
  str = str.replace(/[đĐ]/g, 'd');
  str = str.replace(/([^0-9a-z-\s])/g, ''); // Remove special chars
  str = str.replace(/(\s+)/g, '-'); // Replace space with -
  str = str.replace(/-+/g, '-'); // Remove duplicate -
  str = str.replace(/^-+|-+$/g, ''); // Remove starting/ending -
  return str;
}

export async function createCategory(formData: FormData) {
  const name = formData.get("name") as string;
  if (!name) {
    return { error: "Tên danh mục không được để trống" };
  }

  const slug = toSlug(name);

  try {
    await prisma.category.create({
      data: {
        name,
        slug,
      },
    });
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { error: "Tên danh mục hoặc slug đã tồn tại" };
    }
    return { error: error.message || "Có lỗi xảy ra" };
  }
}

export async function deleteCategory(id: string) {
  try {
    await prisma.category.delete({
      where: { id },
    });
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Có lỗi xảy ra" };
  }
}

export async function deleteCategoryForm(formData: FormData) {
  const id = formData.get("id") as string;
  return deleteCategory(id);
}

export async function seedCategories() {
  const defaults = [
    { name: "Văn học", slug: "LITERATURE" },
    { name: "Thiếu nhi", slug: "CHILDRENS" },
    { name: "Truyện tranh", slug: "COMICS" },
    { name: "Sách giáo khoa", slug: "TEXTBOOK" },
    { name: "Kinh tế", slug: "ECONOMY" },
    { name: "Kỹ năng sống", slug: "SKILLS" },
    { name: "Khác", slug: "OTHERS" },
  ];

  for (const cat of defaults) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  revalidatePath("/admin/categories");
  return { success: true };
}
