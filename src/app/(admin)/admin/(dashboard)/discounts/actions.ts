"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function saveDiscount(formData: FormData) {
  const id = formData.get("id") as string;
  const code = (formData.get("code") as string).toUpperCase();
  const discountType = formData.get("discountType") as "PERCENTAGE" | "FIXED_AMOUNT";
  const discountValue = Number(formData.get("discountValue"));
  const minimumOrderValue = formData.get("minimumOrderValue") ? Number(formData.get("minimumOrderValue")) : null;
  const usageLimit = formData.get("usageLimit") ? Number(formData.get("usageLimit")) : null;
  const active = formData.get("active") === "on";
  
  const expiresAtStr = formData.get("expiresAt") as string;
  const expiresAt = expiresAtStr ? new Date(expiresAtStr) : null;

  const data = { 
    code, 
    discountType, 
    discountValue, 
    minimumOrderValue, 
    usageLimit, 
    expiresAt, 
    active 
  };

  if (id) {
    await prisma.discountCode.update({ where: { id }, data });
  } else {
    // Check if code exists
    const existing = await prisma.discountCode.findUnique({ where: { code } });
    if (existing) {
      throw new Error("Mã khuyến mãi này đã tồn tại.");
    }
    await prisma.discountCode.create({ data });
  }

  revalidatePath("/admin/discounts");
  redirect("/admin/discounts");
}

export async function deleteDiscount(id: string) {
  try {
    await prisma.discountCode.delete({ where: { id } });
    revalidatePath("/admin/discounts");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Không thể xóa mã khuyến mãi này. Có thể mã đã được sử dụng trong đơn hàng." };
  }
}
