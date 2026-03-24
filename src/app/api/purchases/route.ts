import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { recomputeMaterialCosts } from '@/lib/costing/recomputeMaterialCosts';

export async function GET() {
  try {
    const purchases = await prisma.purchase.findMany({
      orderBy: { purchaseDate: 'desc' },
      include: { supplier: true, items: { include: { material: true } } }
    });
    return NextResponse.json(purchases);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch purchases' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Create Purchase and PurchaseItems
    const purchase = await prisma.purchase.create({
      data: {
        supplierId: data.supplierId,
        purchaseDate: new Date(data.purchaseDate || new Date()),
        source: data.source || 'manual',
        invoiceNo: data.invoiceNo,
        totalAmount: data.totalAmount,
        note: data.note,
        items: {
          create: data.items.map((i: any) => ({
            materialId: i.materialId,
            itemNameRaw: i.itemNameRaw,
            quantity: i.quantity,
            unit: i.unit,
            conversionRate: i.conversionRate,
            quantityBase: i.quantityBase,
            amount: i.amount,
            unitCostBase: i.unitCostBase,
          }))
        }
      },
      include: { items: true }
    });

    // Automatically trigger material recalculations
    const materialIds = new Set<string>();
    purchase.items.forEach((item: any) => materialIds.add(item.materialId));

    for (const matId of Array.from(materialIds)) {
      await recomputeMaterialCosts(matId, 'weighted_average');
    }

    return NextResponse.json(purchase, { status: 201 });
  } catch (error) {
    console.error('Error creating purchase:', error);
    return NextResponse.json({ error: 'Failed to create purchase' }, { status: 500 });
  }
}
