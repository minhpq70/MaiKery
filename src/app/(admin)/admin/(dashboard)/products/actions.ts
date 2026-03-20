"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function saveProduct(formData: FormData) {
  const id = formData.get("id") as string;
  const productCode = formData.get("productCode") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const imageUrl = formData.get("image") as string;
  const salePrice = Number(formData.get("price"));
  const isActive = formData.get("active") === "on";

  const data = { productCode, name, description, imageUrl, salePrice, isActive };

  if (id) {
    await prisma.product.update({ where: { id }, data });
  } else {
    await prisma.product.create({ data });
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({ where: { id } });
    revalidatePath("/admin/products");
    revalidatePath("/products");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Không thể xóa sản phẩm này. Có thể sản phẩm đã có đơn hàng." };
  }
}
