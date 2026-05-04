import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export const sendOTPByEmail = async (email: string, otp: string) => {
  const mailOptions = {
    from: `"Libris Bookstore" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Mã OTP Khôi phục mật khẩu - Libris Bookstore",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #0056b3; text-align: center;">Khôi phục mật khẩu</h2>
        <p>Chào bạn,</p>
        <p>Bạn vừa yêu cầu khôi phục mật khẩu tại Libris Bookstore. Dưới đây là mã OTP của bạn:</p>
        <div style="background-color: #f5f9f9; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <h1 style="color: #333; letter-spacing: 5px; margin: 0;">${otp}</h1>
        </div>
        <p>Mã này sẽ hết hạn trong vòng 1 giờ.</p>
        <p>Nếu bạn không yêu cầu đổi mật khẩu, vui lòng bỏ qua email này.</p>
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #888; text-align: center;">Libris Bookstore - Hệ thống trao đổi sách C2C</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
