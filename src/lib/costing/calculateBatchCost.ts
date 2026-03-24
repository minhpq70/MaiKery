import { prisma } from '../prisma';
import { Prisma } from '@prisma/client';

export async function calculateBatchCost(productionBatchId: string) {
  const batch = await prisma.productionBatch.findUnique({
    where: { id: productionBatchId },
    include: { items: true }
  });

  if (!batch) throw new Error('Batch not found');

  let totalMaterialCost = new Prisma.Decimal(0);

  // Re-sum the material lines just to be safe
  for (const item of batch.items) {
    totalMaterialCost = totalMaterialCost.add(item.lineCost);
  }

  const packaging = batch.packagingCost || new Prisma.Decimal(0);
  const overhead = batch.overheadCost || new Prisma.Decimal(0);

  const totalBatchCost = totalMaterialCost.add(packaging).add(overhead);

  let unitCost = new Prisma.Decimal(0);
  if (batch.actualYield > 0) {
    unitCost = totalBatchCost.div(batch.actualYield);
  }

  // Update batch with finalized costs
  const updatedBatch = await prisma.productionBatch.update({
    where: { id: batch.id },
    data: {
      totalMaterialCost,
      totalBatchCost,
      unitCost
    }
  });

  return updatedBatch;
}
