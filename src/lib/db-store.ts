import { prisma } from "@/lib/prisma";
import type { CmsData } from "@/lib/cms-store";

export const isDbConnected = Boolean(process.env.DATABASE_URL);

/**
 * Actively tests whether the database is reachable. Returns true/false instead
 * of only checking that a URL exists (a URL existing does not mean the DB is up).
 * Used by the admin UI to show an accurate "Terhubung / Tidak Terhubung" status
 * instead of silently falling back to static defaults.
 */
export async function pingDb(timeoutMs = 8000): Promise<boolean> {
  if (!isDbConnected) return false;
  try {
    // Run against a timeout so the UI never hangs on a dead connection.
    // Supabase (region ap-south-1) can need several seconds on a cold
    // connection, so an 8s timeout avoids false "offline" readings.
    await Promise.race([
      prisma.$queryRaw`SELECT 1`,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("DB ping timeout")), timeoutMs)
      ),
    ]);
    return true;
  } catch {
    return false;
  }
}

/**
 * Reads a collection from the database. Fast direct read with a 7s timeout
 * so Supabase cold-start connections have enough time to establish on the first hit
 * and return REAL data immediately.
 */
export async function readDbCollectionSafe<K extends keyof CmsData>(
  key: K
): Promise<CmsData[K] | null> {
  try {
    const timeout = new Promise<null>((resolve) =>
      setTimeout(() => resolve(null), 7000)
    );
    const query = readDbCollection(key);
    return await Promise.race([query, timeout]);
  } catch {
    return null;
  }
}

export async function readDbCollection<K extends keyof CmsData>(key: K): Promise<CmsData[K] | null> {
  if (!isDbConnected) return null;

  try {
    switch (key) {
      case "berita": {
        const rows = await prisma.newsArticle.findMany({ orderBy: { createdAt: "desc" } });
        return rows as unknown as CmsData[K];
      }
      case "agenda": {
        const rows = await prisma.agendaItem.findMany({ orderBy: { createdAt: "desc" } });
        return rows as unknown as CmsData[K];
      }
      case "anggota": {
        const rows = await prisma.member.findMany({ orderBy: { createdAt: "asc" } });
        return rows as unknown as CmsData[K];
      }
      case "pimpinan": {
        const rows = await prisma.member.findMany({ where: { role: { in: ["Ketua Komisi", "Wakil Ketua Komisi"] } } });
        return rows as unknown as CmsData[K];
      }
      case "mitraKerja": {
        const rows = await prisma.mitraKerja.findMany();
        return rows as unknown as CmsData[K];
      }
      case "aspirasi": {
        const rows = await prisma.aspirasi.findMany({ orderBy: { createdAt: "desc" } });
        return rows as unknown as CmsData[K];
      }
      case "pages": {
        const rows = await prisma.pageContent.findMany();
        return rows.map((r: { id: string; slug: string; title: string; sections: any }) => ({
          id: r.id,
          slug: r.slug,
          title: r.title,
          sections: r.sections,
        })) as unknown as CmsData[K];
      }
      case "stats": {
        const row = await prisma.siteStat.findUnique({ where: { id: "default-stats" } });
        if (!row) return null;
        const { id, updatedAt, ...rest } = row;
        return rest as unknown as CmsData[K];
      }
      case "siteContent": {
        const row = await prisma.pageContent.findUnique({ where: { slug: "siteContent" } });
        if (!row) return null;
        return row.sections as unknown as CmsData[K];
      }
      case "submissions": {
        const rows = await prisma.newsSubmission.findMany({ orderBy: { createdAt: "desc" } });
        return rows as unknown as CmsData[K];
      }
      default:
        return null;
    }
  } catch (err) {
    console.warn(`[Prisma DB Read Warning] Fallback to static data for ${key}:`, (err as Error).message);
    return null;
  }
}

