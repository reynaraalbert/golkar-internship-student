import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { findStudentUserById, saveStudentUser } from "@/lib/user-store";
import { verifyUserSessionToken, USER_AUTH_COOKIE, passwordFingerprint } from "@/lib/user-auth";
import { participantUpdateSchema } from "@/lib/validation";
import { toSafeUser } from "@/lib/safe-user";

export const dynamic = "force-dynamic";

async function getSessionUser() {
  const token = cookies().get(USER_AUTH_COOKIE)?.value;
  const session = verifyUserSessionToken(token);
  if (!session) return null;

  const user = await findStudentUserById(session.id);
  if (!user) return null;
  if (session.pv !== passwordFingerprint(user.passwordHash)) return null;
  return user;
}

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, user: toSafeUser(user) });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 400 });
  }

  const parsed = participantUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Data yang dikirim tidak valid." },
      { status: 400 }
    );
  }

  try {
    // Whitelisted fields only — the session user's id/email always win, and
    // role/passwordHash/statusMagang can never be set from this endpoint.
    const updatedUser = await saveStudentUser({
      id: user.id,
      email: user.email,
      ...parsed.data,
    });

    return NextResponse.json({ success: true, user: toSafeUser(updatedUser) });
  } catch (err) {
    console.error("[User Me POST]", (err as Error).message);
    return NextResponse.json({ error: "Gagal menyimpan perubahan." }, { status: 500 });
  }
}
