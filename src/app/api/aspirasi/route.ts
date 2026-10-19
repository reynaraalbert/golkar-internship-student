import { NextRequest, NextResponse } from "next/server";
import { staffGuard } from "@/lib/api-auth";
import { readDbCollection, writeDbCollection } from "@/lib/db-store";
import type { Aspirasi } from "@/lib/data";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { sanitizeText } from "@/lib/sanitize";
import { z } from "zod";

export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 16 * 1024; // 16 KB is plenty for a text aspiration

const aspirasiSchema = z.object({
  mode: z.enum(["Terbuka", "Anonim"]),
  name: z.string().trim().max(120).optional(),
  email: z.string().trim().max(200).optional(),
  whatsapp: z.string().trim().max(30).optional(),
  subject: z.string().trim().min(3, "Subjek minimal 3 karakter.").max(200),
  message: z.string().trim().min(10, "Isi aspirasi minimal 10 karakter.").max(5000, "Isi aspirasi maksimal 5000 karakter."),
  category: z.string().trim().min(1).max(120),
  /** Hidden field; real users never fill this. */
  website: z.string().max(0).optional().or(z.literal("")),
});

export async function GET(req: NextRequest) {
  const guard = staffGuard(req);
  if ("response" in guard) return guard.response;

  try {
    const aspirasi = (await readDbCollection("aspirasi")) as Aspirasi[] | null;
    return NextResponse.json(aspirasi ?? []);
  } catch (err) {
    console.error("[Aspirasi GET]", (err as Error).message);
    return NextResponse.json({ error: "Gagal memuat aspirasi." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limited = rateLimit(`aspirasi:${ip}`, 5, 15 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Terlalu banyak pengiriman. Silakan coba lagi nanti." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSeconds) } }
    );
  }

  const contentLength = Number(req.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Data yang dikirim terlalu besar." }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 400 });
  }

  const parsed = aspirasiSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Data aspirasi tidak valid." },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Honeypot: silently accept so bots do not learn they were filtered.
  if (data.website) {
    return NextResponse.json({ ok: true });
  }

  if (data.mode === "Terbuka") {
    if (!data.name) {
      return NextResponse.json({ error: "Nama wajib diisi untuk mode terbuka." }, { status: 400 });
    }
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return NextResponse.json({ error: "Format email tidak valid." }, { status: 400 });
    }
  }
  if (data.whatsapp && !/^[0-9+\-\s()]{8,20}$/.test(data.whatsapp)) {
    return NextResponse.json({ error: "Format nomor WhatsApp tidak valid." }, { status: 400 });
  }

  try {
    const existing = (await readDbCollection("aspirasi")) as Aspirasi[] | null;
    if (existing === null) {
      // Database unreachable — writing now could clobber existing rows.
      return NextResponse.json({ error: "Database tidak terjangkau saat ini. Coba lagi beberapa saat." }, { status: 503 });
    }

    const newAspirasi: Aspirasi = {
      id: `asp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      mode: data.mode,
      name: data.mode === "Terbuka" ? sanitizeText(data.name, 120) : undefined,
      email: data.mode === "Terbuka" ? sanitizeText(data.email, 200) : undefined,
      whatsapp: data.whatsapp ? sanitizeText(data.whatsapp, 30) : undefined,
      subject: sanitizeText(data.subject, 200),
      message: sanitizeText(data.message, 5000),
      category: sanitizeText(data.category, 120),
      status: "new",
      createdAt: new Date().toISOString(),
    };

    existing.unshift(newAspirasi);
    const ok = await writeDbCollection("aspirasi", existing);
    if (!ok) {
      return NextResponse.json({ error: "Gagal menyimpan aspirasi ke database" }, { status: 500 });
    }
    return NextResponse.json({ ok: true, id: newAspirasi.id });
  } catch (err) {
    console.error("[Aspirasi POST]", (err as Error).message);
    return NextResponse.json({ error: "Gagal menyimpan aspirasi." }, { status: 500 });
  }
}
