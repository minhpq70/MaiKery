import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/materials
export async function GET() {
  try {
    const materials = await prisma.material.findMany({
      orderBy: { name: 'asc' },
      include: {
        costSnapshots: {
          orderBy: { effectiveAt: 'desc' },
          take: 1
        }
      }
    });

    const enrichedMaterials = materials.map(m => {
      const currentCost = m.costSnapshots.length > 0 ? m.costSnapshots[0].unitCost : 0;
      const currentMethod = m.costSnapshots.length > 0 ? m.costSnapshots[0].costMethod : 'none';
      return { ...m, currentCost, currentMethod };
    });

    return NextResponse.json(enrichedMaterials);
  } catch (error) {
    console.error('Error fetching materials:', error);
    return NextResponse.json({ error: 'Failed to fetch materials' }, { status: 500 });
  }
}

// POST /api/materials
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const newMaterial = await prisma.material.create({
      data: {
        code: data.code,
        name: data.name,
        category: data.category,
        baseUnit: data.baseUnit,
        isActive: data.isActive
      }
    });
    return NextResponse.json(newMaterial, { status: 201 });
  } catch (error) {
    console.error('Error creating material:', error);
    return NextResponse.json({ error: 'Failed to create material' }, { status: 500 });
  }
}
