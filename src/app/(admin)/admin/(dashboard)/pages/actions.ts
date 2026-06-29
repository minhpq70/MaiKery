"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function savePageContent(slug: string, content: string) {
  await prisma.pageContent.upsert({
    where: { slug },
    update: { content },
    create: { slug, content },
  });
  revalidatePath(`/${slug}`);
  revalidatePath("/admin/pages");
  return { success: true };
}
