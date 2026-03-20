import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AddToCartButton from "./add-to-cart-button";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product || !product.isActive) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        <div className="aspect-square bg-[#F2E8D9] rounded-3xl overflow-hidden relative shadow-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={product.imageUrl || "/placeholder.png"} 
            alt={product.name} 
            className="object-cover w-full h-full"
          />
        </div>
        <div className="flex flex-col justify-center">
          <div className="mb-2 text-[#D96C4E] text-sm font-bold tracking-wider uppercase">MaiKery Signature</div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#40332B] mb-4">{product.name}</h1>
          <p className="text-2xl font-bold text-[#8C3D2B] mb-8">
            {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(product.salePrice))}
          </p>
          <div className="prose prose-stone mb-10 text-[#5C4D43]">
            {product.description || "Chưa có mô tả chi tiết cho sản phẩm này."}
          </div>
          
          <div className="bg-[#FFFBF5] rounded-2xl p-6 border border-[#F2E8D9] mb-8">
            <ul className="space-y-3 text-sm text-[#5C4D43]">
              <li className="flex items-center gap-3">
                <svg className="text-[#D96C4E]" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>
                Nướng mới mỗi 4 giờ
              </li>
              <li className="flex items-center gap-3">
                <svg className="text-[#D96C4E]" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                Không chất bảo quản
              </li>
              <li className="flex items-center gap-3">
                <svg className="text-[#D96C4E]" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                Giao hàng hoả tốc TP.HCM
              </li>
            </ul>
          </div>

          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}
