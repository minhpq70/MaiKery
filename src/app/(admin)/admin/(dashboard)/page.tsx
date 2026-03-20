import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Package, ShoppingCart, CircleDollarSign, Clock } from "lucide-react";

export default async function AdminDashboardPage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [totalOrders, todayOrders, productsCount, pendingDeliveries] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({
      where: {
        createdAt: {
          gte: today,
        },
      },
    }),
    prisma.product.count(),
    prisma.order.count({
      where: {
        deliveryStatus: "PENDING",
      },
    }),
  ]);

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tổng quan</h1>
        <p className="text-sm text-gray-500">
          Hôm nay, {format(new Date(), "dd MMMM, yyyy", { locale: vi })}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-[#E5D5C5] shadow-sm flex items-start justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Tổng doanh thu</h3>
            <p className="text-2xl font-bold mt-2">Đang tính...</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <CircleDollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#E5D5C5] shadow-sm flex items-start justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Đơn mới hôm nay</h3>
            <p className="text-2xl font-bold mt-2">{todayOrders}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <ShoppingCart className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#E5D5C5] shadow-sm flex items-start justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Đơn chờ giao</h3>
            <p className="text-2xl font-bold mt-2">{pendingDeliveries}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#E5D5C5] shadow-sm flex items-start justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Tổng sản phẩm</h3>
            <p className="text-2xl font-bold mt-2">{productsCount}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
            <Package className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#E5D5C5] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#E5D5C5]">
          <h2 className="text-lg font-bold">Đơn hàng gần đây</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#FFFBF5] text-[#5C4D43] font-medium border-b border-[#E5D5C5]">
              <tr>
                <th className="px-6 py-4">Mã đơn</th>
                <th className="px-6 py-4">Khách hàng</th>
                <th className="px-6 py-4">Thời gian</th>
                <th className="px-6 py-4">Tổng tiền</th>
                <th className="px-6 py-4">Thanh toán</th>
                <th className="px-6 py-4">Giao hàng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5D5C5]">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium">{order.orderId}</td>
                    <td className="px-6 py-4">{order.customerName}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {format(new Date(order.createdAt), "HH:mm dd/MM/yyyy")}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(order.totalPayable))}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        order.paymentStatus === "PAID" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                      }`}>
                        {order.paymentStatus === "PAID" ? "Đã TT" : "Chưa TT"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        order.deliveryStatus === "DELIVERED" ? "bg-green-100 text-green-700" : 
                        order.deliveryStatus === "PREPARING" || order.deliveryStatus === "SHIPPING" ? "bg-blue-100 text-blue-700" :
                        "bg-gray-100 text-gray-700"
                      }`}>
                        {order.deliveryStatus === "DELIVERED" ? "Đã giao" : 
                         order.deliveryStatus === "PREPARING" ? "Chuẩn bị" :
                         order.deliveryStatus === "SHIPPING" ? "Đang giao" :
                         "Chờ XL"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Chưa có đơn hàng nào
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
