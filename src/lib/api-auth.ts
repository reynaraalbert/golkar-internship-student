import { NextRequest } from "next/server";
import { AUTH_COOKIE, isValidToken } from "@/lib/auth";

export function readAuthToken(req: NextRequest): string | undefined {
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${AUTH_COOKIE}=`));
  if (!match) return undefined;
  return decodeURIComponent(match.split("=").slice(1).join("="));
}

export function requireAuth(req: NextRequest): boolean {
  return isValidToken(readAuthToken(req));
}
