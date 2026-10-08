import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyUserSessionToken, USER_AUTH_COOKIE } from "@/lib/user-auth";
import { findStudentUserById, saveStudentUser } from "@/lib/user-store";

export async function GET() {
  const token = cookies().get(USER_AUTH_COOKIE)?.value;
  const session = verifyUserSessionToken(token);

  if (!session) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  const user = await findStudentUserById(session.id);
  if (!user) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 404 });
  }

  const { passwordHash, ...safeUser } = user;
  return NextResponse.json({ authenticated: true, user: safeUser });
}

export async function POST(req: Request) {
  try {
    const token = cookies().get(USER_AUTH_COOKIE)?.value;
    const session = verifyUserSessionToken(token);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await findStudentUserById(session.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updates = await req.json();
    
    const updatedUser = await saveStudentUser({ ...user, ...updates });

    const { passwordHash, ...safeUser } = updatedUser;
    return NextResponse.json({ success: true, user: safeUser });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
