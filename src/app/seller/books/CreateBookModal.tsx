"use client";

import { useState } from "react";
import { Plus, X, Tag, BookText, Hash, Info, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createBook } from "./actions";

export function CreateBookModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await createBook(formData);
      setIsOpen(false);
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-2xl hover:bg-zinc-200 transition-all hover-glow"
      >
        <Plus className="w-5 h-5" />
        Thêm sách mới
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !loading && setIsOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg glass p-8 rounded-[32px] overflow-hidden"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold">Đăng sách lên sàn</h3>
                <button 
                  onClick={() => setIsOpen(false)}
                  disabled={loading}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-500"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <BookText className="w-3.5 h-3.5" />
                    Tên sách
                  </label>
                  <input
                    name="title"
                    type="text"
                    required
                    placeholder="Ví dụ: Đắc Nhân Tâm"
                    className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                      <BookText className="w-3.5 h-3.5" />
                      Tác giả
                    </label>
                    <input
                      name="author"
                      type="text"
                      placeholder="Nguyễn Nhật Ánh"
                      className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5" />
                      Link ảnh bìa
                    </label>
                    <input
                      name="imageUrl"
                      type="text"
                      placeholder="https://images..."
                      className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <Info className="w-3.5 h-3.5" />
                    Mô tả sách
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    placeholder="Tóm tắt nội dung, tình trạng chi tiết..."
                    className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 focus:outline-none focus:border-primary/50 transition-colors resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5" />
                      Giá bán (VNĐ)
                    </label>
                    <input
                      name="price"
                      type="number"
                      required
                      placeholder="50000"
                      className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                      <Hash className="w-3.5 h-3.5" />
                      Số lượng
                    </label>
                    <input
                      name="stockQuantity"
                      type="number"
                      defaultValue="1"
                      min="0"
                      required
                      className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                      <Info className="w-3.5 h-3.5" />
                      Tình trạng
                    </label>
                    <select
                      name="condition"
                      required
                      className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 focus:outline-none focus:border-primary/50 transition-colors appearance-none"
                    >
                      <option value="NEW_100" className="bg-[#0f172a]">Mới 100%</option>
                      <option value="LIKE_NEW" className="bg-[#0f172a]">Like New (99%)</option>
                      <option value="GOOD" className="bg-[#0f172a]">Khá (80-90%)</option>
                      <option value="OLD" className="bg-[#0f172a]">Cũ</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5" />
                      Danh mục
                    </label>
                    <select
                      name="category"
                      required
                      defaultValue="OTHERS"
                      className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 focus:outline-none focus:border-primary/50 transition-colors appearance-none"
                    >
                      <option value="LITERATURE" className="bg-[#0f172a]">Văn học</option>
                      <option value="CHILDRENS" className="bg-[#0f172a]">Thiếu nhi</option>
                      <option value="COMICS" className="bg-[#0f172a]">Truyện tranh</option>
                      <option value="TEXTBOOK" className="bg-[#0f172a]">Sách giáo khoa</option>
                      <option value="ECONOMY" className="bg-[#0f172a]">Kinh tế</option>
                      <option value="SKILLS" className="bg-[#0f172a]">Kỹ năng sống</option>
                      <option value="OTHERS" className="bg-[#0f172a]">Khác</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all hover-glow disabled:opacity-50 mt-4"
                >
                  {loading ? "Đang xử lý..." : "Hoàn tất đăng sách"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
