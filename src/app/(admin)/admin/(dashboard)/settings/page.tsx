import { prisma } from "@/lib/prisma";
import { UpdateSettingsForm } from "@/components/admin/update-settings-form";

export default async function AdminSettingsPage() {
  let settings = await prisma.siteSettings.findUnique({
    where: { id: "default" },
  });

  if (!settings) {
    settings = await prisma.siteSettings.create({
      data: {
        id: "default",
        storeName: "MaiKery",
      }
    });
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold">Cài đặt Hệ thống</h1>
      <UpdateSettingsForm settings={settings} />
    </div>
  );
}
