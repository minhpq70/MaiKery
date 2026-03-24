import { prisma } from '../prisma';
import { Prisma } from '@prisma/client';

export async function recomputeMaterialCosts(materialId: string, costMethod: 'latest' | 'weighted_average' = 'latest') {
  // Fetch material and all its purchase history
  const material = await prisma.material.findUnique({
    where: { id: materialId },
    include: {
      purchaseItems: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!material || material.purchaseItems.length === 0) return null;

  let newUnitCost = new Prisma.Decimal(0);

  if (costMethod === 'latest') {
    // Just take the exact unit cost set on the most recent purchase
    const latestItem = material.purchaseItems[0];
    newUnitCost = latestItem.unitCostBase;
  } else if (costMethod === 'weighted_average') {
    // (Total Cost of All Purchases) / (Total Quantities)
    let totalValue = new Prisma.Decimal(0);
    let totalQuantity = new Prisma.Decimal(0);

    for (const item of material.purchaseItems) {
      totalValue = totalValue.add(item.amount);
      totalQuantity = totalQuantity.add(item.quantityBase);
    }

    if (totalQuantity.greaterThan(0)) {
      newUnitCost = totalValue.div(totalQuantity);
    }
  }

  // Create a new snapshot to reflect the updated cost
  const snapshot = await prisma.materialCostSnapshot.create({
    data: {
      materialId: material.id,
      costMethod,
      unitCost: newUnitCost,
      effectiveAt: new Date(),
      note: `Auto-computed via ${costMethod}`
    }
  });

  return snapshot;
}
