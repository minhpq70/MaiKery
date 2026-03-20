"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(formData: FormData) {
  const id = formData.get("id") as string;
  const paymentStatus = formData.get("paymentStatus") as "UNPAID" | "PAID" | "REFUNDED";
  const deliveryStatus = formData.get("deliveryStatus") as "PENDING" | "PREPARING" | "SHIPPING" | "DELIVERED" | "CANCELLED";

  if (!id) {
    throw new Error("Mã đơn hàng không hợp lệ");
  }

  await prisma.order.update({
    where: { id },
    data: {
      paymentStatus,
      deliveryStatus,
    },
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  
  return { success: true };
}
