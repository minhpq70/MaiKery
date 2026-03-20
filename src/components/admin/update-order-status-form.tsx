"use client";

import { useTransition, useState } from "react";
import { Order } from "@prisma/client";
import { updateOrderStatus } from "@/app/(admin)/admin/(dashboard)/orders/actions";
import { Loader2, Save } from "lucide-react";

export function UpdateOrderStatusForm({ order }: { order: Order }) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = (formData: FormData) => {
    setMessage({ type: "", text: "" });
    startTransition(async () => {
      try {
        await updateOrderStatus(formData);
        setMessage({ type: "success", text: "Đã cập nhật trạng thái đơn hàng" });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      } catch (err: any) {
        setMessage({ type: "error", text: "Lỗi: " + (err.message || "Đã xảy ra lỗi") });
      }
    });
  };

  return (
    <div className="bg-white rounded-xl border border-[#E5D5C5] shadow-sm overflow-hidden p-6">
      <h2 className="text-lg font-bold text-[#40332B] mb-4">Trạng thái đơn hàng</h2>
      
      <form action={handleSubmit} className="space-y-4">
        <input type="hidden" name="id" value={order.id} />
        
        {message.text && (
          <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-[#5C4D43] mb-1.5">Thanh toán</label>
          <select 
            name="paymentStatus"
            defaultValue={order.paymentStatus}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D96C4E] focus:bg-white transition-all font-medium"
          >
            <option value="UNPAID">Chưa thanh toán</option>
            <option value="PAID">Đã thanh toán / Đã nhận tiền</option>
            <option value="REFUNDED">Đã hoàn tiền</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#5C4D43] mb-1.5">Trạng thái Giao hàng</label>
          <select 
            name="deliveryStatus"
            defaultValue={order.deliveryStatus}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D96C4E] focus:bg-white transition-all font-medium"
          >
            <option value="PENDING">Chờ xác nhận</option>
            <option value="PREPARING">Đang chuẩn bị hàng</option>
            <option value="SHIPPING">Đang giao hàng</option>
            <option value="DELIVERED">Đã giao thành công</option>
            <option value="CANCELLED">Đã hủy đơn</option>
          </select>
        </div>

        <button 
          type="submit" 
          disabled={isPending} 
          className="w-full bg-[#40332B] hover:bg-[#2A211C] text-white px-4 py-2.5 rounded-lg font-medium transition-all disabled:opacity-70 flex items-center justify-center gap-2 mt-2"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Cập nhật trạng thái
        </button>
      </form>
    </div>
  );
}
