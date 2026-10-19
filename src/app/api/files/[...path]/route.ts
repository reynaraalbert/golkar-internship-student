import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/api-auth";
import { getSessionUser } from "@/lib/user-session";

export const dynamic = "force-dynamic";

/**
 * Authorised file proxy for the PRIVATE upload bucket.
 *
 * - Admin sessions may read any object.
 * - Participants may only read objects under their own `user-<id>/` prefix.
 * - Objects under `public/` are public content (news covers).
 * This prevents IDOR on uploaded CVs/transcripts/KTM scans.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_UPLOAD_BUCKET || "uploads";

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: "Penyimpanan berkas belum dikonfigurasi." }, { status: 500 });
  }

  const segments = (params.path || []).map((s) => decodeURIComponent(s));
  if (
    segments.length === 0 ||
    segments.some((s) => s.includes("..") || s.includes("\\") || s.includes("\0"))
  ) {
    return NextResponse.json({ error: "Path berkas tidak valid." }, { status: 400 });
  }
  const objectPath = segments.join("/");
  const isPublic = objectPath.startsWith("public/");

  if (!isPublic) {
    const admin = getAdminSession(req);
    if (!admin) {
      const user = await getSessionUser(req);
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      if (!objectPath.startsWith(`user-${user.id}/`)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }
  }

  const upstream = await fetch(
    `${supabaseUrl}/storage/v1/object/${bucket}/${objectPath}`,
    { headers: { Authorization: `Bearer ${supabaseKey}` }, cache: "no-store" }
  );

  if (!upstream.ok) {
    return NextResponse.json({ error: "Berkas tidak ditemukan." }, { status: 404 });
  }

  const contentType = upstream.headers.get("content-type") || "application/octet-stream";
  const body = await upstream.arrayBuffer();

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": "inline",
      "Cache-Control": isPublic ? "public, max-age=31536000, immutable" : "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
