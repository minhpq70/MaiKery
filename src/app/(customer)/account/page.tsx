"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/account");
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchProfile() {
      if (status !== "authenticated") return;
      try {
        const res = await fetch("/api/user/profile");
        const data = await res.json();
        if (data.success && data.user) {
          setFormData({
            name: data.user.name || "",
            email: data.user.email || "",
            phone: data.user.phone || "",
            address: data.user.address || "",
          });
        }
      } catch (error) {
        console.error("Failed to load profile", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: "Cập nhật thông tin thành công!" });
      } else {
        setMessage({ type: "error", text: data.error || "Lỗi cập nhật." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Đã xảy ra lỗi khi lưu thông tin." });
    } finally {
      setIsSaving(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="text-[#5C4D43] font-bold">Đang tải thông tin...</div>
      </div>
    );
  }

  if (status === "unauthenticated") return null;

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12 max-w-2xl">
      <h1 className="text-3xl font-serif font-bold text-[#40332B] mb-8">
        Thông Tin Cá Nhân
      </h1>

      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-[#F2E8D9]">
        <form onSubmit={handleSubmit} className="space-y-6">
          {message.text && (
            <div
              className={`p-4 rounded-xl text-sm font-bold ${
                message.type === "success"
                  ? "bg-green-50 text-green-600 border border-green-200"
                  : "bg-red-50 text-red-500 border border-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-[#5C4D43] mb-2">
              Email (Không thể thay đổi)
            </label>
            <input
              type="text"
              value={formData.email}
              disabled
              className="w-full p-3 rounded-xl border border-[#E5D5C5] bg-gray-50 text-gray-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[#5C4D43] mb-2">
              Họ & Tên
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full p-3 rounded-xl border border-[#E5D5C5] focus:ring-2 focus:ring-[#D96C4E] focus:outline-none"
              placeholder="Nhập họ và tên..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[#5C4D43] mb-2">
              Số điện thoại
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full p-3 rounded-xl border border-[#E5D5C5] focus:ring-2 focus:ring-[#D96C4E] focus:outline-none"
              placeholder="Nhập số điện thoại..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[#5C4D43] mb-2">
              Địa chỉ nhận hàng mặc định
            </label>
            <textarea
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              rows={3}
              className="w-full p-3 rounded-xl border border-[#E5D5C5] focus:ring-2 focus:ring-[#D96C4E] focus:outline-none"
              placeholder="Nhập địa chỉ nhà, tên đường, phường/xã, quận/huyện..."
            />
          </div>

          <div className="pt-4 border-t border-[#F2E8D9]">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full sm:w-auto px-8 bg-[#8C3D2B] hover:bg-[#40332B] disabled:bg-gray-400 text-white font-bold h-12 rounded-full shadow-lg flex items-center justify-center transition-colors text-base"
            >
              {isSaving ? "Đang lưu..." : "Lưu Thay Đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
