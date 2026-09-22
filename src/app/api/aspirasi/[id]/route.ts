import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { readDbCollection, writeDbCollection } from "@/lib/db-store";
import type { Aspirasi } from "@/lib/data";

export const dynamic = "force-dynamic";

interface Params {
  params: { id: string };
}

export async function PUT(req: NextRequest, { params }: Params) {
  if (!requireAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const aspirasi = ((await readDbCollection("aspirasi")) as Aspirasi[] | null) ?? [];
    const idx = aspirasi.findIndex((a) => a.id === params.id);
    if (idx === -1) {
      return NextResponse.json({ error: "Aspirasi not found" }, { status: 404 });
    }
    aspirasi[idx] = { ...aspirasi[idx], ...body };
    await writeDbCollection("aspirasi", aspirasi);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}