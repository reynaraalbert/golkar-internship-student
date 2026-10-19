import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, getSessionFromToken, type AdminSession } from "@/lib/auth";

export function readAuthToken(req: NextRequest): string | undefined {
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${AUTH_COOKIE}=`));
  if (!match) return undefined;
  return decodeURIComponent(match.split("=").slice(1).join("="));
}

export function getAdminSession(req: NextRequest): AdminSession | null {
  return getSessionFromToken(readAuthToken(req));
}

export function requireAuth(req: NextRequest): boolean {
  return getAdminSession(req) !== null;
}

export function requireAdmin(req: NextRequest): AdminSession | null {
  const session = getAdminSession(req);
  if (!session || session.role !== "admin") return null;
  return session;
}

/** 401 when there is no session at all, 403 when the session is not an admin. */
export function adminGuard(req: NextRequest): { session: AdminSession } | { response: NextResponse } {
  const session = getAdminSession(req);
  if (!session) {
    return { response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  if (session.role !== "admin") {
    return { response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { session };
}

/** Any authenticated admin-area session (admin or tim seleksi). */
export function staffGuard(req: NextRequest): { session: AdminSession } | { response: NextResponse } {
  const session = getAdminSession(req);
  if (!session) {
    return { response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { session };
}
