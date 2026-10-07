/**
 * CMS data type definitions & static defaults.
 *
 * Database (Supabase via Prisma) is the primary source of truth.
 * All read/write operations go through db-store.ts.
 * The static defaults below are used ONLY as a fallback so the site
 * still renders something when the database is unreachable/crashed.
 */
import {
  STATS,
  ANGGOTA_KOMISI,
  PIMPINAN_KOMISI,
  MITRA_KERJA,
  BERITA_LIST,
  AGENDA_LIST,
  SiteContent,
} from "@/lib/data";
import { PAGES } from "@/lib/pages";
import type {
  Member,
  NewsArticle,
  AgendaItem,
  MitraKerja,
  NewsSubmission,
  Aspirasi,
  PageContent,
  SiteContent as SiteContentType,
} from "@/lib/data";

export interface CmsData {
  stats: {
    totalMembers: number;
    totalPimpinan: number;
    mitraKerjaCount: number;
    activeBills: number;
    completedHearings: number;
    aspirationsProcessed: number;
  };
  anggota: Member[];
  pimpinan: Member[];
  mitraKerja: MitraKerja[];
  berita: NewsArticle[];
  agenda: AgendaItem[];
  siteContent: SiteContentType;
  submissions: NewsSubmission[];
  aspirasi: Aspirasi[];
  pages: PageContent[];
  tracks: any[];
  steps: any[];
  requirements: any[];
  faqs: any[];
  posisi_magang: any[];
  timeline: any;
}

/**
 * Static default data (same as the seed). Used as a read-fallback when the
 * database is unreachable, so public pages never render empty during an
 * outage. It is NOT used for writes and does NOT override real DB data.
 */
export function defaultCollection<K extends keyof CmsData>(key: K): CmsData[K] {
  switch (key) {
    case "stats":
      return STATS as unknown as CmsData[K];
    case "anggota":
      return ANGGOTA_KOMISI.map((m) => ({ ...m, billsLed: [...m.billsLed] })) as unknown as CmsData[K];
    case "pimpinan":
      return PIMPINAN_KOMISI.map((m) => ({ ...m, billsLed: [...m.billsLed] })) as unknown as CmsData[K];
    case "mitraKerja":
      return MITRA_KERJA.map((m) => ({ ...m })) as unknown as CmsData[K];
    case "berita":
      return BERITA_LIST.map((b) => ({ ...b })) as unknown as CmsData[K];
    case "agenda":
      return AGENDA_LIST.map((a) => ({ ...a })) as unknown as CmsData[K];
    case "siteContent":
      return JSON.parse(JSON.stringify(SiteContent)) as unknown as CmsData[K];
    case "submissions":
      return [] as unknown as CmsData[K];
    case "aspirasi":
      return [] as unknown as CmsData[K];
    case "pages":
      return JSON.parse(JSON.stringify(PAGES)) as unknown as CmsData[K];
    case "tracks":
      return [] as unknown as CmsData[K];
    case "steps":
      return [] as unknown as CmsData[K];
    case "requirements":
      return [] as unknown as CmsData[K];
    case "faqs":
      return [] as unknown as CmsData[K];
    case "timeline":
      return {
        title: "Timeline Pelaksanaan Magang",
        sections: [
          { id: "1", type: "timeline", title: "Pendaftaran Dibuka", content: "25 Agustus 2026", order: 1 },
          { id: "2", type: "timeline", title: "Seleksi Berkas", content: "1 - 5 September 2026", order: 2 },
          { id: "3", type: "timeline", title: "Pengumuman Lolos", content: "10 September 2026", order: 3 },
        ]
      } as unknown as CmsData[K];
    default:
      return [] as unknown as CmsData[K];
  }
}
