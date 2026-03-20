import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@maikery.vn";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);

  // 1. Create Admin User
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "MaiKery Admin",
      password: hashedAdminPassword,
      role: "ADMIN",
    },
  });

  console.log("Admin user created:", admin.email);

  // 2. Create Sample Products
  const products = [
    {
      productCode: "MK-CRO-01",
      name: "Bánh Croissant Bơ Pháp",
      description: "Bánh sừng bò truyền thống với lớp vỏ giòn tan và hương bơ Pháp thơm ngậy.",
      salePrice: 35000,
      isFeatured: true,
      imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop",
    },
    {
      productCode: "MK-MAC-01",
      name: "Macaron Sắc Màu (Hộp 6 cái)",
      description: "Bộ sưu tập Macaron với 6 hương vị: Dâu, Trà xanh, Chocolate, Vani, Việt quất và Chanh dây.",
      salePrice: 150000,
      isFeatured: true,
      imageUrl: "https://images.unsplash.com/photo-1569864358642-9d1619702661?q=80&w=1000&auto=format&fit=crop",
    },
    {
      productCode: "MK-TAR-01",
      name: "Tiramisu Cổ Điển",
      description: "Sự kết hợp hoàn hảo giữa phô mai Mascarpone, cà phê Espresso và cốt bánh mền mịn.",
      salePrice: 65000,
      isFeatured: true,
      imageUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=1000&auto=format&fit=crop",
    },
    {
      productCode: "MK-BRW-01",
      name: "Brownie Chocolate Hạnh Nhân",
      description: "Bánh Brownie đậm vị chocolate nguyên chất kết hợp cùng hạnh nhân lát giòn rụm.",
      salePrice: 45000,
      isFeatured: true,
      imageUrl: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=1000&auto=format&fit=crop",
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { productCode: p.productCode },
      update: p,
      create: p,
    });
  }

  console.log("Sample products created.");

  // 3. Create Site Settings
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      storeName: "MaiKery",
      storeEmail: "contact@maikery.vn",
      storePhone: "0901234567",
      storeAddress: "123 Đường Bánh Ngọt, Quận 1, TP. Hồ Chí Minh",
      bankName: "Vietcombank",
      bankShortName: "VCB",
      bankAccount: "1234567890",
      bankBin: "970436",
    },
  });

  console.log("Default site settings created.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
