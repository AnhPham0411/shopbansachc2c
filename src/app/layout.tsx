import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Libris | Sàn Mua Bán Sách C2C Cao Cấp",
  description: "Nền tảng giao dịch sách cũ/mới an toàn với hệ thống thanh toán trung gian Escrow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${inter.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col font-sans">
        <SessionProvider>
          <Toaster position="bottom-right" />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
