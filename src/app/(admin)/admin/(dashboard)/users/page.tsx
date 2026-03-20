import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Search } from "lucide-react";
import { format } from "date-fns";
import { UserActionsCell } from "@/components/admin/user-actions-cell";
import Link from "next/link";

export default async function AdminUsersPage(props: {
  searchParams: Promise<{ q?: string; role?: string }>;
}) {
  const searchParams = await props.searchParams;
  const session = await getServerSession(authOptions);
  
  const q = searchParams?.q || "";
  const roleFilter = searchParams?.role || "ALL";

  const where: any = {};

  if (q) {
    where.OR = [
      { email: { contains: q, mode: "insensitive" } },
      { name: { contains: q, mode: "insensitive" } },
      { phone: { contains: q } },
    ];
  }

  if (roleFilter !== "ALL") {
    where.role = roleFilter;
  }

  const users = await prisma.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Người dùng & Phân quyền</h1>
      </div>

      <div className="bg-white p-4 rounded-xl border border-[#E5D5C5] shadow-sm flex flex-col md:flex-row gap-4">
        <form className="flex-1 flex items-center gap-2">
           <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Tìm email, tên, SĐT..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D96C4E] focus:bg-white transition-all"
            />
          </div>
          <select 
            name="role" 
            defaultValue={roleFilter}
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D96C4E] focus:bg-white transition-all"
          >
            <option value="ALL">Tất cả vai trò</option>
            <option value="CUSTOMER">Khách hàng</option>
            <option value="ADMIN">Quản trị viên (Admin)</option>
          </select>
          <button type="submit" className="bg-[#D96C4E] hover:bg-[#C55A3D] text-white px-4 py-2 rounded-lg font-medium transition-colors">
            Lọc
          </button>
          {(q || roleFilter !== "ALL") && (
            <Link href="/admin/users" className="text-gray-500 hover:text-[#D96C4E] px-2 text-sm font-medium">
              Xóa lọc
            </Link>
          )}
        </form>
      </div>

      <div className="bg-white rounded-xl border border-[#E5D5C5] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#FFFBF5] text-[#5C4D43] font-medium border-b border-[#E5D5C5]">
              <tr>
                <th className="px-6 py-4">Tài khoản</th>
                <th className="px-6 py-4">Vai trò</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4">Ngày tham gia</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5D5C5]">
              {users.length > 0 ? (
                users.map((user) => {
                  const isCurrentUser = session?.user?.id === user.id;

                  return (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#40332B] flex items-center gap-2">
                          {user.name}
                          {isCurrentUser && (
                            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">Bạn</span>
                          )}
                        </div>
                        <div className="text-gray-500 text-sm">{user.email}</div>
                        {user.phone && <div className="text-gray-400 text-xs mt-0.5">{user.phone}</div>}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          user.role === "ADMIN" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700"
                        }`}>
                          {user.role === "ADMIN" ? "Admin" : "Khách hàng"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          user.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                          {user.isActive ? "Hoạt động" : "Bị khóa"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {format(new Date(user.createdAt), "dd/MM/yyyy")}
                      </td>
                      <td className="px-6 py-4">
                        {!isCurrentUser ? (
                          <UserActionsCell user={user} />
                        ) : (
                          <div className="text-right text-xs text-gray-400 italic">
                            Không thể sửa thẻ của chính mình
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Không tìm thấy người dùng
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
