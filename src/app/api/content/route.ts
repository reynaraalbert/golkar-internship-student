import { NextResponse } from "next/server";
import { readDbCollectionSafe } from "@/lib/db-store";
import { defaultCollection } from "@/lib/cms-store";

export const dynamic = "force-dynamic";
// Force HMR reload

let cachedContent: { data: any; timestamp: number } | null = null;
const CACHE_TTL_MS = 10000; // 10 seconds in-memory cache

/**
 * Public bulk endpoint — returns the full content dataset straight from the
 * database. Uses in-memory caching and Edge CDN headers for instant response times (<1s).
 */
export async function GET() {
  const now = Date.now();

  // Serve from in-memory cache if fresh
  if (cachedContent && now - cachedContent.timestamp < CACHE_TTL_MS) {
    return NextResponse.json(cachedContent.data, {
      headers: {
        "Cache-Control": "public, s-maxage=10, stale-while-revalidate=60",
      },
    });
  }

  const [stats, anggota, pimpinan, mitraKerja, berita, agenda, pages, siteContent, tracks, steps, requirements, faqs, posisi_magang] = await Promise.all([
    readDbCollectionSafe("stats"),
    readDbCollectionSafe("anggota"),
    readDbCollectionSafe("pimpinan"),
    readDbCollectionSafe("mitraKerja"),
    readDbCollectionSafe("berita"),
    readDbCollectionSafe("agenda"),
    readDbCollectionSafe("pages"),
    readDbCollectionSafe("siteContent"),
    readDbCollectionSafe("tracks"),
    readDbCollectionSafe("steps"),
    readDbCollectionSafe("requirements"),
    readDbCollectionSafe("faqs"),
    readDbCollectionSafe("posisi_magang"),
  ]);

  const payload = {
    stats: stats ?? defaultCollection("stats"),
    anggota: anggota ?? defaultCollection("anggota"),
    pimpinan: pimpinan ?? defaultCollection("pimpinan"),
    mitraKerja: mitraKerja ?? defaultCollection("mitraKerja"),
    berita: berita ?? defaultCollection("berita"),
    agenda: agenda ?? defaultCollection("agenda"),
    siteContent: siteContent ?? defaultCollection("siteContent"),
    pages: pages ?? defaultCollection("pages"),
    tracks: tracks ?? defaultCollection("tracks"),
    steps: steps ?? defaultCollection("steps"),
    requirements: requirements ?? defaultCollection("requirements"),
    faqs: faqs ?? defaultCollection("faqs"),
    posisi_magang: posisi_magang ?? defaultCollection('posisi_magang'),
  };

  // Only update in-memory cache if at least some DB collections were retrieved
  const hasRealData = Boolean(berita || anggota || mitraKerja || stats);
  if (hasRealData || !cachedContent) {
    cachedContent = { data: payload, timestamp: now };
  }

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "public, s-maxage=10, stale-while-revalidate=60",
    },
  });
}
