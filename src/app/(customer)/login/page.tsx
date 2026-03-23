"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, AtSign, Loader2 } from "lucide-react";

export default function CustomerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Email hoặc mật khẩu không chính xác");
      } else {
        router.push("/account");
        router.refresh();
      }
    } catch (error) {
      setError("Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 md:py-24 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-[#40332B] mb-2">Đăng Nhập</h1>
          <p className="text-[#5C4D43]">Chào mừng bạn trở lại với MaiKery</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-[#F2E8D9]">
          <div className="p-8">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 text-center border border-red-100">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#5C4D43] mb-1.5">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <AtSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D96C4E] focus:bg-white transition-all"
                    placeholder="nguyenvana@gmail.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#5C4D43] mb-1.5">Mật khẩu</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D96C4E] focus:bg-white transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#D96C4E] hover:bg-[#C55A3D] text-white py-3 rounded-lg font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Đăng nhập"}
              </button>
            </form>
          </div>
          <div className="bg-[#FFFBF5] py-5 border-t border-[#F2E8D9] text-center px-8 flex flex-col gap-2">
            <p className="text-sm text-[#5C4D43]">
              Chưa có tài khoản?{" "}
              <Link href="/register" className="font-bold text-[#D96C4E] hover:underline">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
