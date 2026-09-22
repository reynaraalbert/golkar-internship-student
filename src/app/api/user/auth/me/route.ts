import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyUserSessionToken, USER_AUTH_COOKIE } from "@/lib/user-auth";
import { findStudentUserById } from "@/lib/user-store";

export async function GET() {
  const token = cookies().get(USER_AUTH_COOKIE)?.value;
  const session = verifyUserSessionToken(token);

  if (!session) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  const user = findStudentUserById(session.id);
  if (!user) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 404 });
  }

  const { passwordHash, ...safeUser } = user;
  return NextResponse.json({ authenticated: true, user: safeUser });
}
