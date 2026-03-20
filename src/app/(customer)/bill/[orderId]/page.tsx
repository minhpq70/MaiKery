import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, CheckCircle2, Copy } from "lucide-react";
import { PrintButton } from "./print-button";

export default async function BillPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  const order = await prisma.order.findUnique({
    where: { orderId },
    include: { items: { include: { product: true } } }
  });

  if (!order) notFound();

  const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } });
  
  const qrUrl = settings?.bankBin && settings?.bankAccount 
    ? `https://img.vietqr.io/image/${settings.bankBin}-${settings.bankAccount}-compact2.png?amount=${order.totalPayable}&addInfo=${order.orderId}&accountName=${encodeURIComponent(settings.bankName || "MaiKery")}`
    : null;

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl min-h-[70vh]">
      <div className="mb-6 flex justify-between items-center print:hidden">
        <Link href="/" className="flex items-center text-[#5C4D43] hover:text-[#D96C4E] font-medium transition-colors">
          <ChevronLeft className="w-5 h-5 mr-1" /> Về trang chủ
        </Link>
        <PrintButton />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#F2E8D9] overflow-hidden">
        {/* Header */}
        <div className="bg-[#40332B] text-white p-8 text-center flex flex-col items-center">
          <CheckCircle2 className="w-16 h-16 text-[#D96C4E] mb-4" />
          <h1 className="text-3xl font-serif font-bold mb-2">Đặt hàng thành công!</h1>
          <p className="opacity-80">Mã đơn hàng: <span className="font-bold">{order.orderId}</span></p>
        </div>

        <div className="p-8 flex flex-col md:flex-row gap-8">
          {/* Order Details */}
          <div className="flex-[2] space-y-8">
            <section>
              <h3 className="text-lg font-bold text-[#40332B] mb-4 border-b border-[#F2E8D9] pb-2">Thông tin khách hàng</h3>
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                <div className="text-[#5C4D43]">Họ tên:</div>
                <div className="font-medium text-[#40332B]">{order.customerName}</div>
                
                <div className="text-[#5C4D43]">Số điện thoại:</div>
                <div className="font-medium text-[#40332B]">{order.phone}</div>
                
                <div className="text-[#5C4D43]">Email:</div>
                <div className="font-medium text-[#40332B]">{order.email}</div>
                
                <div className="text-[#5C4D43]">Địa chỉ:</div>
                <div className="font-medium text-[#40332B]">{order.address}</div>
                
                {order.note && (
                  <>
                    <div className="text-[#5C4D43]">Ghi chú:</div>
                    <div className="font-medium text-[#40332B] italic">{order.note}</div>
                  </>
                )}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-bold text-[#40332B] mb-4 border-b border-[#F2E8D9] pb-2">Chi tiết đơn hàng</h3>
              <div className="space-y-4">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div className="flex gap-4">
                      <div className="font-medium text-[#40332B]">{item.quantity} x</div>
                      <div className="text-[#5C4D43]">{item.productName || item.product.name}</div>
                    </div>
                    <div className="font-medium text-[#40332B]">
                      {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(item.lineTotal))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-[#F2E8D9] space-y-2 text-sm">
                <div className="flex justify-between text-[#5C4D43]">
                  <span>Tổng phụ</span>
                  <span>{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(order.subtotal))}</span>
                </div>
                {Number(order.discountAmount) > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá {order.discountCode ? `(${order.discountCode})` : ""}</span>
                    <span>- {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(order.discountAmount))}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold text-[#8C3D2B] pt-4 border-t border-[#F2E8D9] mt-2">
                  <span>Tổng tiền thanh toán</span>
                  <span>{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(order.totalPayable))}</span>
                </div>
              </div>
            </section>
          </div>

          {/* Payment QR - Only show if UNPAID and settings exist */}
          <div className="flex-1 bg-[#FFFBF5] p-6 rounded-2xl border border-[#F2E8D9] flex flex-col items-center justify-center text-center">
            {order.paymentStatus === "UNPAID" && qrUrl ? (
              <>
                <h3 className="text-lg font-bold text-[#40332B] mb-2">Thanh toán chuyển khoản</h3>
                <p className="text-xs text-[#5C4D43] mb-6">Quét mã QR qua ứng dụng ngân hàng để thanh toán nhanh</p>
                
                <div className="bg-white p-3 rounded-xl border border-[#E5D5C5] shadow-sm mb-6 inline-block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrUrl} alt="VietQR Payment" className="w-[200px] h-auto mx-auto" />
                </div>

                <div className="text-sm space-y-2 text-left w-full bg-white p-4 rounded-xl border border-[#E5D5C5]">
                  <div className="flex justify-between">
                    <span className="text-[#5C4D43]">Ngân hàng:</span>
                    <span className="font-bold text-[#40332B]">{settings?.bankShortName || settings?.bankName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5C4D43]">Chủ TK:</span>
                    <span className="font-bold text-[#40332B]">{settings?.bankName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5C4D43]">Số TK:</span>
                    <span className="font-bold text-[#40332B]">{settings?.bankAccount}</span>
                  </div>
                  <div className="flex justify-between border-t border-dashed border-[#E5D5C5] pt-2 mt-2">
                    <span className="text-[#5C4D43]">Nội dung DK:</span>
                    <span className="font-bold text-[#8C3D2B]">{order.orderId}</span>
                  </div>
                </div>

                <p className="text-xs text-[#5C4D43] mt-6 italic">
                  Đơn hàng sẽ được xử lý ngay sau khi hệ thống nhận được thanh toán. Xin cảm ơn quý khách!
                </p>
              </>
            ) : order.paymentStatus === "PAID" ? (
              <div className="py-12">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#40332B]">Đã thanh toán</h3>
                <p className="text-[#5C4D43] mt-2">Đơn hàng của bạn đang được chuẩn bị.</p>
              </div>
            ) : (
              <div className="py-12">
                <h3 className="text-lg font-bold text-[#40332B]">Chờ thanh toán</h3>
                <p className="text-[#5C4D43] mt-2">Vui lòng liên hệ cửa hàng để được hướng dẫn thanh toán.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
