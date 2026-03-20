import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, MapPin, CreditCard, ShoppingBag, Clock } from "lucide-react";
import { format } from "date-fns";
import { UpdateOrderStatusForm } from "@/components/admin/update-order-status-form";

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: true,
        }
      },
      user: true,
    }
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/orders" className="p-2 hover:bg-white rounded-full transition-colors text-gray-500 hover:text-[#40332B]">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            Đơn hàng #{order.orderId}
          </h1>
          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
            <Clock className="w-3.5 h-3.5" />
            Đặt lúc {format(new Date(order.createdAt), "HH:mm - dd/MM/yyyy")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-xl border border-[#E5D5C5] shadow-sm overflow-hidden p-6">
            <h2 className="text-lg font-bold text-[#40332B] mb-4 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#D96C4E]" />
              Sản phẩm ({order.items.length})
            </h2>
            
            <div className="space-y-4 divide-y divide-gray-100">
              {order.items.map((item) => (
                <div key={item.id} className="pt-4 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-gray-100 flex-shrink-0 relative overflow-hidden">
                    {item.product.imageUrl ? (
                      <img src={item.product.imageUrl} alt={item.productName} className="object-cover w-full h-full" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-[#40332B]">{item.productName}</h3>
                    <p className="text-sm text-gray-500">Mã: {item.productCode}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-[#5C4D43]">{new Intl.NumberFormat("vi-VN").format(Number(item.unitPrice))}đ</p>
                    <p className="text-sm text-gray-500">x {item.quantity}</p>
                  </div>
                  <div className="text-right w-24">
                    <p className="font-bold text-[#D96C4E]">{new Intl.NumberFormat("vi-VN").format(Number(item.lineTotal))}đ</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính</span>
                <span>{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(order.subtotal))}</span>
              </div>
              {Number(order.discountAmount) > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Giảm giá {order.discountCode ? `(${order.discountCode})` : ''}</span>
                  <span>-{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(order.discountAmount))}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-[#40332B] pt-2">
                <span>Tổng cộng</span>
                <span className="text-[#D96C4E]">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(order.totalPayable))}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Status Update Form */}
          <UpdateOrderStatusForm order={order} />

          {/* Customer Info */}
          <div className="bg-white rounded-xl border border-[#E5D5C5] shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-bold text-[#40332B] flex items-center gap-2">
              <User className="w-5 h-5 text-[#D96C4E]" />
              Thông tin khách hàng
            </h2>
            <div className="text-sm space-y-2 text-[#5C4D43]">
              <p><span className="text-gray-500 block mb-0.5">Họ tên:</span> <span className="font-medium">{order.customerName}</span> {order.userId && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full ml-2">Đăng ký</span>}</p>
              <p><span className="text-gray-500 block mb-0.5">Điện thoại:</span> <span className="font-medium">{order.phone}</span></p>
              <p><span className="text-gray-500 block mb-0.5">Email:</span> <span>{order.email}</span></p>
            </div>
            
            <div className="pt-4 border-t border-gray-100">
              <h3 className="font-medium text-[#40332B] flex items-center gap-2 mb-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-400" />
                Địa chỉ giao hàng
              </h3>
              <p className="text-sm text-[#5C4D43] leading-relaxed">{order.address}</p>
            </div>

            {order.note && (
              <div className="pt-4 border-t border-gray-100">
                <h3 className="font-medium text-[#40332B] flex items-center gap-2 mb-2 text-sm">
                  <CreditCard className="w-4 h-4 text-gray-400" />
                  Ghi chú
                </h3>
                <p className="text-sm bg-[#FFFBF5] p-3 rounded-lg text-[#5C4D43]">{order.note}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
