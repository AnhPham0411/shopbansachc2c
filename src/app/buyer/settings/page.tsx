"use client";

import { Navbar } from "@/components/layout/Navbar";
import AddressManagement from "@/components/profile/AddressManagement";
import { motion } from "framer-motion";

export default function BuyerSettingsPage() {
  return (
    <main className="min-h-screen bg-[#F6F7F9] text-zinc-900 pb-20">
      <Navbar />
      
      <div className="container mx-auto px-6 md:px-12 pt-44 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl font-black">Cài đặt tài khoản</h1>
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-0.5">Quản lý thông tin của bạn</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <AddressManagement />
        </motion.div>
      </div>
    </main>
  );
}
