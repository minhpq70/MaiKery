import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/cron/keepalive - chạy 1 truy vấn nhẹ để Supabase free tier không bị pause.
// Vercel Cron tự gửi header `Authorization: Bearer $CRON_SECRET`.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true, at: new Date().toISOString() });
  } catch (error) {
    console.error("Keepalive error:", error);
    return NextResponse.json({ error: "Database không phản hồi" }, { status: 500 });
  }
}
