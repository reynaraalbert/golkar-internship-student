import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

/**
 * Upload endpoint — receives a file, converts it to a base64 data-URL,
 * and returns the data-URL as the `url` field.
 *
 * This approach stores images as text in the database (Supabase/JSON) so no
 * external CDN (e.g. Cloudinary) is needed. Images are automatically compressed
 * by the client (FileUpload.tsx) before being sent here, keeping sizes small.
 *
 * Max payload: 4 MB (Next.js default), matching our ~2 MB image cap.
 */

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB hard limit

export async function POST(req: NextRequest) {
  // Upload endpoint is protected — only logged-in admins may use it.
  // (FileUpload.tsx calls this directly from admin pages.)
  if (!requireAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: `Tipe file tidak diizinkan: ${file.type}` },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: `File terlalu besar (${(file.size / 1024 / 1024).toFixed(1)} MB). Maks. ${(MAX_SIZE / 1024 / 1024).toFixed(0)} MB.` },
      { status: 400 }
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;

    return NextResponse.json({
      url: dataUrl,
      type: file.type,
      sizeBytes: file.size,
    });
  } catch {
    return NextResponse.json({ error: "Gagal memproses file" }, { status: 500 });
  }
}
