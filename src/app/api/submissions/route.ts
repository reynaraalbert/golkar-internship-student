import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/user-session";
import { getAdminSession } from "@/lib/api-auth";
import { readDbCollection, writeDbCollection } from "@/lib/db-store";
import type { NewsSubmission } from "@/lib/data";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { isSafeHttpUrl, sanitizeText } from "@/lib/sanitize";
import { z } from "zod";

export const dynamic = "force-dynamic";

const KATEGORI = [
  "Kegiatan Magang",
  "Opini Mahasiswa",
  "Pengumuman",
  "Siaran Pers",
  "Kisah Alumni",
  "Lainnya",
] as const;

const sumberSchema = z.object({
  judul: z.string().trim().max(200).optional().default(""),
  url: z.string().trim().max(500).optional().default(""),
});

const submissionSchema = z.object({
  artikel: z.object({
    judul: z.string().trim().min(5, "Judul minimal 5 karakter.").max(200, "Judul maksimal 200 karakter."),
    kategori: z.enum(KATEGORI),
    tanggal: z.string().trim().max(40).optional().default(""),
    ringkasan: z.string().trim().min(10, "Ringkasan minimal 10 karakter.").max(400, "Ringkasan maksimal 400 karakter."),
    isiBerita: z.string().trim().min(50, "Isi berita minimal 50 karakter.").max(20000, "Isi berita terlalu panjang."),
    tags: z.string().trim().max(300).optional().default(""),
    sumber: z.array(sumberSchema).max(10).optional().default([]),
  }),
  attachments: z
    .object({
      imageUrl: z.string().trim().max(1000).optional(),
      documentUrl: z.string().trim().max(1000).optional(),
    })
    .optional()
    .default({}),
});

/** Participants can only publish as "Peserta GIS" (tipePenulis "umum"). */
const PARTICIPANT_AUTHOR_TYPE = "umum";

export async function GET(req: NextRequest) {
  // Admins moderate every submission; participants only ever see their own.
  const isAdmin = getAdminSession(req) !== null;

  try {
    const submissions = (await readDbCollection("submissions")) as NewsSubmission[] | null;

    if (isAdmin) {
      return NextResponse.json(submissions ?? []);
    }

    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const mine = (submissions ?? []).filter((s) => s.biodata?.email === user.email);
    return NextResponse.json(mine);
  } catch (err) {
    console.error("[Submissions GET]", (err as Error).message);
    return NextResponse.json({ error: "Gagal memuat kiriman berita." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json(
      { error: "Anda harus masuk sebagai peserta untuk mengirim berita." },
      { status: 401 }
    );
  }

  const ip = getClientIp(req);
  const limited = rateLimit(`submission:${user.id}:${ip}`, 5, 60 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Terlalu banyak kiriman. Silakan coba lagi nanti." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSeconds) } }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 400 });
  }

  const parsed = submissionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Data berita tidak valid." },
      { status: 400 }
    );
  }

  const { artikel, attachments } = parsed.data;

  const imageUrl = attachments.imageUrl || "";
  const documentUrl = attachments.documentUrl || "";
  if (imageUrl && !isSafeHttpUrl(imageUrl)) {
    return NextResponse.json({ error: "URL gambar tidak valid." }, { status: 400 });
  }
  if (documentUrl && !isSafeHttpUrl(documentUrl)) {
    return NextResponse.json({ error: "URL dokumen tidak valid." }, { status: 400 });
  }

  try {
    const existing = (await readDbCollection("submissions")) as NewsSubmission[] | null;
    if (existing === null) {
      return NextResponse.json(
        { error: "Database tidak terjangkau saat ini. Coba lagi beberapa saat." },
        { status: 503 }
      );
    }

    // Author identity always comes from the verified session, never the client.
    const newSubmission: NewsSubmission = {
      id: `sub-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      biodata: {
        tipePenulis: PARTICIPANT_AUTHOR_TYPE,
        nama: user.name,
        email: user.email,
      },
      artikel: {
        judul: sanitizeText(artikel.judul, 200),
        kategori: artikel.kategori,
        tanggal: sanitizeText(artikel.tanggal, 40),
        ringkasan: sanitizeText(artikel.ringkasan, 400),
        isiBerita: sanitizeText(artikel.isiBerita, 20000),
        tags: sanitizeText(artikel.tags, 300),
        sumber: artikel.sumber
          .filter((s) => s.judul && isSafeHttpUrl(s.url))
          .map((s) => ({ judul: sanitizeText(s.judul, 200), url: s.url })),
      },
      attachments: {
        imageUrl: imageUrl || undefined,
        documentUrl: documentUrl || undefined,
      },
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const submissions = existing;
    submissions.unshift(newSubmission);
    const ok = await writeDbCollection("submissions", submissions);
    if (!ok) {
      return NextResponse.json({ error: "Gagal menyimpan berita ke database" }, { status: 500 });
    }
    return NextResponse.json({ ok: true, id: newSubmission.id });
  } catch (err) {
    console.error("[Submissions POST Error]", (err as Error).message);
    return NextResponse.json({ error: "Gagal menyimpan berita." }, { status: 500 });
  }
}
