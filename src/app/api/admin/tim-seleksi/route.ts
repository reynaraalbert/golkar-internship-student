import { NextRequest, NextResponse } from "next/server";
import { adminGuard } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const dynamic = "force-dynamic";

const timSeleksiMemberSchema = z.object({
  id: z.string().trim().min(1),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
});

/**
 * GET /api/admin/tim-seleksi
 * Returns the list of Tim Seleksi members from PageContent ("tim_seleksi").
 */
export async function GET(req: NextRequest) {
  const guard = adminGuard(req);
  if ("response" in guard) return guard.response;

  try {
    const row = await prisma.pageContent.findUnique({
      where: { slug: "tim_seleksi" },
    });

    if (!row) {
      return NextResponse.json([]);
    }

    let data = row.sections;
    if (typeof data === "string") {
      try { data = JSON.parse(data); } catch { data = []; }
    }
    if (!Array.isArray(data)) data = [];

    return NextResponse.json(data);
  } catch (err) {
    console.error("[Admin Tim Seleksi GET]", (err as Error).message);
    return NextResponse.json({ error: "Gagal memuat tim seleksi." }, { status: 500 });
  }
}

/**
 * PUT /api/admin/tim-seleksi
 * Update a Tim Seleksi member's status (APPROVED/REJECTED).
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

  const parsed = timSeleksiMemberSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "ID atau status tidak valid." }, { status: 400 });
  }
  const { id, status } = parsed.data;

  try {
    const row = await prisma.pageContent.findUnique({
      where: { slug: "tim_seleksi" },
    });

    let members: Record<string, unknown>[] = [];
    if (row) {
      let data = row.sections;
      if (typeof data === "string") {
        try { data = JSON.parse(data); } catch { data = []; }
      }
      if (Array.isArray(data)) members = data as Record<string, unknown>[];
    }

    const updated = members.map((m) => (m.id === id ? { ...m, status } : m));

    await prisma.pageContent.upsert({
      where: { slug: "tim_seleksi" },
      update: { sections: updated as object },
      create: { slug: "tim_seleksi", title: "Tim Seleksi", sections: updated as object },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[Admin Tim Seleksi PUT]", (err as Error).message);
    return NextResponse.json({ error: "Gagal memperbarui tim seleksi." }, { status: 500 });
  }
}
