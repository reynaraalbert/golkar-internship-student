import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const dbData = await prisma.pageContent.findUnique({
      where: { slug: "timeline" },
    });

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
          allBatches = parsedData.batches;
          latestBatch = parsedData.batches[parsedData.batches.length - 1];
        }
      }
    }

    if (sections.length === 0) {
      sections = [
        { id: "1", title: "Pendaftaran Dibuka", content: "25 Agustus 2026", order: 1 },
        { id: "2", title: "Seleksi Berkas", content: "1 - 5 September 2026", order: 2 },
        { id: "3", title: "Pengumuman Lolos", content: "10 September 2026", order: 3 },
      ];
    }

    return NextResponse.json({ sections, allBatches, latestBatch });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch timeline" }, { status: 500 });
  }
}
