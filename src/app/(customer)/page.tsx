import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const featuredProducts = await prisma.product.findMany({
    where: { isActive: true },
    take: 4,
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden bg-[#8C3D2B]">
        <div className="absolute inset-0 bg-[#40332B]/50 z-10"></div>
        {/* Note: Would normally use next/image here with a real background image */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#8C3D2B] to-[#D96C4E] opacity-70"></div>
        <div className="relative z-20 text-center text-white px-4 max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 tracking-tight drop-shadow-lg">
            Hương Vị Từ Trái Tim
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-[#FFFBF5] font-light max-w-2xl mx-auto drop-shadow-md">
            Khám phá thế giới bánh thủ công tại MaiKery, nơi nghệ thuật làm bánh thăng hoa cùng nguyên liệu thượng hạng.
          </p>
          <Link 
            href="/products" 
            className="inline-block bg-[#FFFBF5] text-[#8C3D2B] font-bold text-lg px-8 py-4 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            Mua Ngay Món Mới
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#40332B] mb-4">Sản Phẩm Đang Hot</h2>
          <div className="h-1 w-20 bg-[#D96C4E] mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <Link href={`/products/${product.id}`} key={product.id} className="group">
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#F2E8D9]">
                <div className="aspect-square bg-[#F2E8D9] relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={product.imageUrl || "/placeholder.png"} 
                    alt={product.name} 
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-[#40332B] mb-2 truncate group-hover:text-[#D96C4E] transition-colors">{product.name}</h3>
                  <p className="text-[#8C3D2B] font-bold text-lg">
                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(product.salePrice))}
                  </p>
                </div>
              </div>
            </Link>
          ))}
          {featuredProducts.length === 0 && (
            <div className="col-span-full text-center py-12 text-[#5C4D43] italic">
              Đang cập nhật sản phẩm...
            </div>
          )}
        </div>
        <div className="text-center mt-12">
          <Link href="/products" className="inline-flex items-center gap-2 text-[#D96C4E] font-bold hover:text-[#8C3D2B] transition-colors">
            Xem tất cả sản phẩm
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </Link>
        </div>
      </section>

      {/* Brand Values */}
      <section className="bg-white py-20 border-y border-[#F2E8D9]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#FFFBF5] rounded-full flex items-center justify-center text-[#D96C4E] mb-6 shadow-sm border border-[#F2E8D9]">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <h3 className="text-xl font-bold text-[#40332B] mb-3">Chất Lượng Thượng Hạng</h3>
              <p className="text-[#5C4D43]">Sử dụng bơ lạt nguyên chất, bột mì Pháp và chocolate Bỉ để tạo nên hương vị khác biệt.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#FFFBF5] rounded-full flex items-center justify-center text-[#D96C4E] mb-6 shadow-sm border border-[#F2E8D9]">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <h3 className="text-xl font-bold text-[#40332B] mb-3">100% An Toàn</h3>
              <p className="text-[#5C4D43]">Không sử dụng chất bảo quản, luôn đảm bảo độ tươi mới khi bánh đến tay bạn.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#FFFBF5] rounded-full flex items-center justify-center text-[#D96C4E] mb-6 shadow-sm border border-[#F2E8D9]">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              </div>
              <h3 className="text-xl font-bold text-[#40332B] mb-3">Làm Bằng Cả Trái Tim</h3>
              <p className="text-[#5C4D43]">Mỗi chiếc bánh MaiKery là một tác phẩm nghệ thuật, được trau chuốt tỉ mỉ từ những người thợ làm bánh.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
