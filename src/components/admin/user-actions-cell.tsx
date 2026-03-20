"use client";

import { useTransition, useState } from "react";
import { Role, User } from "@prisma/client";
import { toggleUserStatus, changeUserRole } from "@/app/(admin)/admin/(dashboard)/users/actions";
import { ShieldAlert, ShieldCheck, Lock, Unlock, Loader2, AlertCircle } from "lucide-react";

export function UserActionsCell({ user }: { user: User }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleToggleStatus = () => {
    if (!confirm(user.isActive ? `Khóa tài khoản ${user.name}?` : `Mở khóa tài khoản ${user.name}?`)) return;
    
    setError("");
    startTransition(async () => {
      try {
        await toggleUserStatus(user.id);
      } catch (err: any) {
        setError(err.message || "Đã xảy ra lỗi");
      }
    });
  };

  const handleRoleChange = () => {
    const newRole = user.role === "ADMIN" ? "CUSTOMER" : "ADMIN";
    if (!confirm(`Chuyển ${user.name} thành ${newRole === "ADMIN" ? "Quản trị viên" : "Khách hàng"}?`)) return;
    
    setError("");
    startTransition(async () => {
      try {
        await changeUserRole(user.id, newRole);
      } catch (err: any) {
        setError(err.message || "Đã xảy ra lỗi");
      }
    });
  };

  return (
    <div className="flex flex-col gap-2 items-end">
      {error && <div className="text-xs text-red-500 font-medium whitespace-nowrap">{error}</div>}
      <div className="flex gap-2">
        <button
          onClick={handleRoleChange}
          disabled={isPending}
          className={`p-1.5 rounded transition-colors ${
            user.role === "ADMIN" 
              ? "text-blue-600 hover:bg-blue-50 bg-blue-50/50" 
              : "text-gray-500 hover:bg-gray-100 bg-gray-50"
          }`}
          title={user.role === "ADMIN" ? "Hạ quyền thành Khách hàng" : "Cấp quyền Admin"}
        >
          {user.role === "ADMIN" ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
        </button>

        <button
          onClick={handleToggleStatus}
          disabled={isPending}
          className={`p-1.5 rounded transition-colors flex items-center gap-1.5 text-xs font-medium ${
            user.isActive 
              ? "text-red-600 hover:bg-red-50 bg-red-50/50" 
              : "text-green-600 hover:bg-green-50 bg-green-50/50"
          }`}
          title={user.isActive ? "Khóa tài khoản" : "Mở khóa tài khoản"}
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : user.isActive ? (
            <>
              <Lock className="w-4 h-4" />
              Khóa
            </>
          ) : (
            <>
              <Unlock className="w-4 h-4" />
              Mở khóa
            </>
          )}
        </button>
      </div>
    </div>
  );
}
