import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ShoppingBag, Calendar, Tag, Package, Plus } from "lucide-react";
import { CreateBookModal } from "./CreateBookModal";
import { SellerBookRow } from "./SellerBookRow";

export default async function SellerBooksPage() {
  const session = await auth();
  const userId = (session?.user as any)?.id;
  const sellerName = (session?.user as any)?.name || "Unknown Seller";
  const sellerEmail = (session?.user as any)?.email || "";

  const rawBooks = await prisma.book.findMany({
    where: { sellerId: userId },
    orderBy: { createdAt: "desc" },
  });

  // Sanitize Decimal values for Client Component serialization
  const books = rawBooks.map(book => ({
    ...book,
    price: Number(book.price)
  }));

  const stats = [
    { label: "Tổng sản phẩm", value: books.length, icon: Package, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Sách mới đăng", value: books.filter(b => {
        const date = new Date(b.createdAt);
        const now = new Date();
        return (now.getTime() - date.getTime()) < (24 * 60 * 60 * 1000);
      }).length, icon: Calendar, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Hết hàng", value: books.filter(b => b.stockQuantity === 0).length, icon: ShoppingBag, color: "text-red-500", bg: "bg-red-500/10" },
    { label: "Giá trị kho", value: new Intl.NumberFormat('vi-VN').format(books.reduce((sum, b) => sum + Number(b.price) * b.stockQuantity, 0)) + " đ", icon: Tag, color: "text-primary", bg: "bg-primary/10" },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-zinc-900 tracking-tight">Quản lý kho hàng</h2>
          <p className="text-zinc-500 font-medium">Theo dõi và điều chỉnh các sản phẩm đang đăng bán của bạn</p>
        </div>
        <CreateBookModal />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="glass p-6 rounded-[32px] border border-zinc-100 shadow-sm">
            <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-xl font-black text-zinc-900">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="glass rounded-[40px] overflow-hidden border border-zinc-100 shadow-sm bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/50">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Sản phẩm</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Người bán</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Giá & Kho</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Danh mục</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {books.map((book) => (
                <SellerBookRow 
                  key={book.id} 
                  book={book} 
                  sellerName={sellerName} 
                  sellerEmail={sellerEmail} 
                />
              ))}
            </tbody>
          </table>
        </div>
        
        {books.length === 0 && (
          <div className="p-24 text-center space-y-4">
             <div className="w-20 h-20 bg-zinc-50 rounded-[32px] mx-auto flex items-center justify-center text-zinc-200 border border-zinc-100">
               <Package size={40} />
             </div>
             <div className="space-y-1">
               <p className="text-zinc-900 font-black text-lg">Kho hàng đang trống</p>
               <p className="text-zinc-400 font-medium">Bạn chưa đăng bán cuốn sách nào trên hệ thống.</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
