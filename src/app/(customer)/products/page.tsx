import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-serif font-bold text-[#40332B] mb-4">Thực Đơn</h1>
        <p className="text-[#5C4D43] max-w-2xl">
          Tất cả sản phẩm của MaiKery đều được nướng mới mỗi ngày bằng 100% tình yêu và nguyên liệu tự nhiên.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <Link href={`/products/${product.id}`} key={product.id} className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#F2E8D9]">
            <div className="aspect-square bg-[#F2E8D9] relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={product.imageUrl || "/placeholder.png"} 
                alt={product.name} 
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-lg font-bold text-[#40332B] mb-2 group-hover:text-[#D96C4E] transition-colors line-clamp-2">{product.name}</h3>
              <p className="text-[#5C4D43] text-sm mb-4 line-clamp-2 flex-grow">{product.description}</p>
              <div className="flex items-center justify-between mt-auto">
                <p className="text-[#8C3D2B] font-bold text-lg">
                  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(product.salePrice))}
                </p>
                <div className="w-8 h-8 rounded-full bg-[#FFFBF5] flex items-center justify-center text-[#D96C4E] group-hover:bg-[#D96C4E] group-hover:text-white transition-colors border border-[#F2E8D9] group-hover:border-transparent">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                </div>
              </div>
            </div>
          </Link>
        ))}
        {products.length === 0 && (
          <div className="col-span-full text-center py-20 text-[#5C4D43] bg-white rounded-2xl border border-dashed border-[#F2E8D9]">
            Hiện tại chưa có sản phẩm nào. Vui lòng quay lại sau!
          </div>
        )}
      </div>
    </div>
  );
}
