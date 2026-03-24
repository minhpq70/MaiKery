import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Search, Edit, Tag } from "lucide-react";
import Image from "next/image";
import { DeleteProductButton } from "@/components/admin/delete-product-button";

export default async function AdminProductsPage(props: {
  searchParams: Promise<{ q?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.q || "";

  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { productCode: { contains: query, mode: "insensitive" } },
      ],
    },
    orderBy: { createdAt: "desc" },
    include: {
      productionBatches: {
        orderBy: { batchDate: "desc" },
        take: 1,
        select: { unitCost: true }
      }
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Quản lý Sản phẩm</h1>
        <Link
          href="/admin/products/new"
          className="bg-[#D96C4E] hover:bg-[#C55A3D] text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Thêm sản phẩm
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-[#E5D5C5] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#E5D5C5] flex items-center justify-between bg-gray-50">
          <form className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Tìm kiếm theo tên hoặc mã SP..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D96C4E] bg-white"
            />
          </form>
          <div className="text-sm text-gray-500 font-medium">
            Tổng cộng: {products.length} sản phẩm
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#FFFBF5] text-[#5C4D43] font-medium border-b border-[#E5D5C5]">
              <tr>
                <th className="px-6 py-4">Sản phẩm</th>
                <th className="px-6 py-4">Mã SP</th>
                <th className="px-6 py-4">Giá bán</th>
                <th className="px-6 py-4">Giá vốn / Lợi nhuận</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5D5C5]">
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                          {product.imageUrl ? (
                            <Image
                              src={product.imageUrl}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <Tag className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div className="font-medium text-[#40332B] truncate max-w-[200px]" title={product.name}>
                          {product.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium">
                      {product.productCode}
                    </td>
                    <td className="px-6 py-4 font-bold text-[#D96C4E]">
                      {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(product.salePrice))}
                    </td>
                    <td className="px-6 py-4">
                      {(() => {
                        const cost = product.productionBatches[0]?.unitCost;
                        if (!cost) return <span className="text-gray-400 italic text-xs">Chưa có Batch</span>;
                        const margin = ((Number(product.salePrice) - Number(cost)) / Number(product.salePrice)) * 100;
                        return (
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-800">
                              {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(cost))}
                            </span>
                            <span className={`text-xs font-bold ${margin > 50 ? 'text-green-600' : margin > 20 ? 'text-yellow-600' : 'text-red-500'}`}>
                              {margin.toFixed(1)}% Lợi nhuận
                            </span>
                          </div>
                        );
                      })()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        product.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {product.isActive ? "Đang bán" : "Ngừng bán"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <DeleteProductButton id={product.id} name={product.name} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Không tìm thấy sản phẩm nào
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
