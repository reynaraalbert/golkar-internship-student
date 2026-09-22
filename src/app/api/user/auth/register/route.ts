import { NextResponse } from "next/server";
import { findStudentUserByEmail, saveStudentUser, type StudentUser } from "@/lib/user-store";
import { createUserSessionToken, USER_AUTH_COOKIE } from "@/lib/user-auth";

export async function POST(request: Request) {
  try {
    const { name, email, password, university, major, phone } = await request.json();

    if (!name || !email || !password || !university) {
      return NextResponse.json({ error: "Nama, email, password, dan universitas wajib diisi." }, { status: 400 });
    }

    const existing = findStudentUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: "Email sudah terdaftar. Silakan gunakan email lain atau masuk." }, { status: 400 });
    }

    const newUser: StudentUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      passwordHash: password,
      university,
      major: major || "Umum",
      phone: phone || "-",
      photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      statusMagang: "Terverifikasi",
      posisiDilamar: "Program Magang Kebijakan Publik",
      createdAt: new Date().toISOString(),
    };

    saveStudentUser(newUser);

    const token = createUserSessionToken({ id: newUser.id, email: newUser.email, name: newUser.name });

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

    response.cookies.set(USER_AUTH_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
