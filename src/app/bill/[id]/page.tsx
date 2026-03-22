import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import Image from "next/image";

export default async function BillPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const order = await prisma.order.findUnique({
    where: { orderId: id },
    include: { items: true },
  });

  if (!order) {
    notFound();
  }

  const settings = await prisma.siteSettings.findUnique({
    where: { id: "default" },
  });

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white min-h-screen font-sans text-gray-900">
      {/* Print Button (Hidden when printing) */}
      <div className="mb-8 flex justify-end print:hidden">
        <button 
          onClick={() => window.print()}
          className="bg-gray-900 hover:bg-black text-white px-6 py-2 rounded-lg font-medium shadow-sm transition-colors"
        >
          In hóa đơn
        </button>
      </div>

      <div className="border border-gray-200 p-10 rounded-xl shadow-sm print:border-none print:shadow-none print:p-0">
        <div className="flex justify-between items-start border-b border-gray-200 pb-8 mb-8">
          <div>
            {settings?.logoUrl ? (
              <Image src={settings.logoUrl} alt="Logo" width={150} height={50} className="object-contain h-12 w-auto mb-4" />
            ) : (
              <h1 className="text-3xl font-bold mb-4">{settings?.storeName || "MaiKery"}</h1>
            )}
            <div className="text-sm text-gray-600 space-y-1">
              {settings?.storeAddress && <p>Địa chỉ: {settings.storeAddress}</p>}
              {settings?.storePhone && <p>Điện thoại: {settings.storePhone}</p>}
              {settings?.storeEmail && <p>Email: {settings.storeEmail}</p>}
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-wider mb-2">Hóa đơn</h2>
            <div className="text-sm text-gray-600 space-y-1">
              <p><span className="font-semibold text-gray-800">Mã ĐH:</span> #{order.orderId}</p>
              <p><span className="font-semibold text-gray-800">Ngày tạo:</span> {format(new Date(order.createdAt), "dd/MM/yyyy HH:mm")}</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-3 border-b border-gray-200 pb-2">Thông tin khách hàng</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="mb-1"><span className="font-semibold text-gray-700">Người nhận:</span> {order.customerName}</p>
              <p className="mb-1"><span className="font-semibold text-gray-700">Điện thoại:</span> {order.phone}</p>
              {order.email && <p className="mb-1"><span className="font-semibold text-gray-700">Email:</span> {order.email}</p>}
            </div>
            <div>
              <p className="mb-1"><span className="font-semibold text-gray-700">Địa chỉ giao hàng:</span> {order.address}</p>
              {order.note && <p className="mb-1"><span className="font-semibold text-gray-700">Ghi chú:</span> {order.note}</p>}
            </div>
          </div>
        </div>

        <div className="mb-8">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-y border-gray-200">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-700">Sản phẩm</th>
                <th className="px-4 py-3 font-semibold text-gray-700 text-center">SL</th>
                <th className="px-4 py-3 font-semibold text-gray-700 text-right">Đơn giá</th>
                <th className="px-4 py-3 font-semibold text-gray-700 text-right">Thành tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3 text-gray-800 font-medium">
                    {item.productName}
                    <div className="text-xs text-gray-500 font-normal">Mã SP: {item.productCode}</div>
                  </td>
                  <td className="px-4 py-3 text-center">{item.quantity}</td>
                  <td className="px-4 py-3 text-right">
                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(item.unitPrice))}
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(item.lineTotal))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end border-t border-gray-200 pt-6">
          <div className="w-full sm:w-1/2 lg:w-1/3 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Tạm tính:</span>
              <span className="font-medium">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(order.subtotal))}</span>
            </div>
            {Number(order.discountAmount) > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Giảm giá {order.discountCode ? `(${order.discountCode})` : ""}:</span>
                <span className="font-medium">- {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(order.discountAmount))}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3">
              <span>Tổng cộng:</span>
              <span className="text-[#D96C4E]">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(order.totalPayable))}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center text-sm text-gray-500 border-t border-gray-200 pt-8">
          <p className="font-medium text-gray-800 mb-1">Cảm ơn quý khách đã mua hàng!</p>
          <p>Hẹn gặp lại quý khách lần sau</p>
        </div>
      </div>
    </div>
  );
}
