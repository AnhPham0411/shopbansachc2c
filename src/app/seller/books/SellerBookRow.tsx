"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Edit2, ShoppingBag, X, Check, BookText, Tag, Hash, Info, Layers, User } from "lucide-react";
import Image from "next/image";
import { deleteBook, updateBook } from "./actions";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export function SellerBookRow({ 
  book, 
  sellerName, 
  sellerEmail,
  availableVouchers = []
}: { 
  book: any, 
  sellerName: string, 
  sellerEmail: string,
  availableVouchers?: any[]
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await updateBook(book.id, formData);
      setIsEditing(false);
      toast.success("Cập nhật thành công!", {
        style: { borderRadius: '16px', background: '#333', color: '#fff' }
      });
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async () => {
    if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;
    try {
      await deleteBook(book.id);
      toast.success("Đã xóa sản phẩm");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Không thể xóa sản phẩm");
    }
  };

  return (
    <>
      <tr className={`hover:bg-zinc-50 transition-colors group ${isEditing ? 'bg-primary/5' : ''}`}>
        <td className="px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-16 relative rounded-lg overflow-hidden bg-zinc-50 flex-shrink-0 shadow-sm border border-zinc-100 flex items-center justify-center">
              {book.imageUrl ? (
                <img 
                  src={`/api/proxy-image?url=${encodeURIComponent(book.imageUrl)}`} 
                  alt={book.title} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-200">
                  <ShoppingBag size={24} />
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-900 group-hover:text-primary transition-colors line-clamp-1">{book.title}</p>
              <p className="text-[10px] font-medium text-zinc-400 mt-1">{book.author || "Không rõ tác giả"}</p>
            </div>
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary">
              {sellerName.charAt(0)}
            </div>
            <div className="text-xs">
               <p className="font-bold text-zinc-700 leading-none">{sellerName}</p>
               <p className="text-[10px] text-zinc-400 mt-1">{sellerEmail}</p>
            </div>
          </div>
        </td>
        <td className="px-6 py-4">
          <p className="text-sm font-black text-zinc-900">{new Intl.NumberFormat('vi-VN').format(Number(book.price))} đ</p>
          <p className={`text-[10px] font-bold mt-1 ${book.stockQuantity === 0 ? 'text-red-500' : 'text-zinc-400'}`}>
            Tồn kho: {book.stockQuantity}
          </p>
        </td>
        <td className="px-6 py-4">
           <span className="px-3 py-1 bg-zinc-100 rounded-full text-[10px] font-black uppercase text-zinc-500 border border-zinc-200">
             {book.category}
           </span>
        </td>
        <td className="px-6 py-4 text-right">
          <div className="flex items-center justify-end gap-2">
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className={`p-2.5 rounded-xl transition-all shadow-sm ${isEditing ? 'bg-primary text-white' : 'bg-white text-zinc-400 hover:text-primary border border-zinc-100'}`}
            >
              {isEditing ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
            </button>
            <button 
              onClick={handleDelete}
              className="p-2.5 bg-white text-zinc-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all shadow-sm border border-zinc-100"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>

      {/* Expanded Inline Form */}
      <AnimatePresence>
        {isEditing && (
          <motion.tr
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <td colSpan={5} className="p-0 border-none">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                className="overflow-hidden bg-zinc-50/50"
              >
                <form onSubmit={handleSave} className="p-8 border-b border-primary/10">
                  <div className="bg-white p-8 rounded-[40px] shadow-sm border border-zinc-100 space-y-8">
                    <div className="flex items-center justify-between">
                       <h4 className="text-lg font-black text-zinc-900 flex items-center gap-2">
                         <Edit2 className="w-5 h-5 text-primary" />
                         Chỉnh sửa chi tiết sản phẩm
                       </h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                       <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-4">Tên sách</label>
                         <div className="relative">
                           <BookText className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                           <input name="title" required defaultValue={book.title} className="w-full bg-zinc-50 border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-bold focus:ring-2 ring-primary/20 transition-all outline-none" />
                         </div>
                       </div>
                       
                       <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-4">Tác giả</label>
                         <input name="author" defaultValue={book.author} className="w-full bg-zinc-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 ring-primary/20 transition-all outline-none" />
                       </div>

                       <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-4">Link ảnh bìa</label>
                         <div className="relative">
                           <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                           <input name="imageUrl" defaultValue={book.imageUrl} className="w-full bg-zinc-50 border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-bold focus:ring-2 ring-primary/20 transition-all outline-none" />
                         </div>
                       </div>

                       <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-4">Giá bán (VNĐ)</label>
                         <div className="relative">
                           <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                           <input name="price" type="number" required min="0" defaultValue={Number(book.price)} className="w-full bg-zinc-50 border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-bold focus:ring-2 ring-primary/20 transition-all outline-none" />
                         </div>
                       </div>

                       <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-4">Số lượng</label>
                         <div className="relative">
                           <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                           <input name="stockQuantity" type="number" required min="0" defaultValue={book.stockQuantity} className="w-full bg-zinc-50 border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-bold focus:ring-2 ring-primary/20 transition-all outline-none" />
                         </div>
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-4">Tình trạng</label>
                           <select name="condition" defaultValue={book.condition} className="w-full bg-zinc-50 border-none rounded-2xl py-4 px-6 text-sm font-bold appearance-none outline-none">
                             <option value="NEW_100">Mới</option>
                             <option value="LIKE_NEW">99%</option>
                             <option value="GOOD">Tốt</option>
                             <option value="OLD">Cũ</option>
                           </select>
                         </div>
                         <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-4">Danh mục</label>
                           <select name="category" defaultValue={book.category} className="w-full bg-zinc-50 border-none rounded-2xl py-4 px-6 text-sm font-bold appearance-none outline-none">
                             <option value="LITERATURE">Văn học</option>
                             <option value="CHILDRENS">Thiếu nhi</option>
                             <option value="COMICS">Truyện tranh</option>
                             <option value="TEXTBOOK">Sách GK</option>
                             <option value="ECONOMY">Kinh tế</option>
                             <option value="SKILLS">Kỹ năng</option>
                             <option value="OTHERS">Khác</option>
                           </select>
                         </div>
                       </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-4">Mô tả chi tiết</label>
                        <textarea name="description" rows={2} defaultValue={book.description} className="w-full bg-zinc-50 border-none rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 ring-primary/20 transition-all resize-none outline-none" />
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-4">Voucher Admin áp dụng (Chia sẻ 50% chi phí)</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {availableVouchers.length > 0 ? availableVouchers.map((v: any) => {
                            const isSelected = book.vouchers?.some((bv: any) => bv.id === v.id);
                            return (
                              <label key={v.id} className={`flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer group ${isSelected ? 'bg-primary/5 border-primary/20' : 'bg-zinc-50 border-transparent hover:border-zinc-200'}`}>
                                <input 
                                  type="checkbox" 
                                  name="vouchers" 
                                  value={v.id} 
                                  defaultChecked={isSelected}
                                  className="w-4 h-4 rounded border-zinc-200 bg-white text-primary focus:ring-primary focus:ring-offset-0 transition-all" 
                                />
                                <div className="flex-1">
                                  <p className="text-xs font-bold text-zinc-900">{v.code}</p>
                                  <p className="text-[10px] text-zinc-400">
                                    {v.discountType === 'PERCENTAGE' ? `Giảm ${v.discountValue}%` : `Giảm ${new Intl.NumberFormat('vi-VN').format(v.discountValue)}đ`}
                                    {v.maxDiscount ? ` (Tối đa ${new Intl.NumberFormat('vi-VN').format(v.maxDiscount)}đ)` : ''}
                                  </p>
                                </div>
                              </label>
                            );
                          }) : (
                            <p className="text-[10px] text-zinc-400 italic ml-4">Không có voucher admin nào khả dụng</p>
                          )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-zinc-50">
                        <button type="button" onClick={() => setIsEditing(false)} className="px-8 py-3.5 rounded-2xl text-sm font-black text-zinc-400 hover:bg-zinc-50 transition-all">Huỷ</button>
                        <button disabled={loading} type="submit" className="px-10 py-3.5 bg-primary text-white rounded-2xl text-sm font-black shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50">
                          {loading ? "Đang lưu..." : (
                            <>
                              <Check size={18} />
                              <span>Lưu thay đổi</span>
                            </>
                          )}
                        </button>
                    </div>
                  </div>
                </form>
              </motion.div>
            </td>
          </motion.tr>
        )}
      </AnimatePresence>
    </>
  );
}
