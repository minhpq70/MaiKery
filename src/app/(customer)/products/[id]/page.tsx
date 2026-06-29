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
          

          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}
