import { NextRequest, NextResponse } from "next/server";
import { verifyCredentials, createSessionToken, registerSession, AUTH_COOKIE } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * Simple in-memory brute-force protection.
 * Resets on server restart (acceptable for single-admin use).
 * Max 10 failed attempts per IP, 15-minute lockout.
 */
const loginAttempts = new Map<string, { count: number; lockedUntil: number }>();
const MAX_ATTEMPTS = 10;
const LOCKOUT_MS   = 15 * 60 * 1000; // 15 minutes

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const now = Date.now();

  // Check lockout
  const attempt = loginAttempts.get(ip);
  if (attempt && attempt.lockedUntil > now) {
    const remaining = Math.ceil((attempt.lockedUntil - now) / 60000);
    return NextResponse.json(
      { error: `Terlalu banyak percobaan. Coba lagi dalam ${remaining} menit.` },
      { status: 429 }
    );
  }

  let body: { username?: string; password?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const username = (body.username || "").trim();
  const password = body.password || "";

  if (!verifyCredentials(username, password)) {
    // Track failed attempt
    const prev = loginAttempts.get(ip) ?? { count: 0, lockedUntil: 0 };
    const newCount = prev.count + 1;
    loginAttempts.set(ip, {
      count: newCount,
      lockedUntil: newCount >= MAX_ATTEMPTS ? now + LOCKOUT_MS : 0,
    });
    return NextResponse.json({ error: "Username atau password salah" }, { status: 401 });
  }

  // Successful login — reset attempt counter
  loginAttempts.delete(ip);

  const token = createSessionToken();
  registerSession(token);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  return res;
}
