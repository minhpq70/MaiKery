import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createBatchFromRecipe } from '@/lib/costing/createBatchFromRecipe';
import { calculateBatchCost } from '@/lib/costing/calculateBatchCost';

export async function GET() {
  try {
    const batches = await prisma.productionBatch.findMany({
      orderBy: { batchDate: 'desc' },
      include: {
        product: true,
        recipeVersion: true,
      }
    });
    return NextResponse.json(batches);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const batch = await createBatchFromRecipe(
      data.recipeVersionId,
      data.plannedYield,
      new Date(data.batchDate)
    );
    return NextResponse.json(batch, { status: 201 });
  } catch (error: any) {
    console.error('Error creating batch:', error);
    return NextResponse.json({ error: error.message || 'Failed to create batch' }, { status: 400 });
  }
}

// Example: PUT to finalize actual yield
export async function PUT(req: Request) {
  try {
    const data = await req.json();
    // 1. update actual yield
    await prisma.productionBatch.update({
      where: { id: data.batchId },
      data: { actualYield: data.actualYield }
    });
    // 2. recalculate final cost
    const updated = await calculateBatchCost(data.batchId);
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
