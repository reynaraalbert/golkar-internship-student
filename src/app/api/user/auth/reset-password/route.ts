import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, validateStrongPassword } from "@/lib/password-utils";
import { hashResetToken, isValidResetTokenShape } from "@/lib/reset-token";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { z } from "zod";

export const dynamic = "force-dynamic";

const resetSchema = z.object({
  token: z.string(),
  password: z.string().min(1).max(128),
});

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limited = rateLimit(`reset-password:${ip}`, 10, 15 * 60 * 1000);
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

  const parsed = resetSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Token dan kata sandi baru wajib diisi." }, { status: 400 });
  }

  const { token, password } = parsed.data;

  // CRITICAL: never query with an empty/undefined token. Prisma ignores
  // `where: { resetToken: undefined }`, which would match an arbitrary user.
  if (!isValidResetTokenShape(token)) {
    return NextResponse.json({ error: "Tautan reset tidak valid atau sudah kadaluarsa." }, { status: 400 });
  }

  const pwError = validateStrongPassword(password);
  if (pwError) {
    return NextResponse.json({ error: pwError }, { status: 400 });
  }

  try {
    const tokenHash = hashResetToken(token);
    const user = await prisma.studentUser.findFirst({
      where: { resetToken: tokenHash },
      select: { id: true, resetTokenExpiry: true },
    });

    if (!user || !user.resetTokenExpiry) {
      return NextResponse.json({ error: "Tautan reset tidak valid atau sudah kadaluarsa." }, { status: 400 });
    }

    if (new Date() > user.resetTokenExpiry) {
      await prisma.studentUser.update({
        where: { id: user.id },
        data: { resetToken: null, resetTokenExpiry: null },
      });
      return NextResponse.json({ error: "Tautan reset sudah kadaluarsa. Silakan minta ulang." }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);

    // One-time use: clear the token atomically in the same update.
    const result = await prisma.studentUser.updateMany({
      where: { id: user.id, resetToken: tokenHash },
      data: { passwordHash, resetToken: null, resetTokenExpiry: null },
    });

    if (result.count === 0) {
      return NextResponse.json({ error: "Tautan reset sudah digunakan." }, { status: 400 });
    }

    // Invalidate existing sessions: the session token is bound to a
    // fingerprint of the old password hash, so all old cookies stop working.

    return NextResponse.json({ success: true, message: "Kata sandi berhasil direset. Silakan login." });
  } catch (err) {
    console.error("[Reset Password]", (err as Error).message);
    return NextResponse.json({ error: "Terjadi kesalahan. Silakan coba lagi." }, { status: 500 });
  }
}
