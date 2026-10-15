import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";


/** Password must have: min 8 chars, uppercase, lowercase, digit, special char */
export function validateStrongPassword(password: string): string | null {
  if (password.length < 8) return "Kata sandi minimal 8 karakter.";
  if (!/[A-Z]/.test(password)) return "Kata sandi harus mengandung minimal satu huruf kapital (A-Z).";
  if (!/[a-z]/.test(password)) return "Kata sandi harus mengandung minimal satu huruf kecil (a-z).";
  if (!/[0-9]/.test(password)) return "Kata sandi harus mengandung minimal satu angka (0-9).";
  if (!/[^A-Za-z0-9]/.test(password)) return "Kata sandi harus mengandung minimal satu simbol (mis. @, #, !, _).";
  return null;
}

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ error: "Token dan kata sandi baru wajib diisi." }, { status: 400 });
    }

    // Validate password strength
    const pwError = validateStrongPassword(password);
    if (pwError) {
      return NextResponse.json({ error: pwError }, { status: 400 });
    }

    // Find user by token
    const user = await prisma.studentUser.findFirst({
      where: { resetToken: token },
      select: { id: true, resetToken: true, resetTokenExpiry: true },
    });

    if (!user || !user.resetTokenExpiry) {
      return NextResponse.json({ error: "Tautan reset tidak valid atau sudah kadaluarsa." }, { status: 400 });
    }

    if (new Date() > user.resetTokenExpiry) {
      // Expired — clean up
      await prisma.studentUser.update({
        where: { id: user.id },
        data: { resetToken: null, resetTokenExpiry: null },
      });
      return NextResponse.json({ error: "Tautan reset sudah kadaluarsa. Silakan minta ulang." }, { status: 400 });
    }

    // Update password (stored as plain hash for now — consistent with existing login logic)
    await prisma.studentUser.update({
      where: { id: user.id },
      data: { passwordHash: password, resetToken: null, resetTokenExpiry: null },
    });

    return NextResponse.json({ success: true, message: "Kata sandi berhasil direset. Silakan login." });
  } catch (err) {
    console.error("Reset password error:", err);
    return NextResponse.json({ error: "Terjadi kesalahan. Silakan coba lagi." }, { status: 500 });
  }
}
