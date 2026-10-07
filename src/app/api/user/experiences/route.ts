import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyUserSessionToken, USER_AUTH_COOKIE } from "@/lib/user-auth";
import {
  findStudentUserById,
  saveStudentUser,
  type ExperienceType,
  type UserExperience,
} from "@/lib/user-store";

export const dynamic = "force-dynamic";

const TYPES: ExperienceType[] = ["organisasi", "professional", "project"];

function getSessionUser() {
  const token = cookies().get(USER_AUTH_COOKIE)?.value;
  const session = verifyUserSessionToken(token);
  if (!session) return null;
  return findStudentUserById(session.id) || null;
}

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
  const user = getSessionUser();
  if (!user) return unauthorized();
  return NextResponse.json({ experiences: user.experiences || [] });
}

/** Create a new experience, or update one when `id` matches an existing entry. */
export async function POST(req: NextRequest) {
  const user = getSessionUser();
  if (!user) return unauthorized();

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
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

  const list = user.experiences || [];
  const existing = body?.id ? list.find((e) => e.id === body.id) : undefined;

  const entry: UserExperience = {
    id: existing?.id || `exp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    title,
    role: String(body?.role ?? "").trim(),
    startDate,
    endDate,
    isCurrent,
    description: String(body?.description ?? "").trim(),
    url,
    createdAt: existing?.createdAt || new Date().toISOString(),
  };

  const next = existing ? list.map((e) => (e.id === entry.id ? entry : e)) : [...list, entry];
  saveStudentUser({ ...user, experiences: next });
  return NextResponse.json({ experience: entry, experiences: next });
}

export async function DELETE(req: NextRequest) {
  const user = getSessionUser();
  if (!user) return unauthorized();

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id wajib diisi" }, { status: 400 });

  const next = (user.experiences || []).filter((e) => e.id !== id);
  saveStudentUser({ ...user, experiences: next });
  return NextResponse.json({ experiences: next });
}
