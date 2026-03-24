import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/products — returns active products for use in dropdowns (recipes, batches, etc.)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const limit = Number(searchParams.get("limit") || "200");

    const products = await prisma.product.findMany({
      where: q
        ? {
            isActive: true,
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { productCode: { contains: q, mode: "insensitive" } },
            ],
          }
        : { isActive: true },
      select: {
        id: true,
        productCode: true,
        name: true,
        salePrice: true,
        isActive: true,
      },
      orderBy: { name: "asc" },
      take: limit,
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Không thể tải danh sách sản phẩm" }, { status: 500 });
  }
}
