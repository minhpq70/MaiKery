import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    // Optionally filter by productId
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');

    const recipes = await prisma.recipeVersion.findMany({
      where: productId ? { productId } : undefined,
      include: {
        product: true,
        items: {
          include: { material: true }
        }
      },
      orderBy: [
        { product: { name: 'asc' } },
        { versionNo: 'desc' }
      ]
    });
    return NextResponse.json(recipes);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const recipe = await prisma.recipeVersion.create({
      data: {
        productId: data.productId,
        versionNo: data.versionNo,
        name: data.name,
        note: data.note || data.notes,
        yieldQuantity: data.yieldQuantity,
        isDefault: data.isDefault,
        items: {
          create: data.items.map((i: any) => ({
            materialId: i.materialId,
            quantity: i.quantity,
            unit: i.unit,
            wastePercent: i.wastePercent || 0,
            note: i.note
          }))
        }
      },
      include: { items: true }
    });
    return NextResponse.json(recipe, { status: 201 });
  } catch (error) {
    console.error('Error creating recipe:', error);
    return NextResponse.json({ error: 'Failed to create recipe' }, { status: 500 });
  }
}
