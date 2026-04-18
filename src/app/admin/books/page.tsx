import { prisma } from "@/lib/prisma";
import { AdminBookForm } from "./AdminBookForm";
import { deleteBookAdmin } from "./actions";
import { ShoppingBag, Calendar, Tag, Package } from "lucide-react";
import { AdminBookRow } from "./AdminBookRow";

// Removed unused imports and simplified

export default async function AdminBooksPage() {
  const books = await prisma.book.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      seller: {
        select: { name: true, email: true }
      }
    }
  });

  // Sanitize Decimal values for Client Component serialization
  const serializedBooks = JSON.parse(JSON.stringify(books, (key, value) => 
    typeof value === 'bigint' ? value.toString() : value
  )).map((book: any, index: number) => ({
    ...book,
    price: Number(books[index].price)
  }));


  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-zinc-900 tracking-tight">Quản lý sản phẩm</h2>
          <p className="text-zinc-500 font-medium">Theo dõi và điều chỉnh toàn bộ sách trên hệ thống</p>
        </div>
        <AdminBookForm mode="create" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[
          { label: "Tổng sản phẩm", value: books.length, icon: ShoppingBag, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Sách mới đăng", value: books.filter(b => {
              const date = new Date(b.createdAt);
              const now = new Date();
              return (now.getTime() - date.getTime()) < (24 * 60 * 60 * 1000);
            }).length, icon: Calendar, color: "text-green-500", bg: "bg-green-500/10" },
          { label: "Hết hàng", value: books.filter(b => b.stockQuantity === 0).length, icon: Package, color: "text-red-500", bg: "bg-red-500/10" },
          { label: "Giá trị kho", value: new Intl.NumberFormat('vi-VN').format(books.reduce((sum, b) => sum + Number(b.price) * b.stockQuantity, 0)) + " đ", icon: Tag, color: "text-primary", bg: "bg-primary/10" },
        ].map((stat, i) => (
          <div key={i} className="glass p-6 rounded-3xl">
            <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-xl font-black">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="glass rounded-[32px] overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50">
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-zinc-500 whitespace-nowrap">Sản phẩm</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-zinc-500 whitespace-nowrap">Người bán</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-zinc-500 whitespace-nowrap">Giá & Kho</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-zinc-500 whitespace-nowrap">Danh mục</th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-zinc-500 text-right whitespace-nowrap">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {serializedBooks.map((book) => (
              <AdminBookRow key={book.id} book={book} />
            ))}
          </tbody>
        </table>
        
        {books.length === 0 && (
          <div className="p-20 text-center space-y-4">
             <div className="w-16 h-16 bg-zinc-50 rounded-3xl mx-auto flex items-center justify-center text-zinc-200">
               <ShoppingBag size={32} />
             </div>
             <p className="text-zinc-500 font-medium">Chưa có sản phẩm nào trên hệ thống.</p>
          </div>
        )}
      </div>
    </div>
  );
}
