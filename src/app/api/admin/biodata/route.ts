import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/biodata
 * Get admin/tim seleksi biodata stored in PageContent ("admin_biodata")
 */
export async function GET(req: NextRequest) {
  if (!requireAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
  } catch {
    return NextResponse.json({});
  }
}

/**
 * PUT /api/admin/biodata
 * Save admin/tim seleksi biodata into PageContent ("admin_biodata")
 */
export async function PUT(req: NextRequest) {
  if (!requireAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    await prisma.pageContent.upsert({
      where: { slug: "admin_biodata" },
      update: { sections: body as any },
      create: { slug: "admin_biodata", title: "Admin Biodata", sections: body as any },
    });

    return NextResponse.json({ ok: true, data: body });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update biodata" }, { status: 500 });
  }
}
