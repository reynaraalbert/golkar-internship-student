import { NextRequest, NextResponse } from "next/server";
import { getAllStudentUsers, findStudentUserById, saveStudentUser } from "@/lib/user-store";
import { staffGuard } from "@/lib/api-auth";
import { adminUpdateParticipantSchema, validationErrorResponse } from "@/lib/validation";
import { toSafeUser, toSafeUsers } from "@/lib/safe-user";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const guard = staffGuard(req);
  if ("response" in guard) return guard.response;

  try {
    const users = await getAllStudentUsers();
    return NextResponse.json({ users: toSafeUsers(users) });
  } catch (err) {
    console.error("[Admin Peserta GET]", (err as Error).message);
    return NextResponse.json({ error: "Gagal memuat data peserta." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const guard = staffGuard(req);
  if ("response" in guard) return guard.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Data yang dikirim tidak valid." }, { status: 400 });
  }

  const parsed = adminUpdateParticipantSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: validationErrorResponse(parsed.error) }, { status: 400 });
  }

  const { id, statusMagang, bio } = parsed.data;

  try {
    const user = await findStudentUserById(id);
    if (!user) {
      return NextResponse.json({ error: "Peserta tidak ditemukan." }, { status: 404 });
    }

    // Explicit whitelist: only verification status and admin notes are mutable
    // through this endpoint. Sensitive fields can never be supplied by a client.
    const patch: Record<string, unknown> = { id, email: user.email };
    if (statusMagang !== undefined) patch.statusMagang = statusMagang;
    if (bio !== undefined) patch.bio = bio;

    const updated = await saveStudentUser(patch as Parameters<typeof saveStudentUser>[0]);
    return NextResponse.json({ success: true, user: toSafeUser(updated) });
  } catch (err) {
    console.error("[Admin Peserta PUT]", (err as Error).message);
    return NextResponse.json({ error: "Gagal memperbarui data peserta." }, { status: 500 });
  }
}
