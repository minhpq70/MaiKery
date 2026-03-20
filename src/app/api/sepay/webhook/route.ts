import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    
    // Validate authorization if an API key is configured
    if (process.env.SEPAY_WEBHOOK_SECRET) {
      if (!authHeader || authHeader !== `Apikey ${process.env.SEPAY_WEBHOOK_SECRET}`) {
        console.warn("Sepay Webhook: Unauthorized request");
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
      }
    }

    const data = await request.json();

    const { transferType, content } = data;

    if (transferType === "in" && content) {
      // Find order ID from content.
      // Order IDs look like MKddmmyynnn, e.g., MK200326001.
      const match = content.match(/MK\d{9}/i);
      
      if (match) {
        const orderId = match[0].toUpperCase();

        const order = await prisma.order.findUnique({
          where: { orderId: orderId }
        });

        if (order && order.paymentStatus !== "PAID") {
          await prisma.order.update({
            where: { orderId: orderId },
            data: {
              paymentStatus: "PAID",
            }
          });
          console.log(`Order ${orderId} marked as PAID via sepay webhook.`);
        } else {
          console.log(`Order ${orderId} not found or already paid. Webhook ignored.`);
        }
      } else {
        console.log(`No order ID found in transfer content: "${content}"`);
      }
    }

    // SePay requires a {"success": true} response with HTTP 200/201
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Sepay Webhook Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
