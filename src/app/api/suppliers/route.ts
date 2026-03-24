import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/suppliers - list all suppliers
export async function GET() {
  try {
    const suppliers = await prisma.supplier.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(suppliers);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Không thể tải danh sách nhà cung cấp" }, { status: 500 });
  }
}

// POST /api/suppliers - create a new supplier
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, address, note } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Tên nhà cung cấp không được để trống" }, { status: 400 });
    }

    const supplier = await prisma.supplier.create({
      data: {
        name: name.trim(),
        phone: phone?.trim() || null,
        address: address?.trim() || null,
        note: note?.trim() || null,
      },
    });

    return NextResponse.json(supplier, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Không thể tạo nhà cung cấp" }, { status: 500 });
  }
}
