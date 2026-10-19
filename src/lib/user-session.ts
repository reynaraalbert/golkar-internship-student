import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { findStudentUserById, saveStudentUser } from "@/lib/user-store";
import { verifyUserSessionToken, USER_AUTH_COOKIE, passwordFingerprint } from "@/lib/user-auth";
import { toSafeUser } from "@/lib/safe-user";

export const dynamic = "force-dynamic";

/** Resolves the signed-in participant and re-checks the session fingerprint. */
export async function getSessionUser() {
  const token = cookies().get(USER_AUTH_COOKIE)?.value;
  const session = verifyUserSessionToken(token);
  if (!session) return null;

  const user = await findStudentUserById(session.id);
  if (!user) return null;

  // Password changed (e.g. reset) → old sessions are no longer valid.
  if (session.pv !== passwordFingerprint(user.passwordHash)) return null;

  return user;
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  };
}

export function setUserSessionCookie(
  response: NextResponse,
  token: string
): NextResponse {
  response.cookies.set(USER_AUTH_COOKIE, token, sessionCookieOptions());
  return response;
}
