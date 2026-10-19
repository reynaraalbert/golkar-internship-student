import { NextRequest, NextResponse } from "next/server";
import { verifyCredentials, createSessionToken, AUTH_COOKIE, type AdminRole } from "@/lib/auth";
import { getClientIp, rateLimit, resetRateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const MAX_ATTEMPTS = 10;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limited = rateLimit(`admin-login:${ip}`, MAX_ATTEMPTS, WINDOW_MS);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Terlalu banyak percobaan. Silakan coba lagi nanti." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSeconds) } }
    );
  }

  let body: { username?: unknown; password?: unknown; role?: unknown } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 400 });
  }

  const username = typeof body.username === "string" ? body.username.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const role: AdminRole = body.role === "seleksi" ? "seleksi" : "admin";

  if (!username || !password || !verifyCredentials(username, password)) {
    return NextResponse.json(
      { error: "Username atau kata sandi salah." },
      { status: 401 }
    );
  }

  resetRateLimit(`admin-login:${ip}`);

  const token = createSessionToken(role);
  const res = NextResponse.json({ ok: true, role });
  res.cookies.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return res;
}
