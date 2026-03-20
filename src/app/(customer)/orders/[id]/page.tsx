import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, MapPin, Package, Phone, CreditCard, CalendarClock } from "lucide-react";

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true }
  });

  if (!order) {
    notFound();
  }

  // Check if they own the order
  if (order.userId !== session.user.id && session.user.role !== "ADMIN") {
    redirect("/profile");
  }

  const formatCurrency = (amount: any) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(amount));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'PAID': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'DELIVERED': return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
      case 'UNPAID': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'SHIPPED': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Đang xử lý';
      case 'PAID': return 'Đã thanh toán';
      case 'DELIVERED': return 'Đã giao hàng';
      case 'CANCELLED': return 'Đã huỷ';
      case 'UNPAID': return 'Chưa thanh toán';
      case 'SHIPPED': return 'Đang giao hàng';
      default: return status;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Link href="/profile" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#D96C4E] mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Quay lại tài khoản
      </Link>
      
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#40332B] mb-2">
            Chi tiết đơn hàng #{order.orderId}
          </h1>
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <CalendarClock className="w-4 h-4" />
            <span>Ngày đặt: {new Date(order.createdAt).toLocaleString("vi-VN")}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.paymentStatus)}`}>
            Thanh toán: {getStatusLabel(order.paymentStatus)}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.deliveryStatus)}`}>
            Giao hàng: {getStatusLabel(order.deliveryStatus)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-[#E5D5C5] shadow-sm flex flex-col">
          <div className="flex items-center gap-2 text-[#40332B] font-bold mb-4">
            <MapPin className="w-5 h-5 text-[#D96C4E]" />
            Địa chỉ nhận hàng
          </div>
          <p className="text-[#40332B] font-medium mb-1">{order.customerName}</p>
          <p className="text-[#5C4D43] text-sm flex items-center gap-1 mb-2">
            <Phone className="w-3.5 h-3.5" />
            {order.phone}
          </p>
          <p className="text-[#5C4D43] text-sm mt-auto">{order.address}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#E5D5C5] shadow-sm flex flex-col md:col-span-2">
          <div className="flex items-center gap-2 text-[#40332B] font-bold mb-4">
            <CreditCard className="w-5 h-5 text-[#D96C4E]" />
            Tổng quan thanh toán
          </div>
          <div className="grid grid-cols-2 gap-4 mt-auto">
            <div>
              <p className="text-sm text-gray-500 mb-1">Tạm tính</p>
              <p className="font-medium text-[#40332B]">{formatCurrency(order.subtotal)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Phí giao hàng</p>
              <p className="font-medium text-[#40332B]">0 ₫</p>
            </div>
            {Number(order.discountAmount) > 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Giảm giá</p>
                <p className="font-medium text-green-600">-{formatCurrency(order.discountAmount)}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500 mb-1">Tổng thanh toán</p>
              <p className="font-black text-[#D96C4E] text-lg">{formatCurrency(order.totalPayable)}</p>
            </div>
          </div>
          
          {order.note && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600"><span className="font-medium">Ghi chú:</span> {order.note}</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5D5C5] shadow-sm overflow-hidden">
        <div className="bg-[#FFFBF5] px-6 py-4 border-b border-[#E5D5C5]">
          <h2 className="text-lg font-bold text-[#40332B] flex items-center gap-2">
            <Package className="w-5 h-5 text-[#D96C4E]" />
            Sản phẩm đã đặt ({order.items.length})
          </h2>
        </div>
        
        <div className="divide-y divide-[#E5D5C5]">
          {order.items.map(item => (
            <div key={item.id} className="p-6 flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 text-gray-300">
                 <Package className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <Link href={`/products/${item.productId}`} className="font-bold text-[#40332B] hover:text-[#D96C4E] hover:underline transition-colors line-clamp-1">
                  {item.productName}
                </Link>
                <div className="text-sm text-gray-500 mt-1">Mã SP: {item.productCode}</div>
              </div>
              <div className="text-right">
                <div className="font-medium text-[#40332B]">
                  {formatCurrency(item.unitPrice)} <span className="text-gray-400 text-sm font-normal">x {item.quantity}</span>
                </div>
                <div className="font-bold text-[#D96C4E] mt-1">
                  {formatCurrency(item.lineTotal)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {order.paymentStatus === 'UNPAID' && order.deliveryStatus !== 'CANCELLED' && (
        <div className="mt-8 flex justify-center">
          <Link 
            href={`/checkout/success/${order.id}`}
            className="bg-[#D96C4E] hover:bg-[#C55A3D] text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-md flex items-center gap-2"
          >
            <CreditCard className="w-5 h-5" />
            Xem thông tin thanh toán (VietQR)
          </Link>
        </div>
      )}
    </div>
  );
}
