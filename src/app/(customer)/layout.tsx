import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex min-h-screen flex-col bg-[#FFFBF5]">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-[#F2E8D9] bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center">
              <Image src="/logo.png" alt="MaiKery Logo" width={140} height={40} className="object-contain h-10 w-auto" priority />
            </Link>
            <nav className="hidden md:flex gap-6 text-sm font-medium text-[#5C4D43]">
              <Link href="/products" className="hover:text-[#D96C4E] transition-colors">Sản phẩm</Link>
              <Link href="/about" className="hover:text-[#D96C4E] transition-colors">Về chúng tôi</Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative group p-2 hover:bg-[#FFFBF5] rounded-full transition-colors border border-transparent hover:border-[#F2E8D9]">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5C4D43" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-[#D96C4E] transition-colors"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>
            </Link>
            {session ? (
              <div className="flex items-center gap-4">
                <Link href="/account" className="text-sm font-medium text-[#5C4D43] hover:text-[#D96C4E]">
                  Tài khoản
                </Link>
                {session.user.role === "ADMIN" && (
                  <Link href="/admin" className="text-sm font-medium text-white bg-[#D96C4E] px-3 py-1.5 rounded hover:bg-[#8C3D2B] transition-colors">
                    Admin
                  </Link>
                )}
              </div>
            ) : (
              <Link href="/login" className="text-sm font-medium text-[#5C4D43] hover:text-[#D96C4E]">
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-[#40332B] text-[#F2E8D9] py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-serif font-bold mb-4 text-white">MaiKery</h3>
            <p className="text-sm text-[#D9CDB8]">Tiệm bánh thủ công làm từ trái tim. Chúng tôi mang đến những chiếc bánh tươi ngon mỗi ngày với nguyên liệu chọn lọc khắt khe nhất.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-white">Liên hệ</h4>
            <ul className="space-y-2 text-sm text-[#D9CDB8]">
              <li>Điện thoại: 0342858314</li>
              <li>Email: maikery.de@gmail.com</li>
              <li>Địa chỉ: Rừng Cọ - Ecopark</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-white">Chính sách</h4>
            <ul className="space-y-2 text-sm text-[#D9CDB8]">
              <li><Link href="/terms" className="hover:text-white transition-colors">Điều khoản dịch vụ</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Chính sách bảo mật</Link></li>
              <li><Link href="/delivery" className="hover:text-white transition-colors">Chính sách giao hàng</Link></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-[#5C4D43] text-sm text-center text-[#D9CDB8]">
          &copy; {new Date().getFullYear()} MaiKery.de. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
