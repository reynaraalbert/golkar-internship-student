import { NextResponse } from "next/server";
import { findStudentUserByEmail } from "@/lib/user-store";
import { createUserSessionToken, USER_AUTH_COOKIE } from "@/lib/user-auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email dan password wajib diisi." }, { status: 400 });
    }

    const user = await findStudentUserByEmail(email);
    if (!user || user.passwordHash !== password) {
      return NextResponse.json({ error: "Email atau password tidak sesuai." }, { status: 401 });
    }

    const token = createUserSessionToken({ id: user.id, email: user.email, name: user.name });

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

    response.cookies.set(USER_AUTH_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
