"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Lock, AtSign, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
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
        router.push("/admin");
        router.refresh();
      }
    } catch (error) {
      setError("Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#40332B] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10 flex flex-col items-center">
          <Link href="/" className="inline-block bg-white/90 p-3 rounded-xl mb-2">
            <Image src="/logo.jpg" alt="MaiKery Logo" width={180} height={60} className="object-contain h-14 w-auto" priority />
          </Link>
          <p className="text-gray-300 mt-2 tracking-wide text-sm uppercase">Trang Quản Trị Hệ Thống</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-[#40332B] mb-6 text-center">Đăng Nhập</h2>
            
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
                    placeholder="admin@maikery.com"
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
                className="w-full bg-[#D96C4E] hover:bg-[#C55A3D] text-white py-3 rounded-lg font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Truy cập hệ thống"}
              </button>
            </form>
          </div>
          <div className="bg-gray-50 py-4 border-t border-gray-100 text-center">
            <Link href="/" className="text-sm font-medium text-[#5C4D43] hover:text-[#D96C4E] transition-colors">
              &larr; Quay lại trang chủ MaiKery
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
