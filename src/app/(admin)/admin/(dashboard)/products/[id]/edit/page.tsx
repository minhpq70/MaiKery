import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 hover:bg-white rounded-full transition-colors text-gray-500 hover:text-[#40332B]">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Chỉnh sửa sản phẩm</h1>
          <p className="text-sm text-gray-500 mt-1">Cập nhật thông tin chi tiết</p>
        </div>
      </div>

      <ProductForm product={JSON.parse(JSON.stringify(product))} />
    </div>
  );
}
