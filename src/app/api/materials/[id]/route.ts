import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/materials/[id]
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const material = await prisma.material.findUnique({
      where: { id: resolvedParams.id },
      include: {
        costSnapshots: {
          orderBy: { effectiveAt: 'desc' },
          take: 5
        }
      }
    });
    if (!material) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(material);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch material' }, { status: 500 });
  }
}

// PUT /api/materials/[id]
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const data = await req.json();
    const updated = await prisma.material.update({
      where: { id: resolvedParams.id },
      data: {
        code: data.code,
        name: data.name,
        category: data.category,
        baseUnit: data.baseUnit,
        isActive: data.isActive
      }
    });

    // Handle manual cost snapshot update if provided
    if (data.manualCost !== undefined) {
      await prisma.materialCostSnapshot.create({
        data: {
          materialId: resolvedParams.id,
          costMethod: 'manual',
          unitCost: data.manualCost,
          effectiveAt: new Date(),
          note: 'Manual override via Admin UI'
        }
      });
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update material' }, { status: 500 });
  }
}

// DELETE /api/materials/[id]
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    await prisma.material.delete({
      where: { id: resolvedParams.id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete material. Check dependencies.' }, { status: 400 });
  }
}
