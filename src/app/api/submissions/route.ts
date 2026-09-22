import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { readDbCollection, writeDbCollection } from "@/lib/db-store";
import type { NewsSubmission } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!requireAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const submissions = (await readDbCollection("submissions")) as NewsSubmission[] | null;
  return NextResponse.json(submissions ?? []);
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Omit<NewsSubmission, "id" | "status" | "createdAt">;
    const existing = (await readDbCollection("submissions")) as NewsSubmission[] | null;
    if (existing === null) {
      // We could not read the current list (DB unreachable). Writing now would
      // risk clobbering existing rows, so fail clearly instead of losing data.
      return NextResponse.json({ error: "Database tidak terjangkau saat ini. Coba lagi beberapa saat." }, { status: 503 });
    }
    const submissions: NewsSubmission[] = existing;
    const newSubmission: NewsSubmission = {
      ...body,
      id: `sub-${Date.now()}`,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    submissions.unshift(newSubmission);
    const ok = await writeDbCollection("submissions", submissions);
    if (!ok) {
      return NextResponse.json({ error: "Gagal menyimpan berita ke database" }, { status: 500 });
    }
    return NextResponse.json({ ok: true, id: newSubmission.id });
  } catch (err) {
    console.error("[Submissions POST Error]", (err as Error).message);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}