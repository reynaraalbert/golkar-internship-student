import { NextResponse } from "next/server";
import { findStudentUserByEmail } from "@/lib/user-store";
import { sendPasswordResetEmail } from "@/lib/mailer";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export const runtime = "nodejs";


export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email wajib diisi." }, { status: 400 });
    }

    const user = await findStudentUserByEmail(email.toLowerCase().trim());

    // Always return success to prevent email enumeration attacks
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "Jika email terdaftar, tautan reset kata sandi telah dikirim.",
      });
    }

    // Generate a secure random token (hex, 64 chars)
    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    await prisma.studentUser.update({
      where: { id: user.id },
      data: { resetToken: token, resetTokenExpiry: expiry },
    });

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://golkar-internship-student.vercel.app";
    const resetUrl = `${baseUrl}/user/reset-password?token=${token}`;

    await sendPasswordResetEmail(user.email, user.name, resetUrl);

    return NextResponse.json({
      success: true,
      message: "Jika email terdaftar, tautan reset kata sandi telah dikirim.",
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    return NextResponse.json({ error: "Terjadi kesalahan. Silakan coba lagi." }, { status: 500 });
  }
}
