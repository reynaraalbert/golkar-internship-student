import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { adminGuard } from "@/lib/api-auth";
import { CmsData, defaultCollection } from "@/lib/cms-store";
import { readDbCollectionSafe, writeDbCollection } from "@/lib/db-store";

export const dynamic = "force-dynamic";

const COLLECTIONS: (keyof CmsData)[] = [
  "stats",
  "anggota",
  "pimpinan",
  "mitraKerja",
  "berita",
  "agenda",
  "siteContent",
  "submissions",
  "aspirasi",
  "pages",
  "posisi_magang",
  "timeline",
  "tracks",
  "steps",
  "requirements",
  "faqs",
];

/**
 * Collections that contain no personal data and are safe to expose to
 * anonymous visitors (used by public pages such as /user/posisi).
 */
const PUBLIC_READ_COLLECTIONS: (keyof CmsData)[] = [
  "posisi_magang",
  "timeline",
  "tracks",
  "steps",
  "requirements",
  "faqs",
];

interface Params {
  params: { collection: string };
}

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
  Pragma: "no-cache",
  Expires: "0",
};

export async function GET(req: NextRequest, { params }: Params) {
  const key = params.collection as keyof CmsData;
  if (!COLLECTIONS.includes(key)) {
    return NextResponse.json({ error: "Unknown collection" }, { status: 400, headers: NO_CACHE_HEADERS });
  }

  if (!PUBLIC_READ_COLLECTIONS.includes(key)) {
    const guard = adminGuard(req);
    if ("response" in guard) return guard.response;
  }

  const dbData = await readDbCollectionSafe(key);
  const data = dbData ?? defaultCollection(key);
  return NextResponse.json(data, { headers: NO_CACHE_HEADERS });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const guard = adminGuard(req);
  if ("response" in guard) return guard.response;

  const key = params.collection as keyof CmsData;
  if (!COLLECTIONS.includes(key)) {
    return NextResponse.json({ error: "Unknown collection" }, { status: 400, headers: NO_CACHE_HEADERS });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400, headers: NO_CACHE_HEADERS });
  }

  const ok = await writeDbCollection(key, body as never);
  if (!ok) {
    return NextResponse.json({ error: "Gagal menyimpan ke database" }, { status: 500, headers: NO_CACHE_HEADERS });
  }

  try {
    revalidatePath("/", "layout");
  } catch {
    // ignore
  }

  return NextResponse.json({ ok: true }, { headers: NO_CACHE_HEADERS });
}
