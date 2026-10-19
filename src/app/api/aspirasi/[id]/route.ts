import { NextRequest, NextResponse } from "next/server";
import { staffGuard } from "@/lib/api-auth";
import { readDbCollection, writeDbCollection } from "@/lib/db-store";
import type { Aspirasi } from "@/lib/data";
import { z } from "zod";

export const dynamic = "force-dynamic";

const updateAspirasiSchema = z.object({
  status: z.enum(["new", "reviewed", "resolved"]).optional(),
  subject: z.string().trim().max(200).optional(),
  category: z.string().trim().max(120).optional(),
});

interface Params {
  params: { id: string };
}

export async function PUT(req: NextRequest, { params }: Params) {
  const guard = staffGuard(req);
  if ("response" in guard) return guard.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Data yang dikirim tidak valid." }, { status: 400 });
  }

  const parsed = updateAspirasiSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Data yang dikirim tidak valid." }, { status: 400 });
  }

  try {
    const aspirasi = ((await readDbCollection("aspirasi")) as Aspirasi[] | null) ?? [];
    const idx = aspirasi.findIndex((a) => a.id === params.id);
    if (idx === -1) {
      return NextResponse.json({ error: "Aspirasi tidak ditemukan." }, { status: 404 });
    }
    // Whitelisted fields only: never allow a client to rewrite the message or
    // identity fields of an existing aspiration.
    aspirasi[idx] = { ...aspirasi[idx], ...parsed.data };
    const ok = await writeDbCollection("aspirasi", aspirasi);
    if (!ok) {
      return NextResponse.json({ error: "Gagal menyimpan aspirasi." }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[Aspirasi PUT]", (err as Error).message);
    return NextResponse.json({ error: "Gagal memperbarui aspirasi." }, { status: 500 });
  }
}
