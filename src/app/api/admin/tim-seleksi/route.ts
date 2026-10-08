import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/tim-seleksi
 * Returns the list of Tim Seleksi members from the database.
 * Currently returns an empty array since there's no dedicated TimSeleksi model yet.
 * This endpoint is ready to be connected to a real model when needed.
 */
export async function GET(req: NextRequest) {
  if (!requireAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Read from PageContent with slug "tim_seleksi"
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
  } catch {
    return NextResponse.json([]);
  }
}

/**
 * PUT /api/admin/tim-seleksi
 * Update a Tim Seleksi member's status (APPROVED/REJECTED).
 */
export async function PUT(req: NextRequest) {
  if (!requireAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
    }

    // Read current data
    const row = await prisma.pageContent.findUnique({
      where: { slug: "tim_seleksi" },
    });

    let members: any[] = [];
    if (row) {
      let data = row.sections;
      if (typeof data === "string") {
        try { data = JSON.parse(data); } catch { data = []; }
      }
      if (Array.isArray(data)) members = data;
    }

    // Update the status of the member
    const updated = members.map((m: any) =>
      m.id === id ? { ...m, status } : m
    );

    // Save back
    await prisma.pageContent.upsert({
      where: { slug: "tim_seleksi" },
      update: { sections: updated as any },
      create: { slug: "tim_seleksi", title: "Tim Seleksi", sections: updated as any },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
