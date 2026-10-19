import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/user-session";
import { saveStudentUser } from "@/lib/user-store";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { getAllBatchInfo, type BatchSetting, type TimelineStage } from "@/lib/batch";
import { z } from "zod";

export const dynamic = "force-dynamic";

const applySchema = z.object({
  posisi: z.string().trim().min(1, "Posisi wajib dipilih.").max(160),
});

interface PosisiItem {
  id?: string;
  namaKomisi?: string;
  status?: string;
}

/**
 * Participant applies for a position.
 *
 * Server-side guards (the UI hiding a button is never enough):
 *  - registration must currently be open for at least one batch;
 *  - the chosen position must exist and be marked TERBUKA.
 */
export async function POST(req: NextRequest) {
  const user = await getSessionUser(req);
  if (!user) {
    return NextResponse.json({ error: "Silakan masuk terlebih dahulu." }, { status: 401 });
  }

  const limited = rateLimit(`apply:${user.id}:${getClientIp(req)}`, 10, 60 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Terlalu banyak percobaan. Silakan coba lagi nanti." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSeconds) } }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 400 });
  }

  const parsed = applySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Data tidak valid." }, { status: 400 });
  }

  try {
    const timelineRow = await prisma.pageContent.findUnique({ where: { slug: "timeline" } });
    let timeline: { batches?: string[]; batchSettings?: Record<string, BatchSetting>; sections?: TimelineStage[] } = {};

    if (timelineRow?.sections) {
      let data: unknown = timelineRow.sections;
      if (typeof data === "string") {
        try { data = JSON.parse(data); } catch { data = null; }
      }
      if (data && typeof data === "object" && !Array.isArray(data)) {
        timeline = data as typeof timeline;
      } else if (Array.isArray(data)) {
        timeline = { sections: data as TimelineStage[] };
      }
    }

    const open = getAllBatchInfo(timeline).some((b) => b.registrationOpen);
    if (!open) {
      return NextResponse.json(
        { error: "Pendaftaran belum dibuka. Silakan pantau pengumuman resmi." },
        { status: 403 }
      );
    }

    const posisiRow = await prisma.pageContent.findUnique({ where: { slug: "posisi_magang" } });
    let posisiList: PosisiItem[] = [];
    if (posisiRow?.sections) {
      let data: unknown = posisiRow.sections;
      if (typeof data === "string") {
        try { data = JSON.parse(data); } catch { data = []; }
      }
      if (Array.isArray(data)) posisiList = data as PosisiItem[];
    }

    const target = posisiList.find(
      (p) => `Program Magang ${p.namaKomisi}` === parsed.data.posisi || p.namaKomisi === parsed.data.posisi
    );
    if (!target) {
      return NextResponse.json({ error: "Posisi tidak ditemukan." }, { status: 404 });
    }
    if (target.status && target.status !== "TERBUKA") {
      return NextResponse.json({ error: "Posisi ini sedang tidak dibuka." }, { status: 409 });
    }

    await saveStudentUser({
      id: user.id,
      email: user.email,
      posisiDilamar: `Program Magang ${target.namaKomisi}`,
      statusMagang: "MENUNGGU_VERIFIKASI",
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[Apply]", (err as Error).message);
    return NextResponse.json({ error: "Gagal mengirim pendaftaran posisi." }, { status: 500 });
  }
}
