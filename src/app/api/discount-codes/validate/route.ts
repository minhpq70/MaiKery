import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { code, cartTotal } = await req.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Mã giảm giá không hợp lệ" }, { status: 400 });
    }

    const discountCode = await prisma.discountCode.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!discountCode || !discountCode.active) {
      return NextResponse.json({ error: "Mã giảm giá không tồn tại hoặc đã bị vô hiệu hoá" }, { status: 400 });
    }

    if (discountCode.expiresAt && discountCode.expiresAt < new Date()) {
      return NextResponse.json({ error: "Mã giảm giá đã hết hạn" }, { status: 400 });
    }

    if (discountCode.usageLimit && discountCode.usedCount >= discountCode.usageLimit) {
      return NextResponse.json({ error: "Mã giảm giá đã hết lượt sử dụng" }, { status: 400 });
    }

    if (discountCode.minimumOrderValue && cartTotal < Number(discountCode.minimumOrderValue)) {
      return NextResponse.json({ 
        error: `Đơn hàng tối thiểu ${new Intl.NumberFormat("vi-VN").format(Number(discountCode.minimumOrderValue))}đ để sử dụng mã này` 
      }, { status: 400 });
    }

    let discountAmount = 0;
    if (discountCode.discountType === "PERCENTAGE") {
      discountAmount = Math.floor((cartTotal || 0) * (Number(discountCode.discountValue) / 100));
    } else {
      discountAmount = Number(discountCode.discountValue);
    }

    return NextResponse.json({
      success: true,
      discountType: discountCode.discountType,
      discountValue: Number(discountCode.discountValue),
      discountAmount,
      code: discountCode.code
    });
  } catch (error: unknown) {
    console.error("Validate discount code error:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
