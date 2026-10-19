import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { findStudentUserById } from "@/lib/user-store";
import { verifyUserSessionToken, USER_AUTH_COOKIE, passwordFingerprint } from "@/lib/user-auth";

function readCookie(req: Request | undefined, name: string): string | undefined {
  if (req) {
    const header = req.headers.get("cookie") || "";
    const match = header
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith(`${name}=`));
    if (match) return decodeURIComponent(match.split("=").slice(1).join("="));
  }
  try {
    return cookies().get(name)?.value;
  } catch {
    return undefined;
  }
}

/** Resolves the signed-in participant and re-checks the session fingerprint. */
export async function getSessionUser(req?: Request) {
  const token = readCookie(req, USER_AUTH_COOKIE);
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
