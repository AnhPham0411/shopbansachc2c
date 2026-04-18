"use client";

import { useState } from "react";
import { Plus, X, Tag, BookText, Hash, Info, Layers, Edit2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createBookAdmin, updateBookAdmin } from "./actions";

interface AdminBookFormProps {
  book?: any; // If provided, we are in edit mode
  mode?: "create" | "edit";
}

export function AdminBookForm({ book, mode = "create" }: AdminBookFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      let res;
      if (mode === "edit" && book) {
        res = await updateBookAdmin(book.id, formData);
      } else {
        res = await createBookAdmin(formData);
      }

      if (res.success) {
        setIsOpen(false);
        router.refresh();
      } else {
        alert(res.error || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error(error);
      alert("Đã có lỗi kết nối");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {mode === "create" ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-6 py-3.5 bg-primary text-white font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          Thêm sách mới
        </button>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 hover:bg-white rounded-xl transition-all text-zinc-400 hover:text-primary shadow-sm hover:shadow-md"
          title="Sửa sách"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      )}

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
              className="relative w-full max-w-2xl bg-white p-10 rounded-[40px] overflow-hidden shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-3xl font-black text-zinc-900 tracking-tight">
                    {mode === "edit" ? "Cập nhật thông tin sách" : "Đăng sách lên sàn"}
                  </h3>
                  <p className="text-zinc-500 font-medium">Libris Admin Control Center</p>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  disabled={loading}
                  className="p-3 hover:bg-zinc-100 rounded-2xl transition-all text-zinc-400"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-4">Tên sách</label>
                  <div className="relative">
                    <BookText className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <input
                      name="title"
                      type="text"
                      required
                      defaultValue={book?.title}
                      placeholder="Ví dụ: Đắc Nhân Tâm"
                      className="w-full bg-zinc-50 border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-bold focus:ring-2 ring-primary/20 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-4">Tác giả</label>
                    <input
                      name="author"
                      type="text"
                      defaultValue={book?.author}
                      placeholder="Nguyễn Nhật Ánh"
                      className="w-full bg-zinc-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 ring-primary/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-4">Link ảnh bìa</label>
                    <div className="relative">
                      <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                      <input
                        name="imageUrl"
                        type="text"
                        defaultValue={book?.imageUrl}
                        placeholder="https://images..."
                        className="w-full bg-zinc-50 border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-bold focus:ring-2 ring-primary/20 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-4">Mô tả chi tiết</label>
                  <textarea
                    name="description"
                    rows={3}
                    defaultValue={book?.description}
                    placeholder="Tóm tắt nội dung, tình trạng sách..."
                    className="w-full bg-zinc-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 ring-primary/20 transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-4">Giá bán (VNĐ)</label>
                    <div className="relative">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                      <input
                        name="price"
                        type="number"
                        required
                        defaultValue={book?.price ? Number(book.price) : ""}
                        placeholder="50000"
                        className="w-full bg-zinc-50 border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-bold focus:ring-2 ring-primary/20 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-4">Số lượng tồn kho</label>
                    <div className="relative">
                      <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                      <input
                        name="stockQuantity"
                        type="number"
                        required
                        min="0"
                        defaultValue={book?.stockQuantity || "1"}
                        className="w-full bg-zinc-50 border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-bold focus:ring-2 ring-primary/20 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-4">Tình trạng sách</label>
                    <select
                      name="condition"
                      required
                      defaultValue={book?.condition || "NEW_100"}
                      className="w-full bg-zinc-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 ring-primary/20 transition-all appearance-none"
                    >
                      <option value="NEW_100">Mới 100%</option>
                      <option value="LIKE_NEW">Like New (99%)</option>
                      <option value="GOOD">Khá (80-90%)</option>
                      <option value="OLD">Cũ</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-4">Danh mục</label>
                    <select
                      name="category"
                      required
                      defaultValue={book?.category || "OTHERS"}
                      className="w-full bg-zinc-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 ring-primary/20 transition-all appearance-none"
                    >
                      <option value="LITERATURE">Văn học</option>
                      <option value="CHILDRENS">Thiếu nhi</option>
                      <option value="COMICS">Truyện tranh</option>
                      <option value="TEXTBOOK">Sách giáo khoa</option>
                      <option value="ECONOMY">Kinh tế</option>
                      <option value="SKILLS">Kỹ năng sống</option>
                      <option value="OTHERS">Khác</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 py-4 rounded-2xl font-black text-sm text-zinc-400 hover:bg-zinc-50 transition-all"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-[2] bg-primary text-white font-black py-4 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                  >
                    {loading ? "Đang lưu..." : (mode === "edit" ? "Cập nhật ngay" : "Đăng sách ngay")}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
