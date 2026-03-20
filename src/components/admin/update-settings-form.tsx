"use client";

import { useTransition, useState } from "react";
import { updateSiteSettings } from "@/app/(admin)/admin/(dashboard)/settings/actions";
import { SiteSettings } from "@prisma/client";
import { Loader2, Save, Store, CreditCard } from "lucide-react";

export function UpdateSettingsForm({ settings }: { settings: SiteSettings | null }) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = (formData: FormData) => {
    setMessage({ type: "", text: "" });
    startTransition(async () => {
      try {
        await updateSiteSettings(formData);
        setMessage({ type: "success", text: "Đã lưu cài đặt" });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      } catch (err: any) {
        setMessage({ type: "error", text: "Lỗi: " + (err.message || "Đã xảy ra lỗi") });
      }
    });
  };

  return (
    <form action={handleSubmit} className="space-y-8">
      {message.text && (
        <div className={`p-4 rounded-lg font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      {/* Store Info */}
      <div className="bg-white rounded-xl border border-[#E5D5C5] shadow-sm overflow-hidden">
        <div className="bg-[#FFFBF5] px-6 py-4 border-b border-[#E5D5C5]">
          <h2 className="text-lg font-bold text-[#40332B] flex items-center gap-2">
            <Store className="w-5 h-5 text-[#D96C4E]" />
            Thông tin cửa hàng
          </h2>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#5C4D43] mb-1.5">Tên cửa hàng</label>
            <input 
              type="text" 
              name="storeName" 
              defaultValue={settings?.storeName || "MaiKery"}
              required
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D96C4E] focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#5C4D43] mb-1.5">Số điện thoại</label>
            <input 
              type="text" 
              name="storePhone" 
              defaultValue={settings?.storePhone || ""}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D96C4E] focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#5C4D43] mb-1.5">Email liên hệ</label>
            <input 
              type="email" 
              name="storeEmail" 
              defaultValue={settings?.storeEmail || ""}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D96C4E] focus:bg-white transition-all"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[#5C4D43] mb-1.5">Địa chỉ</label>
            <input 
              type="text" 
              name="storeAddress" 
              defaultValue={settings?.storeAddress || ""}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D96C4E] focus:bg-white transition-all"
            />
          </div>
        </div>
      </div>

      {/* Payment Info */}
      <div className="bg-white rounded-xl border border-[#E5D5C5] shadow-sm overflow-hidden">
        <div className="bg-[#FFFBF5] px-6 py-4 border-b border-[#E5D5C5]">
          <h2 className="text-lg font-bold text-[#40332B] flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#D96C4E]" />
            Tài khoản ngân hàng (Tạo mã QR)
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Thông tin này dùng để hiển thị mã VietQR cho khách hàng thanh toán chuyển khoản. Tra cứu BIN ngân hàng tại <a href="https://api.vietqr.io/v2/banks" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">vietqr.io</a>
          </p>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#5C4D43] mb-1.5">BIN Ngân hàng (Ví dụ: 970415 cho VietinBank)</label>
            <input 
              type="text" 
              name="bankBin" 
              defaultValue={settings?.bankBin || ""}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D96C4E] focus:bg-white transition-all font-mono"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#5C4D43] mb-1.5">Tên viết tắt Ngân hàng (Ví dụ: VietinBank)</label>
            <input 
              type="text" 
              name="bankShortName" 
              defaultValue={settings?.bankShortName || ""}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D96C4E] focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#5C4D43] mb-1.5">Số tài khoản</label>
            <input 
              type="text" 
              name="bankAccount" 
              defaultValue={settings?.bankAccount || ""}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D96C4E] focus:bg-white transition-all font-mono"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#5C4D43] mb-1.5">Tên chủ tài khoản (Viết HOA không dấu)</label>
            <input 
              type="text" 
              name="bankName" 
              defaultValue={settings?.bankName || ""}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D96C4E] focus:bg-white transition-all font-mono uppercase"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button 
          type="submit" 
          disabled={isPending} 
          className="bg-[#D96C4E] hover:bg-[#C55A3D] text-white px-8 py-3 rounded-lg font-bold transition-all disabled:opacity-70 flex items-center gap-2"
        >
          {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Lưu thay đổi
        </button>
      </div>
    </form>
  );
}
