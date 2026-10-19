import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEFAULT_BATCHES, getAllBatchInfo, getLatestBatchInfo, getStageStatus, type BatchSetting, type TimelineStage } from "@/lib/batch";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const dbData = await prisma.pageContent.findUnique({
      where: { slug: "timeline" },
    });

    let sections: TimelineStage[] = [];
    let batches: string[] = DEFAULT_BATCHES;
    let batchSettings: Record<string, BatchSetting> = {};

    if (dbData?.sections) {
      let parsed: unknown = dbData.sections;
      if (typeof dbData.sections === "string") {
        try { parsed = JSON.parse(dbData.sections); } catch { parsed = null; }
      }

      if (Array.isArray(parsed)) {
        sections = parsed as TimelineStage[];
      } else if (parsed && typeof parsed === "object") {
        const doc = parsed as {
          sections?: TimelineStage[];
          batches?: string[];
          batchSettings?: Record<string, unknown>;
        };
        if (Array.isArray(doc.sections)) sections = doc.sections;
        if (Array.isArray(doc.batches) && doc.batches.length > 0) batches = doc.batches;
        if (doc.batchSettings && typeof doc.batchSettings === "object") batchSettings = doc.batchSettings as Record<string, BatchSetting>;
      }
    }

    if (sections.length === 0) {
      sections = [
        { id: "1", title: "Registrasi", content: "25 Agustus 2026", order: 1 },
        { id: "2", title: "Verifikasi Berkas", content: "1 - 5 September 2026", order: 2 },
        { id: "3", title: "Seleksi & Wawancara", content: "6 - 8 September 2026", order: 3 },
        { id: "4", title: "Pengumuman & Onboarding", content: "10 September 2026", order: 4 },
      ];
    }

    const timeline = { batches, batchSettings, sections };
    const allBatchInfo = getAllBatchInfo(timeline);
    const latest = getLatestBatchInfo(timeline);

    const stagesWithStatus = sections.map((s) => ({ ...s, status: getStageStatus(s) }));

    return NextResponse.json({
      sections: stagesWithStatus,
      allBatches: batches,
      latestBatch: latest.name,
      batchInfo: allBatchInfo,
      registrationOpen: allBatchInfo.some((b) => b.registrationOpen),
    });
  } catch (err) {
    console.error("[Timeline GET]", (err as Error).message);
    return NextResponse.json({ error: "Gagal memuat timeline." }, { status: 500 });
  }
}

