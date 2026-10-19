import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getAdminSession } from "@/lib/api-auth";
import { getSessionUser } from "@/lib/user-session";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import {
  DOCUMENT_MIME_TYPES,
  IMAGE_MIME_TYPES,
  extensionForMime,
  matchesMagicBytes,
} from "@/lib/upload-validation";

export const dynamic = "force-dynamic";

/**
 * Upload endpoint — stores files in a PRIVATE Supabase Storage bucket.
 *
 * - Documents always live under an owner prefix (`user-<id>/` or `private/admin/`)
 *   and are only readable by the owner or an admin via `/api/files/...`.
 * - Images uploaded by an admin are public content (news covers) and live under
 *   `public/`, so anonymous visitors can view them.
 * - Files are renamed with random IDs and the declared MIME type is verified
 *   against the file signature ("magic bytes").
 */

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const BUCKET = process.env.SUPABASE_UPLOAD_BUCKET || "uploads";

export async function POST(req: NextRequest) {
  const admin = getAdminSession(req);
  const user = admin ? null : await getSessionUser(req);
  if (!admin && !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ownerKey = admin ? `admin:${admin.username}` : `user:${user!.id}`;
  const limited = rateLimit(`upload:${ownerKey}:${getClientIp(req)}`, 20, 60 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Terlalu banyak unggahan. Silakan coba lagi nanti." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSeconds) } }
    );
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: "Server tidak dikonfigurasi untuk upload (Supabase credentials missing)" },
      { status: 500 }
    );
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Data unggahan tidak valid." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Berkas tidak ditemukan." }, { status: 400 });
  }

  if (!(DOCUMENT_MIME_TYPES as readonly string[]).includes(file.type)) {
    return NextResponse.json(
      { error: "Tipe berkas tidak diizinkan. Gunakan PDF, DOC/DOCX, XLS/XLSX, JPG, PNG, atau WEBP." },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: `Berkas terlalu besar. Maksimal ${MAX_SIZE / 1024 / 1024} MB.` },
      { status: 400 }
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    if (!matchesMagicBytes(buffer, file.type)) {
      return NextResponse.json(
        { error: "Isi berkas tidak sesuai dengan tipe yang dinyatakan." },
        { status: 400 }
      );
    }

    const isImage = (IMAGE_MIME_TYPES as readonly string[]).includes(file.type);
    const ext = extensionForMime(file.type) || "bin";
    const randomId = crypto.randomBytes(16).toString("hex");

    let prefix: string;
    if (admin) {
      prefix = isImage ? "public/admin" : "private/admin";
    } else {
      prefix = `user-${user!.id}`;
    }

    const objectPath = `${prefix}/${randomId}.${ext}`;
    const uploadUrl = `${supabaseUrl}/storage/v1/object/${BUCKET}/${objectPath}`;

    const uploadRes = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": file.type,
        "x-upsert": "false",
      },
      body: buffer,
    });

    if (!uploadRes.ok) {
      const err = await uploadRes.text();
      console.error("[Upload] Supabase error:", err.slice(0, 300));
      return NextResponse.json({ error: "Gagal mengunggah berkas ke penyimpanan." }, { status: 500 });
    }

    return NextResponse.json({
      path: objectPath,
      bucket: BUCKET,
      url: `/api/files/${objectPath}`,
      type: file.type,
      sizeBytes: file.size,
      isPublic: prefix.startsWith("public/"),
    });
  } catch (err) {
    console.error("[Upload]", (err as Error).message);
    return NextResponse.json({ error: "Gagal memproses berkas." }, { status: 500 });
  }
}
