import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Package, MapPin, User as UserIcon, Calendar, Clock, ChevronRight } from "lucide-react";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/profile");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      orders: {
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!user) {
    redirect("/auth/signin");
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="text-3xl font-bold text-[#40332B] mb-8">Tài khoản của bạn</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Sidebar / Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-[#E5D5C5] shadow-sm flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-[#FFFBF5] rounded-full border-4 border-[#E5D5C5] flex items-center justify-center mb-4 overflow-hidden">
              <UserIcon className="w-10 h-10 text-[#D96C4E]" />
            </div>
            <h2 className="text-xl font-bold text-[#40332B] truncate w-full">{user.name || "Khách hàng"}</h2>
            <p className="text-sm text-gray-500 mb-6 truncate w-full">{user.email}</p>
            
            <div className="w-full space-y-3">
              <div className="flex items-center gap-3 text-sm text-[#5C4D43] bg-gray-50 p-3 rounded-xl border border-gray-100">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>Tham gia: {new Date(user.createdAt).toLocaleDateString("vi-VN")}</span>
              </div>
              <form action="/api/auth/signout" method="POST">
                <button type="submit" className="w-full text-sm font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 py-3 rounded-xl transition-colors border border-red-100">
                  Đăng xuất
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Main Content / Orders */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-[#E5D5C5] shadow-sm overflow-hidden">
            <div className="bg-[#FFFBF5] px-6 py-5 border-b border-[#E5D5C5] flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#40332B] flex items-center gap-2">
                <Package className="w-5 h-5 text-[#D96C4E]" />
                Lịch sử đơn hàng
              </h2>
              <span className="bg-[#D96C4E]/10 text-[#D96C4E] text-xs font-bold px-3 py-1 rounded-full">
                {user.orders.length} đơn hàng
              </span>
            </div>

            {user.orders.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <Package className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-[#40332B] mb-2">Chưa có đơn hàng nào</h3>
                <p className="text-gray-500 max-w-sm mb-6">Bạn chưa thực hiện giao dịch nào tại MaiKery. Hãy tiếp tục mua sắm để lấp đầy giỏ hàng nhé!</p>
                <Link 
                  href="/products" 
                  className="bg-[#D96C4E] hover:bg-[#C55A3D] text-white px-8 py-3 rounded-full font-bold transition-all"
                >
                  Mua sắm ngay
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-[#E5D5C5]">
                {user.orders.map((order) => (
                  <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <Link href={`/orders/${order.id}`} className="font-bold text-lg text-[#D96C4E] hover:underline">
                            #{order.orderId}
                          </Link>
                          <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${getStatusColor(order.deliveryStatus)}`}>
                            {getStatusLabel(order.deliveryStatus)}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {order.address.split(',')[0]}...
                          </span>
                        </div>
                      </div>
                      <div className="text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                        <span className="font-black text-[#40332B] text-lg">
                          {formatCurrency(order.totalPayable)}
                        </span>
                        <Link 
                          href={`/orders/${order.id}`}
                          className="flex items-center text-sm font-bold text-[#D96C4E] hover:text-[#C55A3D]"
                        >
                          Chi tiết <ChevronRight className="w-4 h-4 ml-0.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
