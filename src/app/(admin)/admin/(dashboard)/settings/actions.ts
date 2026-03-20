"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateSiteSettings(formData: FormData) {
  const bankBin = formData.get("bankBin") as string || "";
  const bankAccount = formData.get("bankAccount") as string || "";
  const bankName = formData.get("bankName") as string || "";
  const bankShortName = formData.get("bankShortName") as string || "";
  const storeName = formData.get("storeName") as string || "MaiKery";
  const storePhone = formData.get("storePhone") as string || "";
  const storeEmail = formData.get("storeEmail") as string || "";
  const storeAddress = formData.get("storeAddress") as string || "";

  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {
      bankBin,
      bankAccount,
      bankName,
      bankShortName,
      storeName,
      storePhone,
      storeEmail,
      storeAddress,
    },
    create: {
      id: "default",
      bankBin,
      bankAccount,
      bankName,
      bankShortName,
      storeName,
      storePhone,
      storeEmail,
      storeAddress,
    },
  });

  revalidatePath("/admin/settings");
  revalidatePath("/");
  return { success: true };
}
