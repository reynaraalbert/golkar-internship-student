import { NextResponse } from "next/server";
import { AUTH_COOKIE, isValidToken } from "@/lib/auth";

export async function GET(req: Request) {
  const headers = req.headers;
  const cookieHeader = headers.get("cookie") || "";
  const match = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${AUTH_COOKIE}=`));
  const token = match ? decodeURIComponent(match.split("=")[1]) : undefined;

  if (!token || !isValidToken(token)) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true });
}
