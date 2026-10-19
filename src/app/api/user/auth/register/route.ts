import { NextRequest, NextResponse } from "next/server";
import { findStudentUserByEmail, createStudentUser } from "@/lib/user-store";
import { createUserSessionToken } from "@/lib/user-auth";
import { setUserSessionCookie } from "@/lib/user-session";
import { hashPassword, validateStrongPassword } from "@/lib/password-utils";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { z } from "zod";

export const dynamic = "force-dynamic";

const registerSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter.").max(120),
  email: z.string().trim().toLowerCase().email("Format email tidak valid."),
  password: z.string().min(1).max(128),
  university: z.string().trim().min(2, "Nama perguruan tinggi wajib diisi.").max(160),
  major: z.string().trim().max(160).optional(),
  phone: z.string().trim().max(30).optional(),
});

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limited = rateLimit(`user-register:${ip}`, 5, 60 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Terlalu banyak pendaftaran dari perangkat ini. Coba lagi nanti." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSeconds) } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 400 });
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Data pendaftaran tidak valid." },
      { status: 400 }
    );
  }

  const { name, email, password, university, major, phone } = parsed.data;

  const pwError = validateStrongPassword(password);
  if (pwError) {
    return NextResponse.json({ error: pwError }, { status: 400 });
  }

  try {
    const existing = await findStudentUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: "Email sudah terdaftar. Silakan masuk atau gunakan email lain." },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    const newUser = await createStudentUser({
      name,
      email,
      passwordHash,
      university,
      major: major || "Umum",
      phone: phone || "",
    });

    const token = createUserSessionToken({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      passwordHash: newUser.passwordHash,
    });

    const response = NextResponse.json({
      success: true,
      message: "Pendaftaran berhasil",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        university: newUser.university,
        major: newUser.major,
      },
    });

    return setUserSessionCookie(response, token);
  } catch (err) {
    console.error("[User Register]", (err as Error).message);
    return NextResponse.json({ error: "Terjadi kesalahan. Silakan coba lagi." }, { status: 500 });
  }
}
