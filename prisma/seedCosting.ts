import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('🌱 Starting Costing Module Seeding...');

  // 1. Create Suppliers
  const nhatHuong = await prisma.supplier.create({
    data: { name: 'Tân Nhất Hương', phone: '0901234567', note: 'Chuyên bơ, sữa, kem' }
  });
  const sieuThi = await prisma.supplier.create({
    data: { name: 'Siêu thị Co.opmart', note: 'Mua lẻ, đồ gấp' }
  });
  console.log('✅ Created Suppliers');

  // 2. Create Base Materials
  const flour = await prisma.material.create({
    data: { code: 'MAT-FLOUR', name: 'Bột mì đa dụng', category: 'Bột', baseUnit: 'g' }
  });
  const sugar = await prisma.material.create({
    data: { code: 'MAT-SUGAR', name: 'Đường kính trắng', category: 'Gia vị', baseUnit: 'g' }
  });
  const butter = await prisma.material.create({
    data: { code: 'MAT-BUTTER', name: 'Bơ nhạt Anchor', category: 'Bơ sữa', baseUnit: 'g' }
  });
  const egg = await prisma.material.create({
    data: { code: 'MAT-EGG', name: 'Trứng gà', category: 'Tươi sống', baseUnit: 'qua' }
  });
  console.log('✅ Created Materials');

  // 3. Create a dummy Purchase
  const purchase = await prisma.purchase.create({
    data: {
      supplierId: nhatHuong.id,
      purchaseDate: new Date(),
      source: 'manual',
      invoiceNo: 'INV-001',
      totalAmount: 450000,
      note: 'Nhập nguyên liệu đầu tháng',
      items: {
        create: [
          {
            materialId: flour.id,
            itemNameRaw: 'Bột mì đa dụng 1kg',
            quantity: 5,
            unit: 'kg',
            conversionRate: 1000,
            quantityBase: 5000,
            amount: 100000,
            unitCostBase: 20, // 20đ/g
          },
          {
            materialId: butter.id,
            itemNameRaw: 'Bơ nhạt Anchor 1kg',
            quantity: 2,
            unit: 'kg',
            conversionRate: 1000,
            quantityBase: 2000,
            amount: 350000,
            unitCostBase: 175, // 175đ/g
          }
        ]
      }
    }
  });

  const purchase2 = await prisma.purchase.create({
    data: {
      supplierId: sieuThi.id,
      purchaseDate: new Date(),
      source: 'manual',
      totalAmount: 60000,
      items: {
        create: [
          {
            materialId: egg.id,
            itemNameRaw: 'Vỉ 10 trứng gà',
            quantity: 2,
            unit: 'hop',
            conversionRate: 10,
            quantityBase: 20,
            amount: 60000,
            unitCostBase: 3000, // 3000đ/qua
          }
        ]
      }
    }
  });
  
  console.log('✅ Created Purchases');

  // 4. Create manual cost snapshots to bootstrap (in real flow, this is done by a service on Purchase save)
  await prisma.materialCostSnapshot.createMany({
    data: [
      {
        materialId: flour.id,
        costMethod: 'latest',
        unitCost: 20,
        effectiveAt: new Date(),
      },
      {
        materialId: butter.id,
        costMethod: 'latest',
        unitCost: 175,
        effectiveAt: new Date(),
      },
      {
        materialId: egg.id,
        costMethod: 'latest',
        unitCost: 3000,
        effectiveAt: new Date(),
      },
      {
        materialId: sugar.id,
        costMethod: 'manual',
        unitCost: 25, // 25k/kg = 25đ/g
        effectiveAt: new Date(),
      }
    ]
  });
  console.log('✅ Created Material Cost Snapshots');

  // 5. Setup a Product and Recipe Dummy
  // Usually product already exists, let's just make a new one for testing
  const p = await prisma.product.create({
    data: {
      productCode: 'CAKE-BT',
      name: 'Bánh mì bơ tỏi',
      description: 'Bánh mì bơ tỏi siêu ngon',
      salePrice: 35000,
      targetMarginPercent: 60,
      defaultYield: 10,
      packagingCostDefault: 2000,
      overheadCostDefault: 1000,
    }
  });

  const rv = await prisma.recipeVersion.create({
    data: {
      productId: p.id,
      versionNo: 1,
      name: 'Bản chuẩn 2024',
      yieldQuantity: 10,
      isDefault: true,
      items: {
        create: [
          { materialId: flour.id, quantity: 500, unit: 'g' }, // 500g bột
          { materialId: butter.id, quantity: 150, unit: 'g' }, // 150g bơ
          { materialId: egg.id, quantity: 2, unit: 'qua' }, // 2 quả trứng
          { materialId: sugar.id, quantity: 50, unit: 'g' }, // 50g đường
        ]
      }
    }
  });
  console.log('✅ Created Product and Recipe Version');

  console.log('🎉 Seeding Costing Module completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
