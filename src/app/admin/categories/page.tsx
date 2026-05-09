import { prisma } from "@/lib/prisma";
import { CategoryForm } from "./CategoryForm";
import { Layers, Trash2 } from "lucide-react";
import { deleteCategoryForm, seedCategories } from "./actions";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-zinc-900 tracking-tight">Quản lý danh mục</h2>
          <p className="text-zinc-500 font-medium">Theo dõi và điều chỉnh danh mục sách trên hệ thống</p>
        </div>
        <CategoryForm mode="create" />
      </div>

      <div className="glass rounded-[32px] overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50">
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-zinc-500 whitespace-nowrap">Tên danh mục</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-zinc-500 whitespace-nowrap">Slug</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-zinc-500 text-right whitespace-nowrap">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-zinc-50/50 transition-colors">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                      <Layers size={18} />
                    </div>
                    <span className="font-bold text-zinc-900">{cat.name}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="text-zinc-500 font-medium text-sm">{cat.slug}</span>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <CategoryForm mode="edit" category={cat} />
                    
                    <form action={deleteCategoryForm}>
                      <input type="hidden" name="id" value={cat.id} />
                      <button
                        type="submit"
                        className="p-2 hover:bg-white rounded-xl transition-all text-zinc-400 hover:text-red-500 shadow-sm hover:shadow-md"
                        title="Xóa danh mục"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {categories.length === 0 && (
          <div className="p-20 text-center space-y-6">
             <div className="w-16 h-16 bg-zinc-50 rounded-3xl mx-auto flex items-center justify-center text-zinc-200">
               <Layers size={32} />
             </div>
             <div className="space-y-2">
               <p className="text-zinc-500 font-medium">Chưa có danh mục nào trên hệ thống.</p>
               <p className="text-zinc-400 text-sm">Bạn có thể khởi tạo các danh mục mặc định để bắt đầu.</p>
             </div>
             <form action={async () => {
               "use server";
               await seedCategories();
             }}>
               <button
                 type="submit"
                 className="px-6 py-3 bg-secondary text-white font-bold rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-secondary/20"
               >
                 Khởi tạo danh mục mặc định
               </button>
             </form>
          </div>
        )}
      </div>
    </div>
  );
}
