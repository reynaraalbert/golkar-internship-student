import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateStrongPassword } from "@/lib/password-utils";

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
      await prisma.studentUser.update({
        where: { id: user.id },
        data: { resetToken: null, resetTokenExpiry: null },
      });
      return NextResponse.json({ error: "Tautan reset sudah kadaluarsa. Silakan minta ulang." }, { status: 400 });
    }

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
