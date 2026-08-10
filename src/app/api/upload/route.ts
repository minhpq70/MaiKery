import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";

const BUCKET = "product-images";
// Keep this below Vercel's serverless request body limit.
const MAX_FILE_SIZE = 4 * 1024 * 1024;
const ALLOWED_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
]);

function normalizeSupabaseUrl(value: string) {
  const trimmed = value.trim().replace(/\/$/, "");
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed.endsWith(".supabase.co") ? trimmed : `${trimmed}.supabase.co`}`;
}

function storageHeaders(apiKey: string, contentType?: string) {
  const headers: Record<string, string> = { apikey: apiKey };

  // Legacy service_role is a JWT and needs the Bearer header. New sb_secret
  // keys must not be sent as a Bearer token; Supabase accepts them via apikey.
  if (!apiKey.startsWith("sb_")) {
    headers.Authorization = `Bearer ${apiKey}`;
  }
  if (contentType) headers["Content-Type"] = contentType;
  return headers;
}

async function ensurePublicBucket(supabaseUrl: string, serviceRoleKey: string) {
  const response = await fetch(`${supabaseUrl}/storage/v1/bucket/${BUCKET}`, {
    headers: storageHeaders(serviceRoleKey),
    cache: "no-store",
  });

  if (response.ok) return;
  if (response.status !== 404) {
    throw new Error(`Không thể kiểm tra Supabase bucket (${response.status})`);
  }

  const createResponse = await fetch(`${supabaseUrl}/storage/v1/bucket`, {
    method: "POST",
    headers: storageHeaders(serviceRoleKey, "application/json"),
    body: JSON.stringify({ id: BUCKET, name: BUCKET, public: true }),
  });

  if (!createResponse.ok && createResponse.status !== 409) {
    throw new Error(`Không thể tạo Supabase bucket (${createResponse.status})`);
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const configuredSupabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!configuredSupabaseUrl || !serviceRoleKey) {
      console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
      return NextResponse.json(
        { error: "Chưa cấu hình Supabase Storage trên máy chủ" },
        { status: 500 },
      );
    }

    const supabaseUrl = normalizeSupabaseUrl(configuredSupabaseUrl);

    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "Không tìm thấy file" }, { status: 400 });
    }

    const extension = ALLOWED_TYPES.get(file.type);
    if (!extension) {
      return NextResponse.json(
        { error: "Chỉ hỗ trợ ảnh JPG, PNG, WebP hoặc GIF" },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Ảnh không được lớn hơn 4 MB" },
        { status: 400 },
      );
    }

    await ensurePublicBucket(supabaseUrl, serviceRoleKey);

    const objectPath = `products/${randomUUID()}.${extension}`;
    const uploadResponse = await fetch(
      `${supabaseUrl}/storage/v1/object/${BUCKET}/${objectPath}`,
      {
        method: "POST",
        headers: {
          ...storageHeaders(serviceRoleKey, file.type),
          "x-upsert": "false",
        },
        body: Buffer.from(await file.arrayBuffer()),
      },
    );

    if (!uploadResponse.ok) {
      const details = await uploadResponse.text();
      console.error("Supabase upload error:", uploadResponse.status, details);
      return NextResponse.json(
        { error: "Supabase từ chối tải ảnh. Vui lòng kiểm tra cấu hình Storage." },
        { status: 502 },
      );
    }

    const imageUrl = `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${objectPath}`;
    return NextResponse.json({ success: true, url: imageUrl }, { status: 201 });
  } catch (error: unknown) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Lỗi tải ảnh" }, { status: 500 });
  }
}
