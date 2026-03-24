import { prisma } from '../prisma';
import { Prisma } from '@prisma/client';

export async function createBatchFromRecipe(
  recipeVersionId: string,
  plannedYield: number,
  batchDate: Date = new Date()
) {
  // 1. Fetch recipe
  const recipe = await prisma.recipeVersion.findUnique({
    where: { id: recipeVersionId },
    include: {
      items: true,
      product: true,
    }
  });

  if (!recipe) throw new Error('Recipe not found');

  // Scale factor based on planned yield vs recipe's default yield
  const scaleFactor = new Prisma.Decimal(plannedYield).div(recipe.yieldQuantity);

  // 2. Map recipe items to batch items
  // We also try to fetch the *latest* material cost to populate unitCostUsed right away
  const batchItemsData = [];
  
  for (const item of recipe.items) {
    const scaledQuantity = item.quantity.mul(scaleFactor);
    // Add waste if any
    let finalQuantity = scaledQuantity;
    if (item.wastePercent && item.wastePercent.greaterThan(0)) {
      const wasteMultiplier = item.wastePercent.div(100).add(1);
      finalQuantity = scaledQuantity.mul(wasteMultiplier);
    }

    // Try to find the latest material cost
    const latestSnapshot = await prisma.materialCostSnapshot.findFirst({
      where: { materialId: item.materialId },
      orderBy: { effectiveAt: 'desc' }
    });

    const unitCostUsed = latestSnapshot ? latestSnapshot.unitCost : new Prisma.Decimal(0);
    const lineCost = finalQuantity.mul(unitCostUsed);

    batchItemsData.push({
      materialId: item.materialId,
      quantity: finalQuantity,
      unit: item.unit,
      unitCostUsed,
      lineCost,
      sourceMethod: latestSnapshot ? latestSnapshot.costMethod : 'manual'
    });
  }

  // 3. Create the production batch in DB (as a draft initially)
  const batch = await prisma.productionBatch.create({
    data: {
      productId: recipe.productId,
      recipeVersionId: recipe.id,
      batchDate,
      plannedYield,
      actualYield: plannedYield, // Default safely, can be edited before finalizing
      packagingCost: recipe.product.packagingCostDefault || new Prisma.Decimal(0),
      overheadCost: recipe.product.overheadCostDefault || new Prisma.Decimal(0),
      items: {
        create: batchItemsData
      }
    },
    include: {
      items: true
    }
  });

  return batch;
}
