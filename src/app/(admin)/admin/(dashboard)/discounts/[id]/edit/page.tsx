import { prisma } from "@/lib/prisma";
import { DiscountForm } from "@/components/admin/discount-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

export default async function EditDiscountPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const discount = await prisma.discountCode.findUnique({
    where: { id },
  });

  if (!discount) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/discounts" className="p-2 hover:bg-white rounded-full transition-colors text-gray-500 hover:text-[#40332B]">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Chỉnh sửa mã khuyến mãi</h1>
          <p className="text-sm text-gray-500 mt-1">Cập nhật thông tin mã giảm giá</p>
        </div>
      </div>

      <DiscountForm discount={discount} />
    </div>
  );
}
