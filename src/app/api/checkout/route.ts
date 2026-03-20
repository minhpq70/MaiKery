import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkoutSchema } from "@/lib/validations";
import { generateOrderId } from "@/lib/order-id";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    
    // Validate checkout data
    const parseResult = checkoutSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json({ error: "Dữ liệu không hợp lệ", details: parseResult.error.flatten().fieldErrors }, { status: 400 });
    }
    
    const { items: requestItems } = body as { items: { productId: string; quantity: number }[] };
    if (!requestItems || requestItems.length === 0) {
      return NextResponse.json({ error: "Giỏ hàng trống" }, { status: 400 });
    }

    const { customerName, phone, address, note, email, discountCode } = parseResult.data;

    // Fetch products securely from DB
    const productIds = requestItems.map(item => item.productId);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } }
    });

    const items = requestItems.map(item => {
      const dbProduct = dbProducts.find(p => p.id === item.productId);
      if (!dbProduct) throw new Error(`Product not found: ${item.productId}`);
      return {
        productId: item.productId,
        productCode: dbProduct.productCode,
        productName: dbProduct.name,
        quantity: item.quantity,
        unitPrice: Number(dbProduct.salePrice),
        lineTotal: item.quantity * Number(dbProduct.salePrice)
      };
    });

    const totalAmount = items.reduce((sum, item) => sum + item.lineTotal, 0);
    let appliedDiscount = 0;

    // Validate discount code if provided
    if (discountCode) {
      const codeRecord = await prisma.discountCode.findUnique({ where: { code: discountCode } });
      const now = new Date();
      
      const isValid = codeRecord && 
        codeRecord.active && 
        (!codeRecord.expiresAt || codeRecord.expiresAt > now) && 
        (!codeRecord.usageLimit || codeRecord.usedCount < codeRecord.usageLimit) &&
        (!codeRecord.minimumOrderValue || totalAmount >= Number(codeRecord.minimumOrderValue));

      if (isValid) {
        if (codeRecord.discountType === "PERCENTAGE") {
          appliedDiscount = Math.floor(totalAmount * (Number(codeRecord.discountValue) / 100));
        } else {
          appliedDiscount = Number(codeRecord.discountValue);
        }

        await prisma.discountCode.update({
          where: { id: codeRecord.id },
          data: { usedCount: { increment: 1 } }
        });
      }
    }

    const finalAmount = Math.max(0, totalAmount - appliedDiscount);
    const orderId = await generateOrderId();

    const order = await prisma.order.create({
      data: {
        orderId,
        userId: session?.user?.id || null,
        customerName,
        phone,
        address,
        email,
        note,
        subtotal: totalAmount,
        discountCode,
        discountAmount: appliedDiscount,
        totalPayable: finalAmount,
        items: {
          create: items.map(i => ({
            productId: i.productId,
            productCode: i.productCode,
            productName: i.productName,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
            lineTotal: i.lineTotal
          }))
        }
      }
    });

    return NextResponse.json({ success: true, orderId: order.orderId }, { status: 201 });
  } catch (error: unknown) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Lỗi tạo đơn hàng" }, { status: 500 });
  }
}
