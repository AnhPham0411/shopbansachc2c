"use server";


import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { sendOTPByEmail } from "./mail";

export async function requestPasswordReset(email: string) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { success: false, error: "Email không tồn tại trong hệ thống" };
    }

    // Generate a 6-digit OTP
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 3600000); // 1 hour expiry

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: token,
        resetTokenExpiry: expiry,
      },
    });

    // Send real email via Gmail
    await sendOTPByEmail(email, token);
    console.log(`[AUTH] Sent Reset Token via Gmail for ${email}`);
    
    return { 
      success: true, 
      message: `Mã OTP đã được gửi đến email ${email}. Vui lòng kiểm tra hộp thư.`,
    };
  } catch (error) {
    console.error("Error requesting password reset:", error);
    return { success: false, error: "Đã có lỗi xảy ra khi tạo mã khôi phục" };
  }
}

export async function resetPassword(token: string, password: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { resetToken: token },
    });

    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      return { success: false, error: "Mã khôi phục không hợp lệ hoặc đã hết hạn" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return { success: true, message: "Mật khẩu đã được cập nhật thành công" };
  } catch (error) {
    console.error("Error resetting password:", error);
    return { success: false, error: "Đã có lỗi xảy ra khi đặt lại mật khẩu" };
  }
}
