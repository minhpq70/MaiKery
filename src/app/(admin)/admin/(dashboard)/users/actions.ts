"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function toggleUserStatus(userId: string) {
  const session = await getServerSession(authOptions);
  
  if (session?.user?.id === userId) {
    throw new Error("Bạn không thể khóa tài khoản của chính mình");
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("Không tìm thấy người dùng");

  await prisma.user.update({
    where: { id: userId },
    data: { isActive: !user.isActive },
  });

  revalidatePath("/admin/users");
  return { success: true, isActive: !user.isActive };
}

export async function changeUserRole(userId: string, newRole: "ADMIN" | "CUSTOMER") {
  const session = await getServerSession(authOptions);
  
  if (session?.user?.id === userId) {
    throw new Error("Bạn không thể thay đổi quyền của chính mình");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
  });

  revalidatePath("/admin/users");
  return { success: true, newRole };
}
