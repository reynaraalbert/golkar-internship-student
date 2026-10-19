import { NextRequest, NextResponse } from "next/server";
import { adminGuard } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const dynamic = "force-dynamic";

const biodataSchema = z.record(z.string(), z.unknown());

/**
 * GET /api/admin/biodata
 * Get admin/tim seleksi biodata stored in PageContent ("admin_biodata")
 */
export async function GET(req: NextRequest) {
  const guard = adminGuard(req);
  if ("response" in guard) return guard.response;

  try {
    const row = await prisma.pageContent.findUnique({
      where: { slug: "admin_biodata" },
    });

    if (!row) {
      return NextResponse.json({});
    }

    let data = row.sections;
    if (typeof data === "string") {
      try { data = JSON.parse(data); } catch { data = {}; }
    }

    return NextResponse.json(data || {});
  } catch (err) {
    console.error("[Admin Biodata GET]", (err as Error).message);
    return NextResponse.json({ error: "Gagal memuat biodata." }, { status: 500 });
  }
}

/**
 * PUT /api/admin/biodata
 * Save admin/tim seleksi biodata into PageContent ("admin_biodata")
 */
export async function PUT(req: NextRequest) {
  const guard = adminGuard(req);
  if ("response" in guard) return guard.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Data yang dikirim tidak valid." }, { status: 400 });
  }

  const parsed = biodataSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Data yang dikirim tidak valid." }, { status: 400 });
  }

  try {
    await prisma.pageContent.upsert({
      where: { slug: "admin_biodata" },
      update: { sections: parsed.data as object },
      create: { slug: "admin_biodata", title: "Admin Biodata", sections: parsed.data as object },
    });

    return NextResponse.json({ ok: true, data: parsed.data });
  } catch (err) {
    console.error("[Admin Biodata PUT]", (err as Error).message);
    return NextResponse.json({ error: "Gagal menyimpan biodata." }, { status: 500 });
  }
}
