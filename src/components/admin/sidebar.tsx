"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Settings, 
  Users, 
  TicketPercent,
  LogOut,
  CircleDollarSign,
  FlaskConical,
  ShoppingBag,
  BookOpen,
  Layers,
} from "lucide-react";
import { signOut } from "next-auth/react";

const navItems = [
  { name: "Tổng quan", href: "/admin", icon: LayoutDashboard },
  { name: "Doanh thu", href: "/admin/revenue", icon: CircleDollarSign },
  { name: "Sản phẩm", href: "/admin/products", icon: Package },
  { name: "Đơn hàng", href: "/admin/orders", icon: ShoppingCart },
  { name: "Mã giảm giá", href: "/admin/discounts", icon: TicketPercent },
  { name: "Tài khoản", href: "/admin/users", icon: Users },
  { name: "Cài đặt", href: "/admin/settings", icon: Settings },
];

const costingItems = [
  { name: "Nguyên liệu", href: "/admin/costing/materials", icon: FlaskConical },
  { name: "Nhập hàng", href: "/admin/costing/purchases", icon: ShoppingBag },
  { name: "Công thức", href: "/admin/costing/recipes", icon: BookOpen },
  { name: "Lô sản xuất", href: "/admin/costing/batches", icon: Layers },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 bg-[#40332B] text-white min-h-screen">
      <div className="p-6">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="bg-white/90 p-1.5 rounded-lg flex items-center justify-center">
            <Image src="/logo.jpg" alt="MaiKery Logo" width={120} height={32} className="object-contain h-8 w-auto" priority />
          </div>
          <span className="text-xs font-bold bg-[#D96C4E] text-white px-2 py-0.5 rounded-full ml-1">ADMIN</span>
        </Link>
      </div>

      <div className="flex-1 py-6 overflow-y-auto">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/admin");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive 
                    ? "bg-[#D96C4E] text-white" 
                    : "text-gray-300 hover:bg-[#5C4D43] hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-4 mx-3 border-t border-[#5C4D43]" />
        <p className="px-6 pt-4 pb-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
          Tính giá thành
        </p>
        <nav className="space-y-1 px-3">
          {costingItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? "bg-[#D96C4E] text-white"
                    : "text-gray-300 hover:bg-[#5C4D43] hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-[#5C4D43]">
        <button 
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-left text-gray-300 hover:bg-[#5C4D43] hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
}
