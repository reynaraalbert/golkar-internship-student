import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyUserSessionToken, USER_AUTH_COOKIE } from "@/lib/user-auth";
import {
  findStudentUserById,
  addExperience,
  updateExperience,
  deleteExperience,
  getExperiencesByUserId,
  type ExperienceType,
} from "@/lib/user-store";

export const dynamic = "force-dynamic";

const TYPES: ExperienceType[] = ["organisasi", "professional", "project"];

async function getSessionUser() {
  const token = cookies().get(USER_AUTH_COOKIE)?.value;
  const session = verifyUserSessionToken(token);
  if (!session) return null;
  return (await findStudentUserById(session.id)) || null;
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
  const user = await getSessionUser();
  if (!user) return unauthorized();
  const experiences = await getExperiencesByUserId(user.id);
  return NextResponse.json({ experiences });
}

/** Create a new experience, or update one when `id` matches an existing entry. */
export async function POST(req: NextRequest) {
  const user = await getSessionUser();
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
  if (body?.id) {
    // Update existing
    try {
      entry = await updateExperience(body.id, expData);
    } catch {
      // If not found, create new
      entry = await addExperience(user.id, expData);
    }
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

  await deleteExperience(id);
  const experiences = await getExperiencesByUserId(user.id);
  return NextResponse.json({ experiences });
}
