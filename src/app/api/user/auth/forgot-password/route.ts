import { NextRequest, NextResponse } from "next/server";
import { findStudentUserByEmail } from "@/lib/user-store";
import { sendPasswordResetEmail } from "@/lib/mailer";
import { prisma } from "@/lib/prisma";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { generateResetToken, hashResetToken } from "@/lib/reset-token";
import { z } from "zod";

export const dynamic = "force-dynamic";

const forgotSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
});

const GENERIC_MESSAGE = "Jika email terdaftar, tautan reset kata sandi telah dikirim.";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  const ipLimit = rateLimit(`forgot-ip:${ip}`, 5, 15 * 60 * 1000);
  if (!ipLimit.ok) {
    return NextResponse.json(
      { error: "Terlalu banyak permintaan. Silakan coba lagi nanti." },
      { status: 429, headers: { "Retry-After": String(ipLimit.retryAfterSeconds) } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 400 });
  }

  const parsed = forgotSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: true, message: GENERIC_MESSAGE });
  }

  const { email } = parsed.data;

  const emailLimit = rateLimit(`forgot-email:${email}`, 3, 15 * 60 * 1000);
  if (!emailLimit.ok) {
    return NextResponse.json(
      { error: "Terlalu banyak permintaan untuk email ini. Silakan coba lagi nanti." },
      { status: 429, headers: { "Retry-After": String(emailLimit.retryAfterSeconds) } }
    );
  }

  try {
    const user = await findStudentUserByEmail(email);

    // Always return the same response to prevent email enumeration.
    if (!user) {
      return NextResponse.json({ success: true, message: GENERIC_MESSAGE });
    }

    const token = generateResetToken();
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.studentUser.update({
      where: { id: user.id },
      data: { resetToken: hashResetToken(token), resetTokenExpiry: expiry },
    });

    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
      "https://golkar-internship-student.vercel.app";
    const resetUrl = `${baseUrl}/user/reset-password?token=${token}`;

    await sendPasswordResetEmail(user.email, user.name, resetUrl);

    return NextResponse.json({ success: true, message: GENERIC_MESSAGE });
  } catch (err) {
    console.error("[Forgot Password]", (err as Error).message);
    // Do not reveal internal failures for this endpoint.
    return NextResponse.json({ success: true, message: GENERIC_MESSAGE });
  }
}


