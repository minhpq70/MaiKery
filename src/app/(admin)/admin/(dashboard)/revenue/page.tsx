import { prisma } from "@/lib/prisma";
import { format, startOfWeek, isSameWeek, isSameMonth } from "date-fns";
import { vi } from "date-fns/locale";
import { CircleDollarSign, CalendarDays, CalendarRange } from "lucide-react";

export default async function RevenueTrackingPage() {
  const today = new Date();

  // Fetch all PAID orders (getting just the minimal data needed for aggregation)
  const paidOrders = await prisma.order.findMany({
    where: { paymentStatus: "PAID" },
    select: {
      id: true,
      totalPayable: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  let totalRevenue = 0;
  let thisMonthRevenue = 0;
  let thisWeekRevenue = 0;

  const monthlyData: Record<string, number> = {};
  const weeklyData: Record<string, number> = {};

  paidOrders.forEach((order) => {
    const amount = Number(order.totalPayable);
    totalRevenue += amount;

    // Current month/week checks
    if (isSameMonth(order.createdAt, today)) {
      thisMonthRevenue += amount;
    }
    if (isSameWeek(order.createdAt, today, { weekStartsOn: 1 })) {
      thisWeekRevenue += amount;
    }

    // Monthly aggregation
    const monthKey = format(order.createdAt, "MM/yyyy");
    monthlyData[monthKey] = (monthlyData[monthKey] || 0) + amount;

    // Weekly aggregation (Formatting as "Tuần thứ X, YYYY" or just start date of week)
    const weekStart = startOfWeek(order.createdAt, { weekStartsOn: 1 });
    const weekKey = format(weekStart, "dd/MM/yyyy");
    weeklyData[weekKey] = (weeklyData[weekKey] || 0) + amount;
  });

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Theo dõi doanh thu</h1>
        <p className="text-sm text-gray-500">
          Cập nhật: {format(new Date(), "HH:mm dd/MM/yyyy", { locale: vi })}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-[#E5D5C5] shadow-sm flex items-start justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Tổng doanh thu lịch sử</h3>
            <p className="text-2xl font-bold mt-2 text-[#D96C4E]">{formatCurrency(totalRevenue)}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
            <CircleDollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#E5D5C5] shadow-sm flex items-start justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Doanh thu tháng này</h3>
            <p className="text-2xl font-bold mt-2">{formatCurrency(thisMonthRevenue)}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <CalendarDays className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#E5D5C5] shadow-sm flex items-start justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Doanh thu tuần này</h3>
            <p className="text-2xl font-bold mt-2">{formatCurrency(thisWeekRevenue)}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <CalendarRange className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Breakdown */}
        <div className="bg-white rounded-xl border border-[#E5D5C5] shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#E5D5C5] bg-[#FFFBF5]">
            <h2 className="text-lg font-bold text-[#5C4D43]">Thống kê theo tháng</h2>
          </div>
          <div className="p-0 max-h-96 overflow-y-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 font-medium sticky top-0">
                <tr>
                  <th className="px-6 py-3 border-b border-gray-200">Tháng</th>
                  <th className="px-6 py-3 border-b border-gray-200 text-right">Doanh thu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {Object.entries(monthlyData).length > 0 ? Object.entries(monthlyData).map(([month, amount]) => (
                  <tr key={month} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium">{month}</td>
                    <td className="px-6 py-4 text-right font-medium text-green-600">{formatCurrency(amount)}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={2} className="px-6 py-8 text-center text-gray-500">Chưa có dữ liệu</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Weekly Breakdown */}
        <div className="bg-white rounded-xl border border-[#E5D5C5] shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#E5D5C5] bg-[#FFFBF5]">
            <h2 className="text-lg font-bold text-[#5C4D43]">Thống kê theo tuần (Ngày bắt đầu tuần)</h2>
          </div>
          <div className="p-0 max-h-96 overflow-y-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 font-medium sticky top-0">
                <tr>
                  <th className="px-6 py-3 border-b border-gray-200">Tuần bắt đầu từ</th>
                  <th className="px-6 py-3 border-b border-gray-200 text-right">Doanh thu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {Object.entries(weeklyData).length > 0 ? Object.entries(weeklyData).map(([week, amount]) => (
                  <tr key={week} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium">{week}</td>
                    <td className="px-6 py-4 text-right font-medium text-green-600">{formatCurrency(amount)}</td>
                  </tr>
                )) : (
                   <tr>
                    <td colSpan={2} className="px-6 py-8 text-center text-gray-500">Chưa có dữ liệu</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
