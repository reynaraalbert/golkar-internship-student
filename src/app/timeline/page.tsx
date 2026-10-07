import React from "react";
import SiteChrome from "@/components/SiteChrome";
import { prisma } from "@/lib/prisma";
import TimelineViewer from "./TimelineViewer";

export const revalidate = 0; // Disable static caching

export default async function TimelinePage() {
  let dbData = null;
  try {
    dbData = await prisma.pageContent.findUnique({
      where: { slug: "timeline" },
    });
  } catch (e) {
    console.warn("Failed to fetch timeline from DB, falling back to defaults.");
  }

  let sections = [];
  let latestBatch = "Batch 4 (2026)";
  let allBatches = ["Batch 1 (2024)", "Batch 2 (2025)", "Batch 3 (2026)", "Batch 4 (2026)"];

  if (dbData?.sections) {
    let parsedData = dbData.sections as any;
    if (typeof dbData.sections === "string") {
      try { parsedData = JSON.parse(dbData.sections); } catch (e) {}
    }
    
    if (Array.isArray(parsedData)) {
      sections = parsedData;
    } else if (parsedData && Array.isArray(parsedData.sections)) {
      sections = parsedData.sections;
      if (parsedData.batches && Array.isArray(parsedData.batches) && parsedData.batches.length > 0) {
        // Ambil list batch dan batch terbaru
        allBatches = parsedData.batches;
        latestBatch = parsedData.batches[parsedData.batches.length - 1];
      }
    }
  }

  // Fallback defaults
  if (sections.length === 0) {
    sections = [
      { id: "1", title: "Pendaftaran Dibuka", content: "25 Agustus 2026", order: 1 },
      { id: "2", title: "Seleksi Berkas", content: "1 - 5 September 2026", order: 2 },
      { id: "3", title: "Pengumuman Lolos", content: "10 September 2026", order: 3 },
    ];
  }

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

        <TimelineViewer 
          allSections={sections} 
          batches={allBatches} 
          initialBatch={latestBatch} 
        />
      </div>
    </SiteChrome>
  );
}