export async function writeDbCollection<K extends keyof CmsData>(key: K, value: CmsData[K]): Promise<boolean> {
  if (!isDbConnected) return false;

  try {
    switch (key) {
      case "berita": {
        const items = value as CmsData["berita"];
        const ids = items.map((item) => item.id);
        for (const item of items) {
          await prisma.newsArticle.upsert({
            where: { id: item.id },
            update: {
              title: item.title,
              slug: item.slug,
              category: item.category,
              date: item.date,
              readTime: item.readTime,
              author: item.author,
              summary: item.summary,
              content: item.content,
              imageUrl: item.imageUrl,
              documentUrl: item.documentUrl || null,
              isFeatured: item.isFeatured || false,
            },
            create: {
              id: item.id,
              title: item.title,
              slug: item.slug,
              category: item.category,
              date: item.date,
              readTime: item.readTime,
              author: item.author,
              summary: item.summary,
              content: item.content,
              imageUrl: item.imageUrl,
              documentUrl: item.documentUrl || null,
              isFeatured: item.isFeatured || false,
            },
          });
        }
        // Safety: only prune rows NOT in the incoming list when the list is
        // non-empty. An empty list usually means the CMS loaded static defaults
        // (DB read failed) — pruning then would wipe every real row.
        if (ids.length > 0) {
          await prisma.newsArticle.deleteMany({ where: { id: { notIn: ids } } });
        }
        return true;
      }
      case "agenda": {
        const items = value as CmsData["agenda"];
        const ids = items.map((item) => item.id);
        for (const item of items) {
          await prisma.agendaItem.upsert({
            where: { id: item.id },
            update: {
              title: item.title,
              type: item.type,
              partner: item.partner,
              date: item.date,
              time: item.time,
              location: item.location,
              status: item.status,
              summary: item.summary,
              streamUrl: item.streamUrl || null,
              pdfDownloadUrl: item.pdfDownloadUrl || null,
            },
            create: {
              id: item.id,
              title: item.title,
              type: item.type,
              partner: item.partner,
              date: item.date,
              time: item.time,
              location: item.location,
              status: item.status,
              summary: item.summary,
              streamUrl: item.streamUrl || null,
              pdfDownloadUrl: item.pdfDownloadUrl || null,
            },
          });
        }
        if (ids.length > 0) {
          await prisma.agendaItem.deleteMany({ where: { id: { notIn: ids } } });
        }
        return true;
      }
      case "anggota": {
        const items = value as CmsData["anggota"];
        const ids = items.map((item) => item.id);
        for (const item of items) {
          await prisma.member.upsert({
            where: { id: item.id },
            update: {
              nomorAnggota: item.nomorAnggota,
              name: item.name,
              role: item.role,
              fraksi: item.fraksi,
              dapil: item.dapil,
              photoUrl: item.photoUrl,
              email: item.email,
              bio: item.bio,
              billsLed: item.billsLed,
              pendidikan: item.pendidikan || null,
              masaJabatan: item.masaJabatan || null,
              komisi: item.komisi || null,
            },
            create: {
              id: item.id,
              nomorAnggota: item.nomorAnggota,
              name: item.name,
              role: item.role,
              fraksi: item.fraksi,
              dapil: item.dapil,
              photoUrl: item.photoUrl,
              email: item.email,
              bio: item.bio,
              billsLed: item.billsLed,
              pendidikan: item.pendidikan || null,
              masaJabatan: item.masaJabatan || null,
              komisi: item.komisi || null,
            },
          });
        }
        if (ids.length > 0) {
          await prisma.member.deleteMany({ where: { id: { notIn: ids } } });
        }
        return true;
      }
      case "pimpinan": {
        const items = value as CmsData["pimpinan"];
        const ids = items.map((item) => item.id);
        for (const item of items) {
          await prisma.member.upsert({
            where: { id: item.id },
            update: {
              nomorAnggota: item.nomorAnggota,
              name: item.name,
              role: item.role,
              fraksi: item.fraksi,
              dapil: item.dapil,
              photoUrl: item.photoUrl,
              email: item.email,
              bio: item.bio,
              billsLed: item.billsLed,
              pendidikan: item.pendidikan || null,
              masaJabatan: item.masaJabatan || null,
              komisi: item.komisi || null,
            },
            create: {
              id: item.id,
              nomorAnggota: item.nomorAnggota,
              name: item.name,
              role: item.role,
              fraksi: item.fraksi,
              dapil: item.dapil,
              photoUrl: item.photoUrl,
              email: item.email,
              bio: item.bio,
              billsLed: item.billsLed,
              pendidikan: item.pendidikan || null,
              masaJabatan: item.masaJabatan || null,
              komisi: item.komisi || null,
            },
          });
        }
        if (ids.length > 0) {
          await prisma.member.deleteMany({
            where: { role: { in: ["Ketua Komisi", "Wakil Ketua Komisi"] }, id: { notIn: ids } },
          });
        }
        return true;
      }
      case "mitraKerja": {
        const items = value as CmsData["mitraKerja"];
        const ids = items.map((item) => item.id);
        for (const item of items) {
          await prisma.mitraKerja.upsert({
            where: { id: item.id },
            update: {
              name: item.name,
              acronym: item.acronym,
              ministerOrHead: item.ministerOrHead,
              focusArea: item.focusArea,
              logoUrl: item.logoUrl,
              description: item.description,
            },
            create: {
              id: item.id,
              name: item.name,
              acronym: item.acronym,
              ministerOrHead: item.ministerOrHead,
              focusArea: item.focusArea,
              logoUrl: item.logoUrl,
              description: item.description,
            },
          });
        }
        if (ids.length > 0) {
          await prisma.mitraKerja.deleteMany({ where: { id: { notIn: ids } } });
        }
        return true;
      }
      case "aspirasi": {
        const items = value as CmsData["aspirasi"];
        const ids = items.map((item) => item.id);
        for (const item of items) {
          await prisma.aspirasi.upsert({
            where: { id: item.id },
            update: {
              mode: item.mode,
              name: item.name || null,
              email: item.email || null,
              whatsapp: item.whatsapp || null,
              subject: item.subject,
              message: item.message,
              category: item.category,
              status: item.status,
              createdAt: item.createdAt,
            },
            create: {
              id: item.id,
              mode: item.mode,
              name: item.name || null,
              email: item.email || null,
              whatsapp: item.whatsapp || null,
              subject: item.subject,
              message: item.message,
              category: item.category,
              status: item.status,
              createdAt: item.createdAt,
            },
          });
        }
        if (ids.length > 0) {
          await prisma.aspirasi.deleteMany({ where: { id: { notIn: ids } } });
        }
        return true;
      }
      case "pages": {
        const pages = value as CmsData["pages"];
        for (const page of pages) {
          await prisma.pageContent.upsert({
            where: { slug: page.slug },
            update: {
              title: page.title,
              sections: page.sections as any,
            },
            create: {
              id: page.id,
              slug: page.slug,
              title: page.title,
              sections: page.sections as any,
            },
          });
        }
        return true;
      }
      case "stats": {
        const stats = value as CmsData["stats"];
        await prisma.siteStat.upsert({
          where: { id: "default-stats" },
          update: stats,
          create: {
            id: "default-stats",
            ...stats,
          },
        });
        return true;
      }
      case "siteContent": {
        const data = value as CmsData["siteContent"];
        await prisma.pageContent.upsert({
          where: { slug: "siteContent" },
          update: {
            title: "siteContent",
            sections: data as any,
          },
          create: {
            id: "siteContent",
            slug: "siteContent",
            title: "siteContent",
            sections: data as any,
          },
        });
        return true;
      }
      case "submissions": {
        const items = value as CmsData["submissions"];
        const ids = items.map((item) => item.id);
        for (const item of items) {
          await prisma.newsSubmission.upsert({
            where: { id: item.id },
            update: {
              biodata: item.biodata as any,
              artikel: item.artikel as any,
              attachments: item.attachments as any,
              status: item.status,
              proofreadNotes: item.proofreadNotes || null,
              createdAt: item.createdAt,
            },
            create: {
              id: item.id,
              biodata: item.biodata as any,
              artikel: item.artikel as any,
              attachments: item.attachments as any,
              status: item.status,
              proofreadNotes: item.proofreadNotes || null,
              createdAt: item.createdAt,
            },
          });
        }
        if (ids.length > 0) {
          await prisma.newsSubmission.deleteMany({ where: { id: { notIn: ids } } });
        }
        return true;
      }
      default:
        return false;
    }
  } catch (err) {
    console.error(`[Prisma DB Write Error] Failed for ${key}:`, (err as Error).message);
    return false;
  }
}
