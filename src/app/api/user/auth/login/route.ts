import { NextRequest, NextResponse } from "next/server";
import { findStudentUserByEmail, updateStudentPasswordHash } from "@/lib/user-store";
import { createUserSessionToken } from "@/lib/user-auth";
import { setUserSessionCookie } from "@/lib/user-session";
import { verifyPassword } from "@/lib/password-utils";
import { getClientIp, rateLimit, resetRateLimit } from "@/lib/rate-limit";
import { z } from "zod";

export const dynamic = "force-dynamic";

const MAX_ATTEMPTS = 10;
const WINDOW_MS = 15 * 60 * 1000;

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1).max(128),
});

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limited = rateLimit(`user-login:${ip}`, MAX_ATTEMPTS, WINDOW_MS);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Terlalu banyak percobaan. Silakan coba lagi nanti." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSeconds) } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Email atau kata sandi salah." }, { status: 401 });
  }

  const { email, password } = parsed.data;

  try {
    const user = await findStudentUserByEmail(email);
    const check = user
      ? await verifyPassword(password, user.passwordHash)
      : { ok: false, needsRehash: false };

    if (!user || !check.ok) {
      // Generic message: do not reveal whether the account exists.
      return NextResponse.json({ error: "Email atau kata sandi salah." }, { status: 401 });
    }

    // Transparently upgrade legacy plaintext passwords to bcrypt.
    let passwordHash = user.passwordHash;
    if (check.needsRehash) {
      const { hashPassword } = await import("@/lib/password-utils");
      passwordHash = await hashPassword(password);
      await updateStudentPasswordHash(user.id, passwordHash);
    }

    resetRateLimit(`user-login:${ip}`);

    const token = createUserSessionToken({
      id: user.id,
      email: user.email,
      name: user.name,
      passwordHash,
    });

    const response = NextResponse.json({
      success: true,
      message: "Login berhasil",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        university: user.university,
        major: user.major,
      },
    });

    return setUserSessionCookie(response, token);
  } catch (err) {
    console.error("[User Login]", (err as Error).message);
    return NextResponse.json({ error: "Terjadi kesalahan. Silakan coba lagi." }, { status: 500 });
  }
}

