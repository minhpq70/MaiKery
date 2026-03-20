import { ProductForm } from "@/components/admin/product-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 hover:bg-white rounded-full transition-colors text-gray-500 hover:text-[#40332B]">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Thêm sản phẩm mới</h1>
          <p className="text-sm text-gray-500 mt-1">Điền thông tin chi tiết cho sản phẩm mới</p>
        </div>
      </div>

      <ProductForm />
    </div>
  );
}
