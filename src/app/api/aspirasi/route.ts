import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { readDbCollection, writeDbCollection } from "@/lib/db-store";
import type { Aspirasi } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!requireAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const aspirasi = (await readDbCollection("aspirasi")) as Aspirasi[] | null;
  return NextResponse.json(aspirasi ?? []);
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Omit<Aspirasi, "id" | "status" | "createdAt">;
    const existing = (await readDbCollection("aspirasi")) as Aspirasi[] | null;
    if (existing === null) {
      // Database unreachable — writing now could clobber existing rows.
      return NextResponse.json({ error: "Database tidak terjangkau saat ini. Coba lagi beberapa saat." }, { status: 503 });
    }
    const aspirasi: Aspirasi[] = existing;
    const newAspirasi: Aspirasi = {
      ...body,
      id: `asp-${Date.now()}`,
      status: "new",
      createdAt: new Date().toISOString(),
    };
    aspirasi.unshift(newAspirasi);
    const ok = await writeDbCollection("aspirasi", aspirasi);
    if (!ok) {
      return NextResponse.json({ error: "Gagal menyimpan aspirasi ke database" }, { status: 500 });
    }
    return NextResponse.json({ ok: true, id: newAspirasi.id });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}