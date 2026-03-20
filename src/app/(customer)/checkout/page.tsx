"use client";

import { useState, useCallback, useEffect } from "react";
import { useCart } from "@/context/cart-context";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { checkoutSchema } from "@/lib/validations";
import { z } from "zod";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { items, subtotal: totalPrice } = cart;
  const router = useRouter();
  const { data: session } = useSession();

  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    note: "",
    discountCode: "",
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [discountStatus, setDiscountStatus] = useState<{
    status: "idle" | "checking" | "valid" | "invalid";
    message: string;
    percent?: number;
    amount?: number;
    type?: "PERCENTAGE" | "FIXED_AMOUNT";
    value?: number;
  }>({ status: "idle", message: "" });

  const applyDiscount = async () => {
    if (!formData.discountCode.trim()) return;
    
    setDiscountStatus({ status: "checking", message: "Đang kiểm tra..." });
    try {
      const res = await fetch("/api/discount-codes/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: formData.discountCode, cartTotal: totalPrice })
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setDiscountStatus({ 
          status: "valid", 
          message: data.discountType === "PERCENTAGE" 
            ? `Đã giảm ${data.discountValue}%` 
            : `Đã áp dụng giảm giá ${new Intl.NumberFormat("vi-VN").format(data.discountValue)}đ`,
          type: data.discountType,
          value: data.discountValue,
          amount: data.discountAmount 
        });
      } else {
        setDiscountStatus({ status: "invalid", message: data.error || "Mã không hợp lệ" });
      }
    } catch (e) {
      setDiscountStatus({ status: "invalid", message: "Lỗi kiểm tra mã" });
    }
  };

  const finalPrice = Math.max(0, totalPrice - (discountStatus.amount || 0));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    try {
      // Validate with schema
      checkoutSchema.parse(formData);
      setErrors({});
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        err.issues.forEach(issue => {
          if (issue.path[0]) {
            newErrors[issue.path[0] as string] = issue.message;
          }
        });
        setErrors(newErrors);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        items: items.map(i => ({
          productId: i.productId,
          quantity: i.quantity,
          unitPrice: i.unitPrice
        }))
      };

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (res.ok && data.success) {
        clearCart();
        router.push(`/bill/${data.orderId}`);
      } else {
        alert("Lỗi: " + (data.error || "Không thể đặt hàng"));
      }
    } catch (error) {
      alert("Đã xảy ra lỗi khi thanh toán. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold text-[#40332B] mb-4">Giỏ hàng của bạn đang trống</h2>
        <button onClick={() => router.push("/products")} className="text-[#D96C4E] hover:underline font-bold">
          Quay lại cửa hàng
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12 max-w-6xl">
      <h1 className="text-3xl font-serif font-bold text-[#40332B] mb-8">Thanh Toán</h1>
      
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-[3]">
          <form className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-[#F2E8D9] space-y-6" id="checkout-form" onSubmit={handleSubmit}>
            <h2 className="text-xl font-bold text-[#40332B] mb-4 border-b border-[#F2E8D9] pb-4">Thông tin giao hàng</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-[#5C4D43] mb-2">Họ & Tên *</label>
                <input 
                  type="text" 
                  value={formData.customerName}
                  onChange={e => setFormData({...formData, customerName: e.target.value})}
                  className={`w-full p-3 rounded-xl border ${errors.customerName ? "border-red-500 bg-red-50" : "border-[#E5D5C5]"} focus:ring-2 focus:ring-[#D96C4E] focus:outline-none`}
                  placeholder="Nguyễn Văn A"
                />
                {errors.customerName && <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>}
              </div>
              <div>
                <label className="block text-sm font-bold text-[#5C4D43] mb-2">Số điện thoại *</label>
                <input 
                  type="text" 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className={`w-full p-3 rounded-xl border ${errors.phone ? "border-red-500 bg-red-50" : "border-[#E5D5C5]"} focus:ring-2 focus:ring-[#D96C4E] focus:outline-none`}
                  placeholder="0987654321"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-[#5C4D43] mb-2">Email *</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className={`w-full p-3 rounded-xl border ${errors.email ? "border-red-500 bg-red-50" : "border-[#E5D5C5]"} focus:ring-2 focus:ring-[#D96C4E] focus:outline-none`}
                  placeholder="email@example.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-[#5C4D43] mb-2">Địa chỉ nhận hàng *</label>
                <input 
                  type="text" 
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  className={`w-full p-3 rounded-xl border ${errors.address ? "border-red-500 bg-red-50" : "border-[#E5D5C5]"} focus:ring-2 focus:ring-[#D96C4E] focus:outline-none`}
                  placeholder="Số nhà, Tên đường, Phường/Xã, Quận/Huyện, TP"
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-[#5C4D43] mb-2">Ghi chú đơn hàng (tuỳ chọn)</label>
                <textarea 
                  value={formData.note}
                  onChange={e => setFormData({...formData, note: e.target.value})}
                  className="w-full p-3 rounded-xl border border-[#E5D5C5] focus:ring-2 focus:ring-[#D96C4E] focus:outline-none min-h-[100px]"
                  placeholder="Ghi chú về thời gian nhận hàng, yêu cầu đặc biệt..."
                ></textarea>
              </div>
            </div>
          </form>
        </div>

        <div className="flex-[2]">
          <div className="bg-[#FFFBF5] rounded-2xl p-6 shadow-sm border border-[#F2E8D9] sticky top-24">
            <h2 className="text-xl font-bold text-[#40332B] mb-6 border-b border-[#F2E8D9] pb-4">Đơn Hàng Của Bạn</h2>
            
            <div className="max-h-64 overflow-y-auto mb-6 pr-2 -mr-2 space-y-4">
              {items.map(item => (
                <div key={item.productId} className="flex gap-3">
                  <div className="w-16 h-16 bg-white rounded-lg overflow-hidden shrink-0 border border-[#F2E8D9]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.imageUrl || "/placeholder.png"} alt={item.productName} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-[#40332B] line-clamp-2">{item.productName}</h4>
                    <p className="text-xs text-[#5C4D43] mt-1">SL: {item.quantity}</p>
                    <p className="text-sm font-bold text-[#8C3D2B] mt-1">
                      {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.unitPrice * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-6 pt-6 border-t border-[#F2E8D9]">
              <label className="block text-sm font-bold text-[#5C4D43] mb-2">Mã giảm giá</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={formData.discountCode}
                  onChange={e => setFormData({...formData, discountCode: e.target.value.toUpperCase()})}
                  className="flex-1 p-3 text-sm uppercase rounded-lg border border-[#E5D5C5] focus:ring-2 focus:ring-[#D96C4E] focus:outline-none"
                  placeholder="MAKM"
                />
                <button 
                  type="button"
                  onClick={applyDiscount}
                  disabled={!formData.discountCode || discountStatus.status === "checking"}
                  className="bg-[#D96C4E] hover:bg-[#8C3D2B] disabled:bg-gray-400 text-white font-bold px-4 rounded-lg transition-colors text-sm"
                >
                  Áp dụng
                </button>
              </div>
              {discountStatus.message && (
                <p className={`text-xs mt-2 font-bold ${discountStatus.status === "valid" ? "text-green-600" : "text-red-500"}`}>
                  {discountStatus.message}
                </p>
              )}
            </div>
            
            <div className="space-y-3 mb-6 pt-4 border-t border-[#F2E8D9] text-sm">
              <div className="flex justify-between text-[#5C4D43]">
                <span>Tổng phụ</span>
                <span>{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(totalPrice)}</span>
              </div>
              {discountStatus.status === "valid" && (
                <div className="flex justify-between text-green-600 font-bold">
                  <span>
                    Giảm giá {discountStatus.type === "PERCENTAGE" 
                      ? `(${discountStatus.value}%)` 
                      : `(-${new Intl.NumberFormat("vi-VN").format(discountStatus.value || 0)}đ)`
                    }
                  </span>
                  <span>- {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(discountStatus.amount || 0)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#5C4D43]">
                <span>Phí vận chuyển</span>
                <span className="italic text-xs mt-1">(Theo app giao hàng)</span>
              </div>
            </div>
            
            <div className="border-t border-[#8C3D2B] pt-4 mb-8">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-[#40332B] text-lg">Tổng cộng</span>
                <span className="text-3xl font-bold text-[#8C3D2B]">
                  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(finalPrice)}
                </span>
              </div>
              <p className="text-xs text-right text-[#5C4D43]">Đã bao gồm VAT</p>
            </div>
            
            <button 
              type="submit"
              form="checkout-form"
              disabled={isSubmitting}
              className="w-full bg-[#8C3D2B] hover:bg-[#40332B] disabled:bg-gray-400 text-white font-bold h-14 rounded-full shadow-lg flex items-center justify-center transition-colors text-lg"
            >
              {isSubmitting ? "Đang xử lý..." : "Đặt Hàng Ngay"}
            </button>
            <p className="text-xs text-center text-[#5C4D43] mt-4">
              Bằng cách nhấp vào "Đặt Hàng Ngay", bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của chúng tôi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
