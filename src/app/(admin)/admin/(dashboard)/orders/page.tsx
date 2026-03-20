import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Eye, Search } from "lucide-react";
import { format } from "date-fns";

export default async function AdminOrdersPage(props: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const searchParams = await props.searchParams;
  const q = searchParams?.q || "";
  const statusFilter = searchParams?.status || "ALL";

  const where: any = {};

  if (q) {
    where.OR = [
      { orderId: { contains: q, mode: "insensitive" } },
      { customerName: { contains: q, mode: "insensitive" } },
      { phone: { contains: q } },
    ];
  }

  if (statusFilter !== "ALL") {
    // Check if it's payment or delivery status
    if (["UNPAID", "PAID", "REFUNDED"].includes(statusFilter)) {
      where.paymentStatus = statusFilter;
    } else {
      where.deliveryStatus = statusFilter;
    }
  }

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Quản lý Đơn hàng</h1>
      </div>

      <div className="bg-white p-4 rounded-xl border border-[#E5D5C5] shadow-sm flex flex-col md:flex-row gap-4">
        <form className="flex-1 flex items-center gap-2">
           <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Tìm theo mã đơn, tên, SĐT..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D96C4E] focus:bg-white transition-all"
            />
          </div>
          <select 
            name="status" 
            defaultValue={statusFilter}
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D96C4E] focus:bg-white transition-all"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <optgroup label="Thanh toán">
              <option value="UNPAID">Chưa thanh toán</option>
              <option value="PAID">Đã thanh toán</option>
              <option value="REFUNDED">Đã hoàn tiền</option>
            </optgroup>
            <optgroup label="Giao hàng">
              <option value="PENDING">Chờ xác nhận</option>
              <option value="PREPARING">Đang chuẩn bị</option>
              <option value="SHIPPING">Đang giao</option>
              <option value="DELIVERED">Đã giao</option>
              <option value="CANCELLED">Đã hủy</option>
            </optgroup>
          </select>
          <button type="submit" className="bg-[#D96C4E] hover:bg-[#C55A3D] text-white px-4 py-2 rounded-lg font-medium transition-colors">
            Lọc
          </button>
          {(q || statusFilter !== "ALL") && (
            <Link href="/admin/orders" className="text-gray-500 hover:text-[#D96C4E] px-2 text-sm font-medium">
              Xóa lọc
            </Link>
          )}
        </form>
      </div>

      <div className="bg-white rounded-xl border border-[#E5D5C5] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#FFFBF5] text-[#5C4D43] font-medium border-b border-[#E5D5C5]">
              <tr>
                <th className="px-6 py-4">Mã đơn</th>
                <th className="px-6 py-4">Ngày tạo</th>
                <th className="px-6 py-4">Khách hàng</th>
                <th className="px-6 py-4">Tổng tiền</th>
                <th className="px-6 py-4">Thanh toán</th>
                <th className="px-6 py-4">Giao hàng</th>
                <th className="px-6 py-4 text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5D5C5]">
              {orders.length > 0 ? (
                orders.map((order) => {
                  return (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-[#D96C4E]">
                        <Link href={`/admin/orders/${order.id}`}>
                          {order.orderId}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {format(new Date(order.createdAt), "dd/MM/yyyy HH:mm")}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-[#40332B]">{order.customerName}</div>
                        <div className="text-xs text-gray-500">{order.phone}</div>
                      </td>
                      <td className="px-6 py-4 font-bold text-[#5C4D43]">
                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(order.totalPayable))}
                        <div className="text-xs text-gray-500 font-normal">{order.items.length} sản phẩm</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          order.paymentStatus === "PAID" ? "bg-green-100 text-green-700" : 
                          order.paymentStatus === "REFUNDED" ? "bg-gray-100 text-gray-700" : 
                          "bg-yellow-100 text-yellow-700"
                        }`}>
                          {order.paymentStatus === "PAID" ? "Đã thanh toán" : 
                           order.paymentStatus === "REFUNDED" ? "Hoàn tiền" : "Chưa thanh toán"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          order.deliveryStatus === "DELIVERED" ? "bg-green-100 text-green-700" : 
                          order.deliveryStatus === "CANCELLED" ? "bg-red-100 text-red-700" : 
                          order.deliveryStatus === "SHIPPING" ? "bg-blue-100 text-blue-700" : 
                          "bg-yellow-100 text-yellow-700"
                        }`}>
                          {order.deliveryStatus === "PENDING" ? "Chờ xác nhận" : 
                           order.deliveryStatus === "PREPARING" ? "Đang chuẩn bị" :
                           order.deliveryStatus === "SHIPPING" ? "Đang giao" :
                           order.deliveryStatus === "DELIVERED" ? "Đã giao" : "Đã hủy"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="inline-flex items-center justify-center p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    Không tìm thấy đơn hàng nào
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
