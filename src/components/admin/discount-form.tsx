"use client";

import { useTransition, useState } from "react";
import { DiscountCode } from "@prisma/client";
import { saveDiscount } from "@/app/(admin)/admin/(dashboard)/discounts/actions";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function DiscountForm({ discount }: { discount?: DiscountCode }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleSubmit = (formData: FormData) => {
    setError("");
    startTransition(async () => {
      try {
        await saveDiscount(formData);
      } catch (err: any) {
        setError(err.message || "Đã xảy ra lỗi");
      }
    });
  };

  return (
    <form 
      action={handleSubmit} 
      className="space-y-6 max-w-2xl bg-white p-6 md:p-8 rounded-xl border border-[#E5D5C5] shadow-sm"
    >
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-100">
          {error}
        </div>
      )}
      
      {discount && <input type="hidden" name="id" value={discount.id} />}

      <div>
        <label className="block text-sm font-medium text-[#5C4D43] mb-1.5">Mã khuyến mãi</label>
        <input 
          name="code" 
          required 
          defaultValue={discount?.code} 
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D96C4E] focus:bg-white transition-all uppercase"
          placeholder="VD: WELCOME10"
        />
        <p className="text-xs text-gray-500 mt-2">Viết liền không dấu. Khách hàng sẽ nhập mã này ở bước thanh toán.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-[#5C4D43] mb-1.5">Loại giảm giá</label>
          <select 
            name="discountType"
            defaultValue={discount?.discountType || "PERCENTAGE"}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D96C4E] focus:bg-white transition-all"
          >
            <option value="PERCENTAGE">Phần trăm (%)</option>
            <option value="FIXED_AMOUNT">Số tiền cố định (VNĐ)</option>
          </select>
        </div>

        <div>
           <label className="block text-sm font-medium text-[#5C4D43] mb-1.5">Mức giảm</label>
          <input 
            name="discountValue" 
            type="number" 
            required 
            min="0" 
            defaultValue={discount?.discountValue?.toString()} 
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D96C4E] focus:bg-white transition-all"
            placeholder="VD: 10 hoặc 50000"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
           <label className="block text-sm font-medium text-[#5C4D43] mb-1.5">Giá trị đơn tối thiểu (VNĐ)</label>
          <input 
            name="minimumOrderValue" 
            type="number" 
            min="0" 
            defaultValue={discount?.minimumOrderValue?.toString() || ""} 
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D96C4E] focus:bg-white transition-all"
            placeholder="Tùy chọn. VD: 150000"
          />
        </div>

        <div>
           <label className="block text-sm font-medium text-[#5C4D43] mb-1.5">Giới hạn số lần dùng</label>
          <input 
            name="usageLimit" 
            type="number" 
            min="1" 
            defaultValue={discount?.usageLimit?.toString() || ""} 
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D96C4E] focus:bg-white transition-all"
            placeholder="Tùy chọn. VD: 100"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#5C4D43] mb-1.5">Ngày hết hạn</label>
        <input 
          name="expiresAt" 
          type="datetime-local" 
          defaultValue={discount?.expiresAt ? new Date(discount.expiresAt.getTime() - discount.expiresAt.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ""}
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D96C4E] focus:bg-white transition-all"
        />
        <p className="text-xs text-gray-500 mt-2">Để trống nếu không có thời hạn.</p>
      </div>

      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
        <input 
          name="active" 
          type="checkbox" 
          defaultChecked={discount ? discount.active : true} 
          id="active"
          className="w-5 h-5 text-[#D96C4E] rounded border-gray-300 focus:ring-[#D96C4E]"
        />
        <div>
          <label htmlFor="active" className="text-sm font-bold text-[#40332B] cursor-pointer">Kích hoạt mã</label>
          <p className="text-xs text-gray-500">Khách hàng có thể sử dụng mã này ngay lập tức</p>
        </div>
      </div>

      <div className="pt-4 flex items-center gap-4 border-t border-gray-100">
        <button 
          type="submit" 
          disabled={isPending} 
          className="bg-[#D96C4E] hover:bg-[#C55A3D] text-white px-6 py-2.5 rounded-lg font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          {discount ? "Lưu thay đổi" : "Tạo mã khuyến mãi"}
        </button>
        <Link 
          href="/admin/discounts"
          className="text-[#5C4D43] font-medium hover:text-[#D96C4E] transition-colors"
        >
          Hủy bỏ
        </Link>
      </div>
    </form>
  )
}
