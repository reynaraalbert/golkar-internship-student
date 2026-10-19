import { NextRequest, NextResponse } from "next/server";
import {
  addExperience,
  updateExperience,
  deleteExperience,
  getExperiencesByUserId,
  type ExperienceType,
} from "@/lib/user-store";
import { getSessionUser } from "@/lib/user-session";

export const dynamic = "force-dynamic";

const TYPES: ExperienceType[] = ["organisasi", "professional", "project"];

function normalizeUrl(raw: string): string | null {
  const v = raw.trim();
  if (!v) return "";
  const withProtocol = /^https?:\/\//i.test(v) ? v : `https://${v}`;
  try {
    new URL(withProtocol);
    return withProtocol;
  } catch {
    return null;
  }
}

const unauthorized = () => NextResponse.json({ error: "Unauthorized" }, { status: 401 });

export async function GET() {
  const user = await getSessionUser();
  if (!user) return unauthorized();
  const experiences = await getExperiencesByUserId(user.id);
  return NextResponse.json({ experiences });
}

/** Create a new experience, or update one owned by the signed-in participant. */
export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 400 });
  }

  const type = body?.type as ExperienceType;
  if (!TYPES.includes(type)) {
    return NextResponse.json({ error: "Jenis pengalaman tidak valid." }, { status: 400 });
  }
  const title = String(body?.title ?? "").trim();
  if (!title) {
    return NextResponse.json({ error: "Nama organisasi / perusahaan / project wajib diisi." }, { status: 400 });
  }
  const url = normalizeUrl(String(body?.url ?? ""));
  if (url === null) {
    return NextResponse.json({ error: "Format link tidak valid." }, { status: 400 });
  }
  if (type === "project" && !url) {
    return NextResponse.json({ error: "Link project wajib diisi." }, { status: 400 });
  }

  const monthRe = /^\d{4}-\d{2}$/;
  const startDate = monthRe.test(String(body?.startDate ?? "")) ? String(body.startDate) : "";
  const isCurrent = Boolean(body?.isCurrent);
  const endDate = !isCurrent && monthRe.test(String(body?.endDate ?? "")) ? String(body.endDate) : "";
  if (startDate && endDate && endDate < startDate) {
    return NextResponse.json({ error: "Tanggal selesai tidak boleh sebelum tanggal mulai." }, { status: 400 });
  }

  const expData = {
    type,
    title,
    role: String(body?.role ?? "").trim(),
    startDate,
    endDate,
    isCurrent,
    description: String(body?.description ?? "").trim(),
    url,
  };

  let entry;
  const existingId = typeof body?.id === "string" ? body.id : "";
  if (existingId) {
    // IDOR guard: only allow updating an experience that belongs to this user.
    const owned = (await getExperiencesByUserId(user.id)).some((e) => e.id === existingId);
    if (!owned) {
      return NextResponse.json({ error: "Pengalaman tidak ditemukan." }, { status: 404 });
    }
    entry = await updateExperience(existingId, expData);
  } else {
    entry = await addExperience(user.id, expData);
  }

  const experiences = await getExperiencesByUserId(user.id);
  return NextResponse.json({ experience: entry, experiences });
}

export async function DELETE(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return unauthorized();

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id wajib diisi" }, { status: 400 });

  // IDOR guard: verify ownership before deleting.
  const owned = (await getExperiencesByUserId(user.id)).some((e) => e.id === id);
  if (!owned) {
    return NextResponse.json({ error: "Pengalaman tidak ditemukan." }, { status: 404 });
  }

  await deleteExperience(id);
  const experiences = await getExperiencesByUserId(user.id);
  return NextResponse.json({ experiences });
}
