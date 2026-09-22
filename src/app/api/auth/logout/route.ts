import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, revokeSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const res = NextResponse.json({ ok: true });
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${AUTH_COOKIE}=`));
  if (match) {
    const token = decodeURIComponent(match.split("=").slice(1).join("="));
    revokeSession(token);
  }
  res.cookies.set(AUTH_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
