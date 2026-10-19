import React from "react";
import SiteChrome from "@/components/SiteChrome";
import { prisma } from "@/lib/prisma";
import {
  DEFAULT_BATCHES,
  getAllBatchInfo,
  getLatestBatchInfo,
  getStageStatus,
  STAGE_STATUS_LABEL,
  type BatchSetting,
  type TimelineStage,
} from "@/lib/batch";
import TimelineViewer from "./TimelineViewer";

export const revalidate = 0; // Disable static caching

export const metadata = {
  title: "Timeline Pelaksanaan Magang",
  description:
    "Jadwal resmi tahapan Golkar Internship Student: registrasi, verifikasi berkas, seleksi & wawancara, serta pengumuman dan onboarding.",
};

export default async function TimelinePage() {
  let dbData = null;
  try {
    dbData = await prisma.pageContent.findUnique({
      where: { slug: "timeline" },
    });
  } catch {
    console.warn("Failed to fetch timeline from DB, falling back to defaults.");
  }

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

  // Fallback defaults
  if (sections.length === 0) {
    sections = [
      { id: "1", title: "Registrasi", content: "25 Agustus 2026", order: 1 },
      { id: "2", title: "Verifikasi Berkas", content: "1 - 5 September 2026", order: 2 },
      { id: "3", title: "Seleksi & Wawancara", content: "6 - 8 September 2026", order: 3 },
      { id: "4", title: "Pengumuman & Onboarding", content: "10 September 2026", order: 4 },
    ];
  }

  const timeline = { batches, batchSettings, sections };
  const latest = getLatestBatchInfo(timeline);
  const batchInfo = getAllBatchInfo(timeline);

  const stagesWithStatus = sections.map((stage) => ({
    ...stage,
    status: getStageStatus(stage),
  }));

  return (
    <SiteChrome>
      <div className="pt-24 pb-24 px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-sm font-black tracking-widest uppercase mb-4 inline-block">
            Jadwal Magang
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">
            Timeline Pelaksanaan Magang
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Berikut adalah jadwal dan tahapan penting dalam program Golkar Internship Student.
          </p>
        </div>

        <div
          className={`mb-8 p-4 rounded-2xl border text-center text-sm font-bold ${
            latest.registrationOpen
              ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
              : "bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
          }`}
        >
          {latest.registrationOpen
            ? `Pendaftaran ${latest.name} sedang dibuka.`
            : latest.status === "Belum Dibuka"
            ? `Pendaftaran ${latest.name} belum dibuka. Pantau pengumuman resmi untuk informasi selanjutnya.`
            : `Pendaftaran ${latest.name} telah ditutup.`}
        </div>

        <TimelineViewer
          allSections={stagesWithStatus}
          batches={batches}
          batchInfo={batchInfo}
          initialBatch={latest.name}
          statusLabels={STAGE_STATUS_LABEL}
        />
      </div>
    </SiteChrome>
  );
}

