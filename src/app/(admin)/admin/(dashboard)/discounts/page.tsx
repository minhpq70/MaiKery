import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit, Ticket } from "lucide-react";
import { format } from "date-fns";
import { DeleteDiscountButton } from "@/components/admin/delete-discount-button";

export default async function AdminDiscountsPage() {
  const discounts = await prisma.discountCode.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Mã Khuyến Mãi</h1>
        <Link
          href="/admin/discounts/new"
          className="bg-[#D96C4E] hover:bg-[#C55A3D] text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Tạo mã mới
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-[#E5D5C5] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#FFFBF5] text-[#5C4D43] font-medium border-b border-[#E5D5C5]">
              <tr>
                <th className="px-6 py-4">Mã Code</th>
                <th className="px-6 py-4">Mức giảm</th>
                <th className="px-6 py-4">Sử dụng</th>
                <th className="px-6 py-4">Hạn sử dụng</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5D5C5]">
              {discounts.length > 0 ? (
                discounts.map((discount) => {
                  const isExpired = discount.expiresAt && new Date(discount.expiresAt) < new Date();
                  const isUsedUp = discount.usageLimit && discount.usedCount >= discount.usageLimit;
                  const isActive = discount.active && !isExpired && !isUsedUp;

                  return (
                    <tr key={discount.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                            <Ticket className="w-4 h-4" />
                          </div>
                          <span className="font-bold text-[#40332B] uppercase">{discount.code}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-[#D96C4E]">
                        {discount.discountType === "PERCENTAGE" 
                          ? `${discount.discountValue}%` 
                          : new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(discount.discountValue))}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {discount.usedCount} / {discount.usageLimit || "∞"}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {discount.expiresAt ? format(new Date(discount.expiresAt), "HH:mm dd/MM/yyyy") : "Không thời hạn"}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          isActive ? "bg-green-100 text-green-700" : 
                          (!discount.active ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700")
                        }`}>
                          {isActive ? "Khả dụng" : 
                           (!discount.active ? "Đã tắt" : 
                            (isExpired ? "Hết hạn" : "Hết lượt"))}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/discounts/${discount.id}/edit`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Chỉnh sửa"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <DeleteDiscountButton id={discount.id} code={discount.code} />
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Chưa có mã khuyến mãi nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
